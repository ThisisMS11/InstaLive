import { oauth2Client } from '@/app/api/youtube/route';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const PUT = async (req: any) => {
  const { youtubeBroadcastId, status } = await req.json();
  const session = await getServerSession(authOptions);


  // @ts-ignore
  let access_token = session?.access_token;

  /* set the credentials */
  oauth2Client.setCredentials({ access_token });

  /* call the youtube api */
  const youtube = google.youtube({
    version: 'v3',
    auth: oauth2Client,
  });

  /* get the videos */
  try {
    const statusUpdateRes = await youtube.liveBroadcasts.transition({
      part: ['id,snippet,contentDetails,status'],
      broadcastStatus: status,
      id: youtubeBroadcastId,
    });
    return NextResponse.json({ statusUpdateRes });
  } catch (error) {
    console.log('error while updating liveBroadCast status ', error);
    return NextResponse.json({ error }, { status: 401 });
  }
};

export const GET = async (req: any) => {
  try {
    // Extract the livestream ID from the query parameters
    const url = new URL(req.url);

    const id = url.searchParams.get('broadCastId');

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
    const liveBroadCast = await youtube.liveBroadcasts.list({
      part: ['status'],
      id: id,
    });

    console.log({ liveBroadCast });

    // Extract the livestream status from the response
    //@ts-ignore
    const broadCastStatus = liveBroadCast.data.items[0].status.lifeCycleStatus;

    // Return the livestream status
    return NextResponse.json({ broadCastStatus });
  } catch (error) {
    console.log('Error while getting livestream status: ', error);
    return NextResponse.json({ error }, { status: 500 });
  }
};
