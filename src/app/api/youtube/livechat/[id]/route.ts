import { oauth2Client } from '@/app/api/youtube/route';
import { google } from 'googleapis';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

type Params = {
    id: string
}

export const GET = async (req: any, context: { params: Params }) => {
    try {
        // Extract the livestream ID from the query parameters
        const { id } = context.params;

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
        const liveChatData = await youtube.liveChatMessages.list({
            liveChatId: id,
            part: ['id','authorDetails'],
        });

        console.log({liveChatData})

        // Extract the livestream status from the response
        //@ts-ignore

        // Return the livestream status
        return NextResponse.json({ liveChatData: liveChatData.data.items });
    } catch (error) {
        console.log('Error while getting livechatdata status: ', error);
        return NextResponse.json({ error }, { status: 500 });
    }
};

export const POST = async (req: any) => {
    try {
        // Extract the livestream ID from the query parameters
        const { liveChatId } = req.query();

        const { message } = await req.json();

        if (!liveChatId) {
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
        const liveChatData = await youtube.liveChatMessages.insert({
            part: ['snippet'],
            requestBody: {
                snippet: {
                    liveChatId: liveChatId,
                    type: 'textMessageEvent',
                    textMessageDetails: {
                        messageText: message
                    }
                }
            }
        });

        // Extract the livestream status from the response
        //@ts-ignore

        // Return the livestream status
        return NextResponse.json({ liveChatData: liveChatData.data.items });

    } catch (error) {
        console.log('Error while Posting Message on live Chat', error);
        return NextResponse.json({ error }, { status: 500 });
    }
}
