'use client';
import GoogleIcon from '@/app/assets/google.svg';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const SignIn = () => {
    const session = useSession();
    const router = useRouter();
    const redirected = useRef(false);

    useEffect(() => {
        if (!redirected.current && session.data?.user) {
            router.push('/dashboard');
            redirected.current = true;
        }
    }, [redirected, session, router]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                <h1 className="text-3xl font-semibold text-center text-gray-800">
                    Welcome to HopeMailer
                </h1>
                <p className="mt-2 text-center text-gray-600 text-sm">
                    Sign in to access your dashboard and manage your emails.
                </p>

                <div className="mt-6">
                    <button
                        className="w-full flex items-center justify-center gap-3 py-3 px-5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                        onClick={async () => {
                            await signIn('google');
                        }}
                    >
                        <Image
                            src={GoogleIcon.src}
                            alt="Google Icon"
                            width={20}
                            height={20}
                            className="inline-block"
                        />
                        Continue with Google
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        By signing in, you agree to our
                        <a
                            href="/terms"
                            className="text-blue-600 hover:underline ml-1"
                        >
                            Terms of Service
                        </a>
                        and
                        <a
                            href="/privacy"
                            className="text-blue-600 hover:underline ml-1"
                        >
                            Privacy Policy
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
