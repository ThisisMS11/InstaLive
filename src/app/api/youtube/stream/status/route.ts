import { oauth2Client } from '@/app/api/youtube/route'
import { google } from 'googleapis'
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';


export const PUT = async (req: any) => {
    /* get the access token in the request body */

    const { streamId } = await req.json();

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
        const statusUpdateRes = await youtube.liveStreams.update({
            part: ['id', 'snippet', 'cdn', 'status'],
            requestBody: {
                id: streamId,
                snippet: {
                    title: 'Test Stream by Mohit'
                },
                cdn: {
                    resolution: '1080p',
                    ingestionType: 'rtmp',
                    frameRate: '60fps'
                },
                status: {
                    streamStatus: 'active'
                }
            }
        });

        return NextResponse.json({ statusUpdateRes })
    } catch (error) {
        console.log('error while updating livestream status ', error);
        return NextResponse.json({ error }, { status: 401 });
    }
}

export const GET = async (req: any) => {
    try {
        // Extract the livestream ID from the query parameters
        const url = new URL(req.url);

        const id = url.searchParams.get('id');

        console.log({ id });

        if (!id) {
            return NextResponse.json({ message: "ID not found" });
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
            auth: oauth2Client
        });

        // Get the livestream status
        // @ts-ignore
        const livestreamResponse = await youtube.liveStreams.list({
            part: ['status'],
            id: id
        });

        // Extract the livestream status from the response
        //@ts-ignore
        const livestreamStatus = livestreamResponse.data.items[0].status.streamStatus;

        // Return the livestream status
        return NextResponse.json({ livestreamStatus });
    } catch (error) {
        console.log('Error while getting livestream status: ', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
