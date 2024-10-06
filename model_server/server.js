import Fastify from 'fastify';
import Redis from 'ioredis';
import fastifyIO from 'fastify-socket.io';
import fetch from 'node-fetch';
import fastifyEnv from '@fastify/env';

const fastify = Fastify({
  logger: {
    level: 'info',
    file: './logs/combined.log',
  },
});

const redis = new Redis({
  host: 'localhost',
  port: 6379,
});

const schema = {
  type: 'object',
  required: ['SHARED_SECRET'],
  properties: {
    SHARED_SECRET: {
      type: 'string',
    },
  },
};

const options = {
  confKey: 'config',
  schema,
  dotenv: true,
  data: process.env,
};

fastify.register(fastifyIO);
fastify.register(fastifyEnv, options);

const livechatSockets = new Map();

const processMessage = async (messageId) => {
  try {
    /*  Collecting information about this message */
    const messageData = await redis.hgetall(`liveChatData:${messageId}`);
    if (!messageData || Object.keys(messageData).length === 0) {
      fastify.log.warn(`Message ${messageId} not found. It may have expired.`);
      return;
    }
    fastify.log.info(`processing Message with ID : ${messageData.id}`);

    let isSpam;
    try {
      isSpam = await detectSpam(messageData.messageContent);

      /* for Demo Usage */
      if (!isSpam)
        isSpam = messageData.messageContent === 'Demo_Abusive_Message';
    } catch (error) {
      fastify.log.error(
        `Error in spam detection for message ${messageId}: ${error.message}`
      );
      return;
    }

    if (isSpam) {
      fastify.log.info(
        `${messageId} Found Spam, Content : ${messageData.messageContent}`
      );
      /* making the api call to block this user */
      const url = `http://localhost:3000/api/v1/youtube/livechat/block-user/`;
      const body = {
        messageId: messageId,
        liveChatId: messageData.liveChatId,
        authorChannelId: messageData.authorChannelId,
        type: 'temporary',
      };
      try {
        fastify.log.info(`Calling Block User api..`);
        const response = await fetch(url, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            Authorization: `Bearer ${fastify.config.SHARED_SECRET}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        fastify.log.info(`Blocked user ${data.data.authorChannelId} for spam`);

        /* Now Emit the blocked user event at the client side , get the socket connection using map.*/
        const socket = livechatSockets.get(messageData.liveChatId);
        if (socket) {
          fastify.log.info(`Emitting Block User Event to Notify Client`);
          socket.emit('block-user', {
            messageId,
          });
        } else {
          fastify.log.info(
            `Socket is not available for liveChatId : ${messageData.liveChatId}`
          );
        }
      } catch (error) {
        fastify.log.error(
          `Error Blocking with messageId : ${messageId} for spam error : ${error}`
        );

        fastify.log.info(`Inserting ${messageId} back into message-queue `);
        await redis.rpush('messageQueue', messageId);
      }
    } else {
      fastify.log.info(`Message ${messageId} is not spam`);
    }

    /* Adding messageId to processedMessageIds set */
    await redis.sadd('processedMessageIds', messageId);
  } catch (error) {
    fastify.log.error(
      `Error processing message ${messageId}: ${error.message}`
    );

    fastify.log.info(`Inserting ${messageId} back into message-queue `);
    await redis.rpush('messageQueue', messageId);
  }
};

const detectSpam = async (content) => {
  try {
    const body = { inputs: content };
    const response = await fetch(
      'https://api-inference.huggingface.co/models/unitary/unbiased-toxic-roberta',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer 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`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0 || !Array.isArray(data[0])) {
      fastify.log.error(
        `Unexpected response format from Hugging Face API: ${JSON.stringify(data)}`
      );
      return false;
    }

    const scores = data[0];

    // defining thresholds for different categories
    const thresholds = {
      toxicity: 0.7,
      severe_toxicity: 0.5,
      obscene: 0.8,
      threat: 0.5,
      insult: 0.7,
      identity_attack: 0.5,
      sexual_explicit: 0.8,
    };

    // Check if any of the scores exceed their respective thresholds
    const isSpam = scores.some((item) => {
      const threshold = thresholds[item.label];
      return threshold !== undefined && item.score > threshold;
    });

    // Log the scores and the spam detection result
    // fastify.log.info(`Content: "${content}"`);
    // fastify.log.info(`Scores: ${JSON.stringify(scores)}`);
    // fastify.log.info(`Is spam: ${isSpam}`);

    return isSpam;
  } catch (error) {
    fastify.log.error(
      `Error occurred while calling Hugging Face model API: ${error.message}`
    );
    return false;
  }
};

const pollQueue = async () => {
  while (true) {
    try {
      // Wait for a new message ID in the queue
      const [_, messageId] = await redis.blpop('messageQueue', 0);
      await processMessage(messageId);
    } catch (error) {
      fastify.log.error(`Error polling queue: ${error.message}`);
      // Wait a bit before trying again to avoid hammering Redis in case of persistent errors
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

// Start the server
const start = async () => {
  await fastify.ready();

  try {
    await fastify.listen({ port: 8005 });
    fastify.log.info(`Server is running on port 8005`);

    // Socket.io connection handler
    fastify.io.on('connection', (socket) => {
      fastify.log.info(`Client connected socket ID : ${socket?.id} `);

      const liveChatId = socket.handshake.query.liveChatId;
      fastify.log.info(`Connected liveChatId : ${liveChatId}`);

      /* mapping the socket to liveChatId for further interaction */
      livechatSockets.set(liveChatId, socket);

      socket.on('disconnect', () => {
        fastify.log.info('Client disconnected');
      });
    });

    // Start polling the queue
    pollQueue().catch((err) => {
      fastify.log.error(`Fatal error in queue polling: ${err.message}`);
      process.exit(1);
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
