'use client';
import React from 'react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { motion } from 'framer-motion';
import { HeroHighlight, Highlight } from '@/components/ui/hero-highlight';
import { signIn, useSession } from 'next-auth/react';
import { MoveRight } from 'lucide-react';
import GoogleIcon from '@/app/assets/google.svg';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

function DashBoardButton() {
  const router = useRouter();

  return (
    <button
      className="cursor-pointer flex px-4 py-2 relative bg-gradient-to-r text-white from-indigo-500 to-purple-500 rounded-md mx-auto z-10"
      style={{ pointerEvents: 'auto' }}
      onClick={() => {
        router.push('/dashboard');
      }}
    >
      DashBoard
      <motion.div
        className="mx-2"
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1, ease: 'easeInOut' }}
      >
        <MoveRight />
      </motion.div>
    </button>
  );
}

function GoogleSignButton() {
  return (
    <button
      className="w-fit flex justify-center items-center gap-2 py-3 px-4 border rounded font-light text-md text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 -mt-2 cursor-pointer z-10"
      style={{ pointerEvents: 'auto' }}
      onClick={async () => {
        console.log('clicked');
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
  );
}

export default function HomePage() {
  const session = useSession();
  return (
    <>
      <div className="h-[100vh] w-full rounded-md bg-white  flex flex-col items-center justify-center antialiased">
        <div className="max-w-3xl mx-auto p-4  text-center">
          <HeroHighlight>
            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: [20, -5, 0],
              }}
              transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-600 to-neutral-400  text-center font-sans font-bold"
            >
              LiveStream Just One Name
              <Highlight className="text-black dark:text-white">
                InstaLive
              </Highlight>
            </motion.h1>
            <p className="text-neutral-500 max-w-lg mx-auto mt-4 text-2xl text-center relative z-10">
              Go live effortlessly and reach your audience everywhere with
              InstaLive
            </p>
          </HeroHighlight>
        </div>
        <BackgroundBeams />
        {session?.data?.user ? <DashBoardButton /> : <GoogleSignButton />}
      </div>
    </>
  );
}
