import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';
import { redisClient, CheckRedisConnection } from '@/app/api/utils/redis';

const logger = createLoggerWithLabel('Redis');

/* To delete all blocked users, live chat data, processedMessageIds set, and messageQueue */
export async function DELETE() {
  try {
    /* Check if Redis is connected */
    const redisConnected = await CheckRedisConnection(redisClient);
    if (!redisConnected) {
      logger.error('Redis is not connected, clearing data failed');
      return makeResponse(503, false, 'Redis Service Unavailable', null);
    }

    /* Get all IDs inside the blockedMessageIds set */
    const blockedIds = await redisClient.sMembers('blockedMessageIds');

    /* Delete each liveChatData:messageId entry from Redis */
    for (const messageId of blockedIds) {
      const key = `liveChatData:${messageId}`;
      const banKey = `messageBanId:${messageId}`;

      await redisClient.del(key);
      await redisClient.del(banKey);
    }

    /* Delete the blockedMessageIds set */
    await redisClient.del('blockedMessageIds');

    /* Delete the processedMessageIds set */
    await redisClient.del('processedMessageIds');

    /* Delete  the previouslyBlockedMessageIds */
    await redisClient.del('previouslyBlockedMessageIds');

    /* Purge the messageQueue (if any items exist) */
    const queueLength = await redisClient.lLen('messageQueue');
    if (queueLength > 0) {
      await redisClient.del('messageQueue');
    }

    logger.info(
      'All Redis data related to the stream has been cleared successfully'
    );
    return makeResponse(200, true, 'All Redis data cleared successfully', null);
  } catch (error) {
    logger.error(`Error while clearing Redis data ${error}`);
    return makeResponse(500, false, 'Error while clearing Redis data', null);
  }
}
