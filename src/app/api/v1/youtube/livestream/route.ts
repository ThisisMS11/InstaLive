import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GetLivestreams } from '@/app/api/services/livestreams';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('LiveStream');

export const GET = async () => {
  logger.info('Fetching user livestreams info...');
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('User session is not defined.');
  }

  try {
    const livestreams = await GetLivestreams(userId);
    return makeResponse(200, true, 'Past LiveStrems Data Fetched', livestreams);
  } catch (error) {
    logger.error(`Error fetching user livestreams info `, error);
    return makeResponse(
      401,
      false,
      'Error while fetching user livestreams',
      error
    );
  }
};
