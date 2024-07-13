import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { UpdateBroadcastStatus } from '@/app/api/services/broadcasts';
import getSessionAccessToken from '@/app/api/utils/session';
import { createLoggerWithLabel } from '@/app/api/utils/logger';


const logger = createLoggerWithLabel('Broadcast_Status')

/* To change the status of a broadcast */
export const PUT = async (req: NextRequest) => {
  const { youtubeBroadcastId, status } = await req.json();
  await getSessionAccessToken(req);

  if (!youtubeBroadcastId || !status) {
    logger.error(`Either of id and status is missing in request body`)
    throw new Error('Either of id and status is missing in request body')
  }

  /* call the youtube api */
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  /* get the videos */
  try {
    logger.info(`Updating the status of broadcast with id : ${youtubeBroadcastId}`);
    const statusUpdateRes = await youtube.liveBroadcasts.transition({
      part: ['id,snippet,contentDetails,status'],
      broadcastStatus: status,
      id: youtubeBroadcastId,
    });

    /* Changing the status in db as well */
    logger.info(`Updating the status of broadcast in Db`);
    await UpdateBroadcastStatus(youtubeBroadcastId, status);

    return NextResponse.json({ statusUpdateRes });
  } catch (error) {
    logger.error(`Error updating the status of broadcast : ${error}`);
    return NextResponse.json({ error }, { status: 401 });
  }
};

export const GET = async (req: NextRequest) => {
  // Extract the livestream ID from the query parameters
  const url = new URL(req.url);
  const id = url.searchParams.get('broadcastId');

  if (!id) {
    logger.error(`Broadcast Id not found`);
    return NextResponse.json({ message: 'ID not found' }, { status: 400 });
  }

  await getSessionAccessToken(req);

  try {

    // Initialize the YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    logger.info(`Fetching Broadcast Status with id : ${id}`);
    // @ts-ignore
    const liveBroadCast = await youtube.liveBroadcasts.list({
      part: ['status'],
      id: id,
    });

    //@ts-ignore
    const broadCastStatus = liveBroadCast.data.items[0].status.lifeCycleStatus;

    return NextResponse.json({ broadCastStatus }, { status: 200 });
  } catch (error) {
    logger.error(`Error Fetching Broadcast Status Error : ${error}`);
    return NextResponse.json({ error }, { status: 500 });
  }
}
