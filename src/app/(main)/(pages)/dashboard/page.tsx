'use client';
import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { DialogBox, Loader } from '@/imports/Component_imports';
import Dashboard from '@/components/Dashboard';
import { getYoutubeChannelInfo } from '@/services/user';
import { fetchAllBroadcasts, fetchBroadcastMetrices } from '@/services/youtube';
import { toast } from 'sonner';

const DashBoard = () => {
  const { status } = useSession();
  const buttonref = useRef<HTMLButtonElement | null>(null);

  const {
    channel,
    isError: channelError,
    isLoading: channelLoading,
  } = getYoutubeChannelInfo();
  const {
    broadcasts,
    isError: broadcastsError,
    isLoading: broadcastsLoading,
  } = fetchAllBroadcasts();

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

  console.log('channel data:', channel);
  console.log('broadcasts data:', broadcasts);

  return (
    <div className="flex h-[100vh] items-center justify-center p-0">
      <Dashboard buttonRef={buttonref} broadcasts={broadcasts} />
      <DialogBox
        buttonRef={buttonref}
        youtubeChannelInfo={youtubeChannelInfo}
      />
    </div>
  );
};

export default DashBoard;
