import prisma from '@/lib/db';
import { BroadcastStatus } from '@prisma/client';

export async function GetBroadcasts(userId: string) {
  return await prisma.broadcast.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function UpdateBroadcastStatus(
  youtubeBroadcastId: string,
  status: BroadcastStatus
) {
  return await prisma.broadcast.update({
    where: {
      id: youtubeBroadcastId,
    },
    data: {
      status: status,
    },
  });
}

export async function getMetrices(youtube: any, youtubeBroadcastId: string) {
  return youtube.videos.list({
    part: ['statistics'],
    id: youtubeBroadcastId,
  });
}

export async function getLiveStreamDetails(
  youtube: any,
  youtubeBroadcastId: string
) {
  return youtube.videos.list({
    part: ['liveStreamingDetails'],
    id: youtubeBroadcastId,
  });
}

export async function addOverlay(
  userId: string,
  public_id: string,
  url: string,
  name: string
) {
  return prisma.overlays.create({
    data: {
      userId: userId,
      public_id: public_id,
      url: url,
      description: name,
    },
  });
}

export async function GetOverlays(userId: string) {
  return prisma.overlays.findMany({
    where: {
      userId: userId,
    },
  });
}
