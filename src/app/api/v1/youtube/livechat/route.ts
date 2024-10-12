import { NextRequest } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';
import { redisClient, CheckRedisConnection } from '@/app/api/utils/redis';

const logger = createLoggerWithLabel('LiveChat');

/* Get All Messages from LiveChat */
export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const liveChatId = url.searchParams.get('liveChatId');

  if (!liveChatId) {
    logger.error('LiveChat Id not provided');
    return makeResponse(400, false, 'ID not found', null);
  }

  const youtube = await getYoutubeClient();

  try {
    logger.info(`Fetching LiveChat Messages with ID : ${liveChatId}`);

    // @ts-ignore
    const liveChatData = await youtube.liveChatMessages.list({
      liveChatId: liveChatId,
      part: ['id', 'snippet', 'authorDetails'],
      maxResults: 200,
    });

    //@ts-ignore
    const livechatItems = liveChatData.data.items;

    const filteredMessages = livechatItems.filter(
      (item: any) => item.snippet.type === 'textMessageEvent'
    );

    const redisConnected = await CheckRedisConnection(redisClient);

    if (redisConnected) {
      /* Putting the messages ids into chatMsgIds redis set */
      const processedMessageIds = 'processedMessageIds';
      const messageQueue = 'messageQueue';

      /* Batching the inserting of ids so that can be performed in one go */
      const multi = redisClient.multi();

      let cnt = 0;

      logger.info(
        `Batching Message IDs to be put into "processedMessageIds" set and content into "liveChatData" Hash set. `
      );
      for (const item of filteredMessages) {
        const messageId = item.id;
        const exists = await redisClient.sIsMember(
          processedMessageIds,
          messageId
        );

        if (!exists) {
          ++cnt;
          multi.hSet(`liveChatData:${messageId}`, {
            id: messageId,
            authorChannelId: item.snippet.authorChannelId,
            profileImage: item.authorDetails.profileImageUrl,
            messageContent: item.snippet.textMessageDetails.messageText,
            channelName: item.authorDetails.displayName,
            liveChatId: item.snippet.liveChatId,
          });
          multi.rPush(messageQueue, messageId);

          /* Setting an expire for the redis hash */
          multi.expire(`liveChatData:${messageId}`, 86400);
        }
      }

      logger.info(
        `Ids pushed into redis set and data into  hash set, Total Count : ${cnt}`
      );
      await multi.exec();
    } else {
      logger.warn('Proceeding without Redis. Data will not be stored.');
    }

    return makeResponse(200, true, 'Fetched livechat data', filteredMessages);
  } catch (error) {
    logger.error(`Error while getting livechat Data ${error}`);
    return makeResponse(500, false, 'Error while getting livechat Data', error);
  }
};

/* Post a Message to the livechat */
export const POST = async (req: NextRequest) => {
  try {
    //@ts-ignore
    const url = new URL(req.url);
    const liveChatId = url.searchParams.get('liveChatId');
    const { message } = await req.json();

    if (!liveChatId) {
      logger.error('LiveChatId Missing');
      return makeResponse(400, false, 'ID not found', null);
    }

    const youtube = await getYoutubeClient();

    /* Get the livestream status */
    // @ts-ignore
    logger.info('Inserting ChatMessage ...');
    const liveChatData = await youtube.liveChatMessages.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          liveChatId: liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: message,
          },
        },
      },
    });

    //@ts-ignore
    const data = liveChatData.data.items;
    return makeResponse(200, true, 'Posted message on livechat', data);
  } catch (error) {
    logger.error(`Error while posting ChatMessage ${error}`);
    return makeResponse(500, false, 'Error while posting chatmessage', error);
  }
};

/* To delete all blocked users, live chat data, processedMessageIds set, and messageQueue */
export async function DELETE() {
  try {
    /* Check if Redis is connected */
    const redisConnected = await CheckRedisConnection(redisClient);
    if (!redisConnected) {
      logger.error('Redis is not connected, clearing data failed');
      return makeResponse(503, false, 'Redis Service Unavailable', null);
    }

    /* Get all IDs inside the blockedMessageIds set */
    const blockedIds = await redisClient.sMembers('blockedMessageIds');

    /* Delete each liveChatData:messageId entry from Redis */
    for (const messageId of blockedIds) {
      const key = `liveChatData:${messageId}`;

      await redisClient.del(key);
    }

    /* Delete the blockedMessageIds set */
    await redisClient.del('blockedMessageIds');

    /* Delete the processedMessageIds set */
    await redisClient.del('processedMessageIds');

    /* Purge the messageQueue (if any items exist) */
    const queueLength = await redisClient.lLen('messageQueue');
    if (queueLength > 0) {
      await redisClient.del('messageQueue');
    }

    logger.info(
      'All Redis data related to the stream has been cleared successfully'
    );
    return makeResponse(200, true, 'All Redis data cleared successfully', null);
  } catch (error) {
    logger.error(`Error while clearing Redis data ${error}`);
    return makeResponse(500, false, 'Error while clearing Redis data', null);
  }
}
