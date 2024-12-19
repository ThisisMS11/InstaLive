import { NextRequest } from 'next/server';
import {
  getMetrices,
  getLiveStreamDetails,
} from '@/app/api/services/broadcasts';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('Broadcast_Stats');

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  let youtubeBroadcastId = searchParams.get('broadcastId');

  /* call the youtube api */
  const youtube = await getYoutubeClient();

  let response;

  try {
    if (youtubeBroadcastId) {
      logger.info(
        `Fetching Stats for broadcast with id : ${youtubeBroadcastId}`
      );
      // youtubeBroadcastId = '67HsvAFuxzg';
      switch (type) {
        case 'metrics':
          response = await getMetrices(youtube, youtubeBroadcastId);
          response = response.data.items[0].statistics;
          break;
        case 'stream':
          response = await getLiveStreamDetails(youtube, youtubeBroadcastId);
          response = response.data.items[0];
          break;
        default:
          return makeResponse(400, false, 'Invalid type', null);
      }
    } else {
      logger.error(`Missing youtubeBroadcastId`);
      return makeResponse(400, false, 'Missing youtubeBroadcastId', null);
    }
  } catch (error) {
    logger.error(`Error fetching broadcast stats ${error}`);
    return makeResponse(500, false, 'Internal Server Error', error);
  }

  return makeResponse(
    200,
    true,
    'Fetched Broadcast stats successfully',
    response
  );
};
