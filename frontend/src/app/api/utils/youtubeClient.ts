import { google } from 'googleapis';
import { getServerSession } from 'next-auth';
import { oauth2Client } from '@/app/api/utils/oauth2Client';
import { authOptions } from '@/lib/auth';

let youtubeClient: any = null;

export const getSessionAccessToken = async () => {
  const session = await getServerSession(authOptions);
  // @ts-ignore
  const accessToken = session?.access_token;
  if (!accessToken) {
    throw new Error('Access token is not available.');
  }
  oauth2Client.setCredentials({ access_token: accessToken });
  return session;
};

export const getYoutubeClient = async () => {
  if (!youtubeClient) {
    if (!oauth2Client.credentials || !oauth2Client.credentials.access_token)
      await getSessionAccessToken();

    youtubeClient = google.youtube({
      version: 'v3',
      auth: oauth2Client,
    });
  }
  return youtubeClient;
};
