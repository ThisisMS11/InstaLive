import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { GetLivestreams } from '@/app/api/services/livestreams';

export const GET = async () => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('User session is not defined.');
  }

  try {
    const livestreams = await GetLivestreams(userId);
    return NextResponse.json({ data: livestreams }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while fetching user livestreams', error },
      { status: 401 }
    );
  }
};
