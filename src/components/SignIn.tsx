'use client';
import GoogleIcon from '@/app/assets/google.svg';
import { useEffect, useRef } from 'react';
import { signIn, useSession, Image, useRouter } from '@/imports/Nextjs_imports';

const SignIn = () => {
  const session = useSession();
  const router = useRouter();

  const redirected = useRef(false);
  useEffect(() => {
    if (redirected.current === false && session.data?.user) {
      router.push('/dashboard');
      redirected.current = true;
    }
  }, [redirected, session, router]);

  return (
    <div className="flex">
      <div className="w-full md:w-2/5 flex justify-center items-center h-screen max-sm:hidden max-md:hidden">
        <div>
          <h1 className="text-4xl font-bold mb-4 ">Live</h1>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="opacity-50">
                <i className="fas fa-arrow-down fa-3x"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-screen md:w-3/5 flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="p-5">
            <h2 className="text-2xl font-semibold mb-2 text-center">Log In</h2>
          </div>
          <div className=" mb-4  justify-center py-1 sm:px-6 lg:px-8 ">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="font-normal text-2xl text-gray-900">Welcome</p>

                  <p className="font-light text-sm text-gray-600">
                    Log in to continue to InstaLive.
                  </p>
                  <button
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border rounded font-light text-md text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 -mt-2"
                    onClick={async () => {
                      await signIn('google');
                    }}
                  >
                    <Image
                      src={GoogleIcon.src}
                      className="w-5 h-5 mr-2"
                      alt="Github Icon"
                      width={25}
                      height={25}
                    />
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignIn;
