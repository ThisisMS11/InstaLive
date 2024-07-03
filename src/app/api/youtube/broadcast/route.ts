import { oauth2Client } from '../route';
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
