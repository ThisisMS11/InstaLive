'use client';
import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { DialogBox } from '@/imports/Component_imports';
import { Loader } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import { getYoutubeChannelInfo } from '@/services/user';

const DashBoard = () => {
  const { status } = useSession();
  const buttonref = useRef<HTMLButtonElement | null>(null);
  const { channel, isError, isLoading } = getYoutubeChannelInfo();

  if (isError) {
    console.log('Some Error occured at dashboard page : ');
  }

  if (status === 'loading' || isLoading) {
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

  // Directly using the channel data from SWR
  const youtubeChannelInfo = channel
    ? {
        channelId: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        customUrl: channel.snippet.customUrl,
        thumbnail: channel.snippet.thumbnails.medium.url,
      }
    : null;

  console.log('data : ', channel);

  return (
    <div className="flex h-[100vh] items-center justify-center p-0">
      <Dashboard buttonRef={buttonref} />
      <DialogBox
        buttonRef={buttonref}
        youtubeChannelInfo={youtubeChannelInfo}
      />
    </div>
  );
};

export default DashBoard;
