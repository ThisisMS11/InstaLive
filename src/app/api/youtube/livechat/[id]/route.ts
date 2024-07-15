import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import getSessionAccessToken from '@/app/api/utils/session';

type Params = {
  id: string;
};

const logger = createLoggerWithLabel('LiveChat');

export const GET = async (req: NextRequest, context: { params: Params }) => {
  // Extract the livestream ID from the query parameters
  const { id } = context.params;

  if (!id) {
    logger.error('LiveChat Id not provided');
    return NextResponse.json({ message: 'ID not found' });
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

    // Extract the livestream status from the response
    //@ts-ignore
    // Return the livestream status
    return NextResponse.json({ liveChatData: liveChatData.data.items });
  } catch (error) {
    logger.error(`Error while getting livechat Data: ${error} `)
    return NextResponse.json({ error }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  try {
    // Extract the livestream ID from the query parameters

    //@ts-ignore
    const { liveChatId } = req.query();

    const { message } = await req.json();

    if (!liveChatId) {
      logger.error('LiveChatId Missing');
      return NextResponse.json({ message: 'ID not found' });
    }

    await getSessionAccessToken();


    // Initialize the YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // Get the livestream status
    // @ts-ignore
    logger.info('Inserting ChatMessage ...')
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
    return NextResponse.json({ liveChatData: liveChatData.data.items });
  } catch (error) {
    logger.error(`Error while posting ChatMessage : ${error}`)
    return NextResponse.json({ error }, { status: 500 });
  }
};
