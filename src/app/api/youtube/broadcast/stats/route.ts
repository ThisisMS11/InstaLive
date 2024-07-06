import { NextResponse, NextRequest } from "next/server";
import { getMetrices, getLiveStreamDetails } from '@/app/api/services/broadcasts'
import { oauth2Client } from '@/app/api/youtube/route';
import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const POST = async (req: NextRequest) => {
    const { youtubeBroadcastId } = await req.json();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    console.log(type)

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

    let response;

    switch (type) {
        case 'metrics':
            response = await getMetrices(youtube, youtubeBroadcastId);
            response = response.data.items[0].statistics
            break;
        case 'stream':
            response = await getLiveStreamDetails(youtube, youtubeBroadcastId);
            response = response.data.items[0].liveStreamingDetails
            break;
        // case 'unlikes':
        //     response = await getUnlikes();
        //     break;
        // case 'comments':
        //     response = await getComments();
        //     break;
        default:
            return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    return NextResponse.json({ data: response });
}