
import { getServerSession } from 'next-auth';
import { oauth2Client } from '@/app/api/youtube/google';
import { authOptions } from '@/lib/auth';

const getSessionAccessToken = async () => {
    const session = await getServerSession(authOptions);
    // @ts-ignore
    const accessToken = session?.access_token;
    if (!accessToken) {
        throw new Error('Access token is not available.');
    }
    oauth2Client.setCredentials({ access_token: accessToken });
    return session;
};

export default getSessionAccessToken;