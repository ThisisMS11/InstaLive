'use client';
import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { LiveStreamDialog, Loader } from '@/imports/Component_imports';
import Dashboard from '@/components/Dashboard';
import { useYoutubeChannelInfo } from '@/services/user';
import { useAllBroadcasts } from '@/services/youtube';
import { toast } from 'sonner';

const DashBoard = () => {
  const { status } = useSession();
  const buttonref = useRef<HTMLButtonElement | null>(null);


  const {
    channel,
    isError: channelError,
    isLoading: channelLoading,
  } = useYoutubeChannelInfo();

  const {
    broadcasts,
    isError: broadcastsError,
    isLoading: broadcastsLoading,
  } = useAllBroadcasts();

  if (channelError || broadcastsError) {
    console.log('Error occurred:', { channelError, broadcastsError });
    toast('Error', {
      description: 'Some Error Occurred while fetching data',
      duration: 5000,
    });
  }

  if (channelLoading || broadcastsLoading || status === 'loading') {
    return <Loader message="Hang Tight! Dashboard is Loading..." />;
  }

  if (status === 'authenticated') {
    console.log('User is Authenticated.');
  }

  console.count('Dashboard page Rendered');

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

  // console.log('channel data:', channel);
  // console.log('broadcasts data:', broadcasts);

  return (
    <div className="flex items-center justify-center p-0">
      <Dashboard buttonRef={buttonref} broadcasts={broadcasts} />
      <LiveStreamDialog
        buttonRef={buttonref}
        youtubeChannelInfo={youtubeChannelInfo}
      />
    </div>
  );
};

export default DashBoard;
