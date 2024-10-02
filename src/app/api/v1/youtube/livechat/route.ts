import { NextRequest } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('LiveChat');

export const GET = async (req: NextRequest) => {
  /* Extract the livestream ID from the query parameters */
  const url = new URL(req.url);
  const liveChatId = url.searchParams.get('liveChatId');

  if (!liveChatId) {
    logger.error('LiveChat Id not provided');
    return makeResponse(400, false, 'ID not found', null);
  }

  const youtube = await getYoutubeClient();

  try {
    logger.info(`Fetching LiveChat Messages with ID : ${liveChatId}`);

    // Get the livestream status
    // @ts-ignore
    const liveChatData = await youtube.liveChatMessages.list({
      liveChatId: liveChatId,
      part: ['id', 'snippet', 'authorDetails'],
      maxResults: 200,
    });

    //@ts-ignore
    const livechatItems = liveChatData.data.items;
    return makeResponse(200, true, 'Fetched livechat data', livechatItems);
  } catch (error) {
    logger.error(`Error while getting livechat Data: ${error} `);
    return makeResponse(500, false, 'Error while getting livechat Data', error);
  }
};

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

    // Extract the livestream status from the response
    //@ts-ignore

    // Return the livestream status
    const data = liveChatData.data.items;
    return makeResponse(200, true, 'Posted message on livechat', data);
  } catch (error) {
    logger.error(`Error while posting ChatMessage : ${error}`);
    return makeResponse(500, false, 'Error while posting chatmessage', error);
  }
};