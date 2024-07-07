import { oauth2Client } from '../google';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import {
  createLiveBroadCast,
  createLiveStream,
  createBroadcastDB,
  createLiveStreamDB,
  bindLiveBroadcastAndStream,
} from '@/app/api/services/youtube';
import { GetBroadcasts } from '@/app/api/services/broadcasts';

export const POST = async (req: any) => {
  /* get the access token in the request body */

  const { title, description, privacy } = await req.json();

  const session = await getServerSession(authOptions);

  // @ts-ignore
  let access_token = session?.access_token;
  console.log(access_token);

  /* set the credentials */
  oauth2Client.setCredentials({ access_token });

  /* call the youtube api */
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  try {
    // Get the authenticated user's channel information
    const broadCastResponse = await createLiveBroadCast(
      youtube,
      title,
      description,
      privacy
    );

    const liveStreamResponse = await createLiveStream(youtube);

    /* Binding stream to broadCast */
    const bindingResponse = await bindLiveBroadcastAndStream(
      youtube,
      broadCastResponse.id,
      liveStreamResponse.id
    );

    try {
      // @ts-ignore
      if (!session?.user?.id) {
        throw new Error('User session is not defined.');
      }

      // @ts-ignore
      const userId = session.user.id;

      console.log({ userId });

      const newLiveStream = await createLiveStreamDB(
        liveStreamResponse,
        userId
      );

      if (newLiveStream.id) {
        await createBroadcastDB(broadCastResponse, newLiveStream.id, userId);
      }
    } catch (error) {
      console.error('Error creating livestream or broadcast:', error);
      return NextResponse.json(
        {
          message: 'Error while creating livestream or broadcast db instance',
          error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      broadCastResponse,
      liveStreamResponse,
      bindingResponse,
    });
  } catch (error) {
    console.log('error while creating livestream ', error);
    return NextResponse.json({ error }, { status: 401 });
  }
};

export const GET = async () => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const userId = session?.user.id;

  if (!userId) {
    throw new Error('User session is not defined.');
  }

  try {
    const broadcasts = await GetBroadcasts(userId);
    return NextResponse.json({ data: broadcasts }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error while fetching user broadcasts', error },
      { status: 401 }
    );
  }
};
