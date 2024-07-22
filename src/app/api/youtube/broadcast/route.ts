import { NextRequest } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';

import {
  createBroadcast,
  createLiveStream,
  createBroadcastDB,
  createLiveStreamDB,
  bindBroadcastAndStream,
} from '@/app/api/services/youtube';
import { GetBroadcasts } from '@/app/api/services/broadcasts';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { getServerSession } from 'next-auth';
import { makeResponse } from '../../common/helpers/reponseMaker';

const logger = createLoggerWithLabel('Broadcast');

const handleCreateBroadcast = async (
  req: NextRequest,
  youtube: any,
  userId: string
) => {
  const { title, description, privacy } = await req.json();

  logger.info(`Creating Broadcast...`);
  const broadCastResponse = await createBroadcast(
    youtube,
    title,
    description,
    privacy
  );

  logger.info(`Creating LiveStream...`);
  const liveStreamResponse = await createLiveStream(youtube);

  logger.info(`Binding LiveStream and Broadcast`);
  await bindBroadcastAndStream(
    youtube,
    broadCastResponse.id,
    liveStreamResponse.id
  );

  const newLiveStream = await createLiveStreamDB(liveStreamResponse, userId);

  if (newLiveStream.id) {
    await createBroadcastDB(broadCastResponse, newLiveStream.id, userId);
  }

  return {
    broadCastResponse,
    liveStreamResponse,
  };
};

export const POST = async (req: NextRequest) => {
  try {
    const session = await getServerSession(authOptions);
    const youtube = await getYoutubeClient();

    // @ts-ignore
    const userId = session?.user?.id;
    if (!userId) {
      throw new Error('User session is not defined.');
    }

    const { broadCastResponse, liveStreamResponse } =
      await handleCreateBroadcast(req, youtube, userId);

    const response = {
      broadCastResponse,
      liveStreamResponse,
    };

    console.log(response);

    return makeResponse(200, true, 'LiveStream Created Successfully', response);
  } catch (error) {
    logger.error(`Error while creating livestream: ${error} `);
    return makeResponse(
      500,
      false,
      'Error while creating livestream or broadcast',
      error
    );
  }
};

export const GET = async () => {
  try {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const userId = session?.user?.id;

    if (!userId) {
      throw new Error('User session is not defined.');
    }

    const broadcasts = await GetBroadcasts(userId);
    return makeResponse(200, true, 'Fetched All past broadcasts', broadcasts);
  } catch (error) {
    logger.error(`Error while fetching user broadcasts: ${error}`);
    return makeResponse(
      500,
      false,
      'Error while fetching user broadcasts',
      error
    );
  }
};
