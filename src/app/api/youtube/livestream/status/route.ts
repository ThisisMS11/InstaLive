import { oauth2Client } from '@/app/api/youtube/google';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const GET = async (req: any) => {
  try {
    // Extract the livestream ID from the query parameters
    const url = new URL(req.url);

    const id = url.searchParams.get('liveStreamId');

    console.log({ id });

    if (!id) {
      return NextResponse.json({ message: 'ID not found' });
    }

    // Retrieve the access token from the session
    const session = await getServerSession(authOptions);

    // @ts-ignore
    let access_token = session?.access_token;

    // Set credentials
    oauth2Client.setCredentials({ access_token });

    // Initialize the YouTube API client
    const youtube = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });

    // Get the livestream status
    // @ts-ignore
    const liveStreamData = await youtube.liveStreams.list({
      part: ['status'],
      id: id,
    });

    console.log({ liveStreamData });

    // Extract the livestream status from the response
    //@ts-ignore
    const liveStreamStatus = liveStreamData.data.items[0].status;

    // Return the livestream status
    return NextResponse.json({ liveStreamStatus });
  } catch (error) {
    console.log('Error while getting livestream status: ', error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
