import prisma from '@/lib/db';

export async function GetLivestreams(userId: string) {
  return await prisma.liveStream.findMany({
    where: {
      createdBy: userId,
    },
  });
}
