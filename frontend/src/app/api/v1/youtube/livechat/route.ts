import { NextRequest } from 'next/server';
import { createLoggerWithLabel } from '@/app/api/utils/logger';
import { getYoutubeClient } from '@/app/api/utils/youtubeClient';
import { makeResponse } from '@/app/api/common/helpers/reponseMaker';
import { redisClient, CheckRedisConnection } from '@/app/api/utils/redis';

const logger = createLoggerWithLabel('LiveChat');

/* Get All Messages from LiveChat */
export const GET = async (req: NextRequest) => {
    const url = new URL(req.url);
    const liveChatId = url.searchParams.get('liveChatId');

    if (!liveChatId) {
        logger.error('LiveChat Id not provided');
        return makeResponse(400, false, 'ID not found', null);
    }

    const youtube = await getYoutubeClient();

    try {
        logger.info(`Fetching LiveChat Messages with ID : ${liveChatId}`);

        // @ts-ignore
        const liveChatData = await youtube.liveChatMessages.list({
            liveChatId: liveChatId,
            part: ['id', 'snippet', 'authorDetails'],
            maxResults: 200,
        });

        //@ts-ignore
        const livechatItems = liveChatData.data.items;

        const filteredMessages = livechatItems.filter(
            (item: any) => item.snippet.type === 'textMessageEvent'
        );

        const unBlockedMessages = [];

        const redisConnected = await CheckRedisConnection(redisClient);

        if (redisConnected) {
            /* Putting the messages ids into chatMsgIds redis set */
            const processedMessageIds = 'processedMessageIds';
            const messageQueue = 'messageQueue';
            const blockedMessageIds = 'blockedMessageIds';
            const previouslyBlockedMessageIds = 'previouslyBlockedMessageIds';

            const messageIds = filteredMessages.map((item: any) => item.id);

            /* to avoid SMISMEMBER error */
            if (messageIds.length === 0) {
                return makeResponse(200, true, 'Fetched livechat data', []);
            }

            // console.log({ messageIds });

            logger.info(`Preprocessing filtered Messages from liveChat`);
            const [
                processedStatuses,
                blockedStatuses,
                previouslyBlockedStatuses,
            ] = await Promise.all([
                redisClient.SMISMEMBER(processedMessageIds, messageIds),
                redisClient.SMISMEMBER(blockedMessageIds, messageIds),
                redisClient.SMISMEMBER(previouslyBlockedMessageIds, messageIds),
            ]);

            // console.log({ processedStatuses, blockedStatuses, previouslyBlockedStatuses })

            /* Batching the inserting of ids so that can be performed in one go */
            const multi = redisClient.multi();

            let cnt = 0;

            logger.info(
                `Batching messages into "processedMessageIds" set and "liveChatData" Hash set.`
            );
            filteredMessages.forEach((item: any, index: number) => {
                const messageId = item.id;

                if (!processedStatuses[index]) {
                    cnt++;
                    multi.hSet(`liveChatData:${messageId}`, {
                        id: messageId,
                        authorChannelId: item.snippet.authorChannelId,
                        profileImage: item.authorDetails.profileImageUrl,
                        messageContent:
                            item.snippet.textMessageDetails.messageText,
                        channelName: item.authorDetails.displayName,
                        liveChatId: item.snippet.liveChatId,
                    });
                    multi.rPush(messageQueue, messageId);
                    multi.expire(messageQueue,86400)
                    multi.expire(`liveChatData:${messageId}`, 86400);
                }

                if (
                    !blockedStatuses[index] &&
                    !previouslyBlockedStatuses[index]
                ) {
                    unBlockedMessages.push(item);
                }
            });

            logger.info(
                `Ids pushed into redis set and data into hash set, Total Count: ${cnt}`
            );
            await multi.exec();
        } else {
            logger.warn('Proceeding without Redis. Data will not be stored.');
            unBlockedMessages.push(...filteredMessages);
        }

        return makeResponse(
            200,
            true,
            'Fetched livechat data',
            unBlockedMessages
        );
    } catch (error) {
        logger.error(`Error while getting livechat Data ${error}`);
        return makeResponse(
            500,
            false,
            'Error while getting livechat Data',
            error
        );
    }
};

/* Post a Message to the livechat */
export const POST = async (req: NextRequest) => {
    try {
        //@ts-ignore
        const url = new URL(req.url);
        const liveChatId = url.searchParams.get('liveChatId');
        const { message } = await req.json();

        if (!liveChatId) {
            logger.error('LiveChatId Missing');
            return makeResponse(400, false, 'ID not found', null);
        }

        const youtube = await getYoutubeClient();

        /* Get the livestream status */
        // @ts-ignore
        logger.info('Inserting ChatMessage ...');
        const liveChatData = await youtube.liveChatMessages.insert({
            part: ['snippet'],
            requestBody: {
                snippet: {
                    liveChatId: liveChatId,
                    type: 'textMessageEvent',
                    textMessageDetails: {
                        messageText: message,
                    },
                },
            },
        });

        //@ts-ignore
        const data = liveChatData.data.items;
        return makeResponse(200, true, 'Posted message on livechat', data);
    } catch (error) {
        logger.error(`Error while posting ChatMessage ${error}`);
        return makeResponse(
            500,
            false,
            'Error while posting chatmessage',
            error
        );
    }
};
