import { oauth2Client } from '../route'
import { google } from 'googleapis'
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';



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
        auth: oauth2Client
    })

    /* get the videos */

    try {
        // Get the authenticated user's channel information
        const broadCastResponse = await createLiveBraodCast(youtube, title, description, privacy);

        const liveStreamResponse = await createLiveStream(youtube);

        /* Binding stream to broadCast */

        const bindingResponse = await bindLiveBroadcastAndStream(youtube, broadCastResponse.id, liveStreamResponse.id)


        return NextResponse.json({ broadCastResponse, liveStreamResponse, bindingResponse });
    } catch (error) {
        console.log('error while creating livestream ', error);
        return NextResponse.json({ error }, { status: 401 });
    }
}

async function createLiveBraodCast(youtube: any, title: string, description: string, privacy: string) {
    const broadcastResponse = await youtube.liveBroadcasts.insert({
        part: ['snippet', 'status', 'contentDetails'],
        requestBody: {
            snippet: {
                title: title,
                description: description,
                scheduledStartTime: new Date().toISOString()
            },
            status: {
                privacyStatus: privacy
            },
            contentDetails: {
                enableAutoStart: false,
                enableAutoStop: true
            }
        }
    });
    return broadcastResponse.data;
}

async function createLiveStream(youtube: any) {
    const streamResponse = await youtube.liveStreams.insert({
        part: ['snippet,cdn,contentDetails,status'],
        requestBody: {
            snippet: {
                title: 'Test Stream by Mohit'
            },
            cdn: {
                frameRate: 'variable',
                ingestionType: 'rtmp',
                resolution: 'variable',
                format: '',
            },
            contentDetails: {
                isReusable: true,
            },
        }
    });

    return streamResponse.data;
}

async function bindLiveBroadcastAndStream(youtube: any, broadcastId: string, streamId: string) {
    const bindResponse = await youtube.liveBroadcasts.bind({
        part: ['id', 'contentDetails'],
        id: broadcastId,
        streamId: streamId
    });
    return bindResponse.data;
}