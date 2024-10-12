import { NextRequest } from 'next/server';
import { UpdateBroadcastStatus } from '@/app/api/services/broadcasts';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('Broadcast_Status');

/* To change the status of a broadcast */
export const PUT = async (req: NextRequest) => {
  const { youtubeBroadcastId, status } = await req.json();

  if (!youtubeBroadcastId || !status) {
    logger.error(`Either of id and status is missing in request body`);
    throw new Error('Either of id and status is missing in request body');
  }

  /* call the youtube api */
  const youtube = await getYoutubeClient();

  /* get the videos */
  try {
    logger.info(
      `Updating the status of broadcast with id : ${youtubeBroadcastId}`
    );
    const statusUpdateRes = await youtube.liveBroadcasts.transition({
      part: ['id,snippet,contentDetails,status'],
      broadcastStatus: status,
      id: youtubeBroadcastId,
    });

    /* Changing the status in db as well */
    logger.info(`Updating the status of broadcast in Db`);
    await UpdateBroadcastStatus(youtubeBroadcastId, status);

    return makeResponse(200, true, 'Updated Broadcast Status', statusUpdateRes);
  } catch (error) {
    logger.error(`Error updating the status of broadcast ${error}`);
    return makeResponse(401, false, 'Error Fetching BroadCast update', error);
  }
};

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url);
  const id = url.searchParams.get('broadcastId');

  if (!id) {
    logger.error(`Broadcast Id not found`);
    return makeResponse(400, false, 'ID not found', null);
  }

  const youtube = await getYoutubeClient();

  try {
    logger.info(`Fetching Broadcast Status with id : ${id}`);
    // @ts-ignore
    const liveBroadCast = await youtube.liveBroadcasts.list({
      part: ['status'],
      id: id,
    });

    //@ts-ignore
    const broadCastStatus = liveBroadCast.data.items[0].status.lifeCycleStatus;

    return makeResponse(
      200,
      true,
      'Broadcast status fetched successfully',
      broadCastStatus
    );
  } catch (error) {
    logger.error(`Error Fetching Broadcast Status Error ${error}`);
    return makeResponse(500, false, 'Error Feteching broadcast status', null);
  }
};
