import { NextResponse, NextRequest } from 'next/server';
import {
  getMetrices,
  getLiveStreamDetails,
} from '@/app/api/services/broadcasts';
import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import getSessionAccessToken from '@/app/api/utils/session';
import { createLoggerWithLabel } from '@/app/api/utils/logger';

const logger = createLoggerWithLabel('Broadcast_Stats')

export const GET = async (req: NextRequest) => {

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');
  let youtubeBroadcastId = searchParams.get('broadcastId');


  await getSessionAccessToken();

  /* call the youtube api */
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  let response;

  try {
    if (youtubeBroadcastId) {
      logger.info(`Fetching Stats for broadcast with id : ${youtubeBroadcastId}`)
      youtubeBroadcastId = '67HsvAFuxzg';
      switch (type) {
        case 'metrics':
          response = await getMetrices(youtube, youtubeBroadcastId);
          response = response.data.items[0].statistics;
          break;
        case 'stream':
          response = await getLiveStreamDetails(youtube, youtubeBroadcastId);
          response = response.data.items[0].liveStreamingDetails;
          break;
        default:
          return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
      }
    } else {
      logger.error(`Missing youtubeBroadcastId`)
      return NextResponse.json(
        { error: 'Missing youtubeBroadcastId' },
        { status: 400 }
      );
    }
  } catch (error) {
    logger.error(`Error fetching broadcast stats : ${error}`)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  return NextResponse.json({ data: response }, { status: 200 });
};
