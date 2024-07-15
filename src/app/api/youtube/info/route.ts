import { oauth2Client } from '../google';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger'
import getSessionAccessToken from '../../utils/session';

const logger = createLoggerWithLabel('Youtube');

export const GET = async () => {
  /* get the access token in the request body */
  logger.info("Fetching User Youtube Channel Information");

  await getSessionAccessToken();

  /* call the youtube api */
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    // Get the authenticated user's channel information
    const response = await youtube.channels.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      mine: true,
    });

    //@ts-ignore
    const channelData = response.data.items[0]; // Assuming you only have one channel
    return NextResponse.json({ data: channelData });
  } catch (error) {
    logger.info(`Error Fetching User Youtube Channel Information : ${error}`);
    return NextResponse.json({ error }, { status: 401 });
  }
};
