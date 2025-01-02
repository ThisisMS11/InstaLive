import { AuthOptions, SessionStrategy } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './db';
import { Adapter } from 'next-auth/adapters';

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma) as Adapter,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                    scope: 'openid profile email https://www.googleapis.com/auth/youtube https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly',
                },
            },
        }),
    ],
    pages: {
        signIn: '/',
    },
    secret: process.env.NEXTAUTH_SECRET,
    // defining how sessions are managed in your application, here using jwt strategy.
    // The JWT session strategy stores session data in a JSON Web Token, which is typically saved in a cookie on the client side. This is a stateless approach, meaning no session data is stored on the server.
    session: { strategy: 'jwt' as SessionStrategy, maxAge: 30 * 24 * 60 * 60 }, // 30 days maxAge.
    callbacks: {
        /* When jwt and session Callbacks are Invoked ?
        API Route Requests: When you make requests to /api/auth, NextAuth.js handles these requests using the code inside /pages/api/auth/* [...nextauth].ts.
        Session Management: When a user accesses a protected page (e.g., /dashboard), NextAuth.js needs to check the session. This check involves calling the jwt and session callbacks to verify and retrieve the session data.
        */

        async jwt({ token, account, profile }: any) {
            // When a new user logs in, add custom properties to the token

            if (account && profile) {
                token.refresh_token = account.refresh_token;
                token.access_token = account.access_token;
                token.id = account.userId;
                token.username = profile.name;
                token.expires_at = account.expires_at;
                return token;
            } else if (Date.now() < token.expires_at * 1000) {
                // If the access token has not expired yet, return it
                return token;
            } else {
                console.log('Asking for refresh token here ');
                /* Refresh Token Logic */
                if (!token.refresh_token)
                    throw new Error('Missing refresh token');

                // If the access token has expired, try to refresh it
                try {
                    // https://accounts.google.com/.well-known/openid-configuration
                    // We need the `token_endpoint`.
                    const response = await fetch(
                        'https://oauth2.googleapis.com/token',
                        {
                            headers: {
                                'Content-Type':
                                    'application/x-www-form-urlencoded',
                            },
                            body: new URLSearchParams({
                                client_id: process.env.GOOGLE_CLIENT_ID!,
                                client_secret:
                                    process.env.GOOGLE_CLIENT_SECRET!,
                                grant_type: 'refresh_token',
                                refresh_token: token.refresh_token,
                            }),
                            method: 'POST',
                        }
                    );

                    const tokens = await response.json();

                    if (!response.ok) throw tokens;

                    return {
                        ...token, // Keep the previous token properties
                        access_token: tokens.access_token,
                        expires_at: Math.floor(
                            Date.now() / 1000 + tokens.expires_in
                        ),
                        // Fall back to old refresh token, but note that
                        // many providers may only allow using a refresh token once.
                        refresh_token:
                            tokens.refresh_token ?? token.refresh_token,
                    };
                } catch (error) {
                    console.error('Error refreshing access token', error);
                    // The error property will be used client-side to handle the refresh token error
                    return {
                        ...token,
                        error: 'RefreshAccessTokenError' as const,
                    };
                }
            }
        },
        async session({ session, token }: any) {
            /* configuring the session object before sending it to the client */
            if (token) {
                session.access_token = token.access_token;
                session.user.id = token.sub;
                session.user.username = token.username;
                session.expires_at = token.expires_at;

                const user = await prisma.user.findUnique({
                    where: {
                        id: token.sub,
                    },
                });

                if (user) {
                    session.user.admin = user.admin;
                }
            }
            return session;
        },
    },
};
