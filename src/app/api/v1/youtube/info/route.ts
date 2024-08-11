import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient'
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';

const logger = createLoggerWithLabel('Youtube');

export const GET = async () => {
  /* get the access token in the request body */
  logger.info('Fetching User Youtube Channel Information');

  /* get the youtube client */
  const youtube = await getYoutubeClient();

  try {
    // Get the authenticated user's channel information
    const response = await youtube.channels.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      mine: true,
    });

    //@ts-ignore
    const channelData = response.data.items[0]; // Assuming you only have one channel
    return makeResponse(
      200,
      true,
      'Youtube Channel Information Fetch Successfully',
      channelData
    );
  } catch (error) {
    logger.info(`Error Fetching User Youtube Channel Information : ${error}`);
    return makeResponse(
      401,
      false,
      'Error Fetching User Youtube Channel Information',
      error
    );
  }
};
