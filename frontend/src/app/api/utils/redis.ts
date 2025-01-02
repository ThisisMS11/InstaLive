import { createClient } from 'redis';
import { createLoggerWithLabel } from './logger';

const logger = createLoggerWithLabel('Redis');

// Create Redis client configuration
const redisClient = createClient({
    password: process.env.REDIS_PASSWORD || undefined,
    socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    },
});

if (!redisClient.isOpen) {
    redisClient.connect().catch((err) => {
        logger.error(`Failed to connect to Redis: ${err}`);
    });
}

async function CheckRedisConnection(redis: any) {
    try {
        await redis.ping();
        logger.info(`Redis is Connected Successfully.`);
        return true;
    } catch (error: any) {
        logger.error(`Redis connection failed: ${error}`);
        return false;
    }
}

export { redisClient, CheckRedisConnection };
