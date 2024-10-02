import { NextRequest } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';
import { redisClient, CheckRedisConnection } from '@/app/api/utils/redis'

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

    const redisConnected = await CheckRedisConnection(redisClient);

    if (redisConnected) {
      /* Putting the messages ids into chatMsgIds redis set */
      const processedMessageIds = 'processedMessageIds';
      const messageQueue = 'messageQueue'

      /* Batching the inserting of ids so that can be performed in one go */
      const multi = redisClient.multi();

      let cnt = 0;

      logger.info(`Batching Message IDs to be put into "processedMessageIds" set and content into "liveChatData" Hash set. `);
      for (const item of livechatItems) {
        const messageId = item.id;

        const exists = await redisClient.sIsMember(processedMessageIds, messageId);

        // console.log(`${messageId} :  ${exists}`);

        if (!exists) {
          ++cnt;
          multi.hSet(`liveChatData:${messageId}`, {
            id: messageId,
            authorChannelId: item.snippet.authorChannelId,
            profileImage: item.authorDetails.profileImageUrl,
            messageContent: item.snippet.textMessageDetails.messageText,
            channelName: item.authorDetails.displayName
          })
          multi.rPush(messageQueue, messageId);

          /* Setting an expire for the redis hash */
          multi.expire(`liveChatData:${messageId}`, 86400);
        }
      }

      logger.info(`Ids pushed into redis set and data into  hash set, Total Count : ${cnt}`);
      await multi.exec();
    } else {
      logger.warn('Proceeding without Redis. Data will not be stored.');
    }

    return makeResponse(200, true, 'Fetched livechat data', livechatItems);
  } catch (error) {
    logger.error(`Error while getting livechat Data: ${error} `);
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
    logger.error(`Error while posting ChatMessage : ${error}`);
    return makeResponse(500, false, 'Error while posting chatmessage', error);
  }
};
