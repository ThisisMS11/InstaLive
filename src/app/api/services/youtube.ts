import prisma from '@/lib/db';
import { privacyStatusEnum, BroadcastStatus } from '@prisma/client';

export async function createBroadcast(
  youtube: any,
  title: string,
  description: string,
  privacy: string
) {
  const broadcastResponse = await youtube.liveBroadcasts.insert({
    part: ['snippet', 'status', 'contentDetails'],
    requestBody: {
      snippet: {
        title: title,
        description: description,
        scheduledStartTime: new Date().toISOString(),
      },
      status: {
        privacyStatus: privacy,
        selfDeclaredMadeForKids : true,
      },
      contentDetails: {
        enableAutoStart: false,
        enableAutoStop: true,
      },
    },
  });
  return broadcastResponse.data;
}

export async function createLiveStream(youtube: any) {
  const streamResponse = await youtube.liveStreams.insert({
    part: ['snippet,cdn,contentDetails,status'],
    requestBody: {
      snippet: {
        title: 'Test Stream by Mohit',
      },
      cdn: {
        frameRate: 'variable',
        ingestionType: 'rtmp',
        resolution: 'variable',
        format: '',
      },
      contentDetails: {
        isReusable: true,
      },
    },
  });

  return streamResponse.data;
}

export async function bindBroadcastAndStream(
  youtube: any,
  broadcastId: string,
  streamId: string
) {
  const bindResponse = await youtube.liveBroadcasts.bind({
    part: ['id', 'contentDetails'],
    id: broadcastId,
    streamId: streamId,
  });
  return bindResponse.data;
}

export const createLiveStreamDB = async (
  liveStreamResponse: any,
  userId: string
) => {
  console.log({ userId });

  return prisma.liveStream.create({
    data: {
      id: liveStreamResponse.id,
      createdBy: userId,
      title: liveStreamResponse.snippet.title,
      resolution: liveStreamResponse.cdn.resolution,
      frameRate: liveStreamResponse.cdn.frameRate,
      ingestionAddress: `${liveStreamResponse.cdn.ingestionInfo.ingestionAddress}/${liveStreamResponse.cdn.ingestionInfo.streamName}`,
    },
  });
};

// Helper function to create a new broadcast
export const createBroadcastDB = async (
  broadCastResponse: any,
  liveStreamId: string,
  userId: string
) => {
  return prisma.broadcast.create({
    data: {
      id: broadCastResponse.id,
      userId: userId,
      title: broadCastResponse.snippet.title,
      description: broadCastResponse.snippet.description,
      channelId: broadCastResponse.snippet.channelId,
      thumbnail: broadCastResponse.snippet.thumbnails.medium.url,
      liveChatId: broadCastResponse.snippet.liveChatId,
      liveStreamId: liveStreamId,
      privacyStatus: broadCastResponse.status
        .privacyStatus as privacyStatusEnum,
      status: broadCastResponse.status.lifeCycleStatus as BroadcastStatus,
    },
  });
};
