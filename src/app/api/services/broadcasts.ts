import prisma from '@/lib/db';

export async function GetBroadcasts(userId: string) {
  return await prisma.broadcast.findMany({
    where: {
      userId: userId,
    },
  });
}
