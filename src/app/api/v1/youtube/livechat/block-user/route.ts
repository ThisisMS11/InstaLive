import { NextResponse, NextRequest } from 'next/server';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('BlockUser');

const SHARED_SECRET = process.env.SHARED_SECRET;

export async function POST(req: NextRequest) {
  /* Verify the shared secret */
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== `Bearer ${SHARED_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { liveChatId, authorChannelId, type } = await req.json();

    const youtube = await getYoutubeClient();

    logger.info(
      `Banning livechatUser with id : [${authorChannelId}] with type : ${type}`
    );

    switch (type) {
      case 'temporary':
        await youtube.liveChatBans.insert({
          part: ['snippet'],
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
        await youtube.liveChatBans.insert({
          part: ['snippet'],
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
    return makeResponse(200, true, `Blocked User with id`, { authorChannelId });
  } catch (error) {
    logger.error(`Error blocking user: ${error}`);
    return makeResponse(500, false, `Error while Blocked User with id`, null);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { liveChatId, authorChannelId } = await req.json();

    const youtube = await getYoutubeClient();

    logger.info(`Unbanning livechatUser with id : [${authorChannelId}]`);

    // Call the YouTube API to remove the ban
    await youtube.liveChatBans.delete({
      id: authorChannelId, // Use the correct ID format here
    });

    logger.info(`Unblocked user ${authorChannelId} in live chat ${liveChatId}`);
    return makeResponse(200, true, `Unblocked User with id`, {
      authorChannelId,
    });
  } catch (error) {
    logger.error(`Error unblocking user: ${error}`);
    return makeResponse(
      500,
      false,
      `Error while Unblocking User with id`,
      null
    );
  }
}
