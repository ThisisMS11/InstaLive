import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import getSessionAccessToken from '@/app/api/utils/session';
import { createLoggerWithLabel } from '@/app/api/utils/logger';

const logger = createLoggerWithLabel('LiveStream_Status')

export const GET = async (req: NextRequest) => {
  try {
    // Extract the livestream ID from the query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('liveStreamId');

    if (!id) {
      logger.error(`livestreamId not provided`);
      throw new Error('Livestream ID not provided')
    }

    logger.info(`Fetching Status for liveStream with id ${id}`);

    await getSessionAccessToken(req);

    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // Get the livestream status
    // @ts-ignore
    const liveStreamData = await youtube.liveStreams.list({
      part: ['status'],
      id: id,
    });

    //@ts-ignore
    const liveStreamStatus = liveStreamData.data.items[0].status;

    return NextResponse.json({ liveStreamStatus });
  } catch (error) {
    logger.error(`Error while fetching livestream status ${error}`);
    return NextResponse.json({ error }, { status: 500 });
  }
};
