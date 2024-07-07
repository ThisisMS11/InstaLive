import { oauth2Client } from '../google';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const GET = async () => {
  /* get the access token in the request body */

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
    // Get the authenticated user's channel information
    const response = await youtube.channels.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      mine: true,
    });

    //@ts-ignore
    const channelData = response.data.items[0]; // Assuming you only have one channel
    return NextResponse.json({ data: channelData });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error }, { status: 401 });
  }
};
