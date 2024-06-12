import { oauth2Client } from '@/app/api/youtube/route'
import { google } from 'googleapis'
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



export const POST = async (req: any) => {
    /* get the access token in the request body */

    const { broadcastId } = await req.json();

    const session = await getServerSession(authOptions);

    // @ts-ignore
    let access_token = session?.access_token;

    /* set the credentials */
    oauth2Client.setCredentials({ access_token });

    /* call the youtube api */
    const youtube = google.youtube({
        version: 'v3',
        auth: oauth2Client
    })

    /* get the videos */

    try {
        const stopResponse = await youtube.liveBroadcasts.transition({
            part: ['id', 'status'],
            broadcastStatus: 'complete',
            id: broadcastId
        });
        return NextResponse.json({ data : stopResponse.data });
    } catch (error) {
        console.log('error while creating livestream ', error);
        return NextResponse.json({ error }, { status: 401 });
    }
}
