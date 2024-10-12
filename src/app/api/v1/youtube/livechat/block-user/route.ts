import { NextResponse, NextRequest } from 'next/server';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';
import { redisClient, CheckRedisConnection } from '@/app/api/utils/redis';

const logger = createLoggerWithLabel('BlockUser');

const SHARED_SECRET = process.env.SHARED_SECRET;

/* To Block a user using channelID */
export async function POST(req: NextRequest) {
  /* Verify the shared secret */
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${SHARED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { messageId, liveChatId, authorChannelId, type } = await req.json();

    const youtube = await getYoutubeClient();

    logger.info(
      `Banning livechatUser with id : [${authorChannelId}] with type : ${type}`
    );

    let banResponse;

    switch (type) {
      case 'temporary':
        banResponse = await youtube.liveChatBans.insert({
          part: ['id', 'snippet'],
          resource: {
            snippet: {
              liveChatId: liveChatId,
              type: 'temporary',
              banDurationSeconds: 300, // in seconds.
              bannedUserDetails: {
                channelId: authorChannelId,
              },
            },
          },
        });
        break;
      case 'permanent':
        banResponse = await youtube.liveChatBans.insert({
          part: ['id', 'snippet'],
          resource: {
            snippet: {
              liveChatId: liveChatId,
              type: 'permanent',
              bannedUserDetails: {
                channelId: authorChannelId,
              },
            },
          },
        });
        break;
      default:
        break;
    }

    /* Call the YouTube API to block the user */
    logger.info(`Blocked user ${authorChannelId} in live chat ${liveChatId}`);

    const redisConnected = await CheckRedisConnection(redisClient);

    if (redisConnected && banResponse?.data) {
      const { id: banId } = banResponse.data;
      logger.info(`Storing ban info for messageId: ${messageId} in Redis`);

      await redisClient.sAdd('blockedMessageIds', messageId);
      await redisClient.hSet(`messageBanId:${messageId}`, {
        banId,
        authorChannelId,
      });

      /* Set Redis key expiration to 1 day (86400 seconds) */
      await redisClient.expire(`messageBanId:${messageId}`, 86400);

      logger.info(`Stored messageId and banId in Redis successfully.`);
    } else {
      logger.warn(`Redis service is unavailable or ban response was empty.`);
    }

    logger.info(`Response: 200 OK`);
    return makeResponse(200, true, `Blocked User with id`, banResponse?.data);
  } catch (error) {
    logger.error(`Error blocking user ${error}`);
    return makeResponse(500, false, `Error while Blocked User with id`, null);
  }
}

/* To unblock a user on livechat */
export async function PUT(req: NextRequest) {
  try {
    const { messageId } = await req.json();

    const redisConnected = await CheckRedisConnection(redisClient);

    const youtube = await getYoutubeClient();

    if (redisConnected) {
      try {
        logger.info(`Fetching banId for ${messageId} from messageBanId hash`);

        const messageBanData = await redisClient.hGetAll(
          `messageBanId:${messageId}`
        );

        if (!messageBanData || !messageBanData.banId) {
          logger.error(`MessageBanData or banId is not available in Redis.`);
          return makeResponse(404, false, `Ban ID not found`, null);
        }

        const { banId, authorChannelId } = messageBanData;

        logger.info(
          `Calling YouTube API to unblock user: [${authorChannelId}] with banId : ${banId}`
        );
        await youtube.liveChatBans.delete({
          id: banId,
        });

        logger.info(
          `Removing messageId: ${messageId} from blockedMessageIds set.`
        );
        await redisClient.sRem('blockedMessageIds', messageId);

        logger.info(`Unblocked user ${authorChannelId} in live chat ${banId}`);
        return makeResponse(200, true, `Unblocked User`, { authorChannelId });
      } catch (error) {
        logger.error(`Error unblocking user: ${error}`);
        return makeResponse(500, false, `Error unblocking user`, null);
      }
    } else {
      logger.warn(`Redis service unavailable, operation failed.`);
      return makeResponse(503, false, `Redis Service Unavailable`, null);
    }
  } catch (error) {
    logger.error(`Error processing request: ${error}`);
    return makeResponse(500, false, `Error processing request`, null);
  }
}

/* To get the information of all the blocked users or a specific blocked user by messageId */
export async function GET(req: Request) {
  try {
    /* Check if Redis is connected */
    const redisConnected = await CheckRedisConnection(redisClient);
    if (!redisConnected) {
      logger.error('Redis is not connected, fetching blocked user data failed');
      return makeResponse(503, false, 'Redis Service Unavailable', null);
    }

    /* Parse the URL to check if a messageId is present */
    const url = new URL(req.url);
    const messageId = url.searchParams.get('messageId');

    /* If a specific messageId is provided, fetch data for that ID */
    if (messageId) {
      const key = `liveChatData:${messageId}`;

      /* Fetch user data from Redis hash for the given messageId */
      logger.info(
        `Fetching Blocked user information with messageId : ${messageId}`
      );
      const userData = await redisClient.hGetAll(key);

      if (!userData || Object.keys(userData).length === 0) {
        logger.warn(`No data found for messageId: ${messageId}`);
        return makeResponse(
          404,
          false,
          'No data found for the specified messageId',
          null
        );
      }

      /* Collect the required fields */
      const userInfo = {
        profileImage: userData.profileImage,
        authorChannelId: userData.authorChannelId,
        id: userData.id,
        channelName: userData.channelName,
        messageContent: userData.messageContent,
      };

      /* Return the specific blocked user data */
      logger.info(`Response: 200 OK`);
      return makeResponse(
        200,
        true,
        'Blocked user data fetched successfully',
        userInfo
      );
    }

    /* If no messageId is provided, fetch all blocked users */
    logger.info(`Fetching all blocked users information.`);
    const blockedIds = await redisClient.sMembers('blockedMessageIds');

    if (blockedIds.length === 0) {
      logger.info(`No users are blocked`);
      logger.info(`Response: 200 OK`);
      return makeResponse(200, true, 'No blocked users found', []);
    }

    const blockedUsers = [];

    /* Iterate over each ID in the blockedMessageIds set */
    for (const id of blockedIds) {
      const key = `liveChatData:${id}`;

      /* Fetch user data from Redis hash */
      const userData = await redisClient.hGetAll(key);

      if (!userData || Object.keys(userData).length === 0) {
        logger.warn(`No data found for messageId: ${id}`);
        continue;
      }

      /* Collect the required fields */
      const userInfo = {
        profileImage: userData.profileImage,
        authorChannelId: userData.authorChannelId,
        id: userData.id,
        channelName: userData.channelName,
        messageContent: userData.messageContent,
      };

      blockedUsers.push(userInfo);
    }

    /* Return the collected blocked user data */
    logger.info(`Response: 200 OK`);
    return makeResponse(
      200,
      true,
      'Blocked users data fetched successfully',
      blockedUsers
    );
  } catch (error) {
    logger.error(`Error fetching blocked user data through Redis ${error}`);
    return makeResponse(
      500,
      false,
      'Error while fetching blocked user data',
      null
    );
  }
}
