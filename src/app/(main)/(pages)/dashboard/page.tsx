'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashBoardCard from '@/components/Card';
import DialogBox from '@/components/DialogBox';
import { Loader } from 'lucide-react';

const DashBoard = () => {
  const { data: session, status } = useSession();

  const [youtubeChannelInfo, setYoutubeChannelInfo] = useState<any>();

  const buttonref = useRef<HTMLButtonElement | null>(null);

  if (status === 'loading') {
    return (
      <div className="flex h-[100vh] fixed top-0 w-full bg-white opacity-60 items-center justify-center gap-2">
        <Loader className="animate-spin" />
        <span className="text-sm font-semibold ">
          Hang Tight ! Dashboard is Loading ...
        </span>
      </div>
    );
  } else if (status === 'authenticated') {
    console.log('User is Authenticated.');
  }

  return (
    <div className="flex h-[100vh] items-center justify-center p-10">
      <DashBoardCard
        buttonRef={buttonref}
        setYoutubeChannelInfo={setYoutubeChannelInfo}
      />

      <DialogBox
        buttonRef={buttonref}
        youtubeChannelInfo={youtubeChannelInfo}
      />
    </div>
  );
};

export default DashBoard;
