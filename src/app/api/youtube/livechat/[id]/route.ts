import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import { NextRequest } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import getSessionAccessToken from '@/app/api/utils/session';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

type Params = {
  id: string;
};

const logger = createLoggerWithLabel('LiveChat');

export const GET = async (req: NextRequest, context: { params: Params }) => {
  /* Extract the livestream ID from the query parameters */
  const { id } = context.params;

  if (!id) {
    logger.error('LiveChat Id not provided');
    return makeResponse(400, false, 'ID not found', null);
  }

  await getSessionAccessToken();

  // Initialize the YouTube API client
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    logger.info(`Fetching LiveChat Messages with ID : ${id}`);

    // Get the livestream status
    // @ts-ignore
    const liveChatData = await youtube.liveChatMessages.list({
      liveChatId: id,
      part: ['id', 'authorDetails'],
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
    const { liveChatId } = req.query();
    const { message } = await req.json();

    if (!liveChatId) {
      logger.error('LiveChatId Missing');
      return makeResponse(400, false, 'ID not found', null);
    }

    await getSessionAccessToken();

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

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
