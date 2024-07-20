import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import { NextRequest } from 'next/server';
import {getYoutubeClient} from '@/app/api/utils/youtubeClient';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('LiveStream_Status');

export const GET = async (req: NextRequest) => {
  try {
    // Extract the livestream ID from the query parameters
    const url = new URL(req.url);
    const id = url.searchParams.get('liveStreamId');

    if (!id) {
      logger.error(`livestreamId not provided`);
      throw new Error('Livestream ID not provided');
    }

    logger.info(`Fetching Status for liveStream with id ${id}`);


    const youtube = await getYoutubeClient();

    // Get the livestream status
    // @ts-ignore
    const liveStreamData = await youtube.liveStreams.list({
      part: ['status'],
      id: id,
    });

    //@ts-ignore
    const liveStreamStatus = liveStreamData.data.items[0].status;

    return makeResponse(
      200,
      true,
      'Status Fetched Successfully',
      liveStreamStatus
    );
  } catch (error) {
    logger.error(`Error while fetching livestream status ${error}`);
    return makeResponse(
      500,
      false,
      'Error while fetching livestream status',
      error
    );
  }
};
