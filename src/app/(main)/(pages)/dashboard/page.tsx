'use client';
import React, { useRef } from 'react';
import { useSession } from 'next-auth/react';
import { LiveStreamDialog, Loader } from '@/imports/Component_imports';
import Dashboard from '@/components/Dashboard';
import { useYoutubeChannelInfo } from '@/services/user';
import { useAllBroadcasts } from '@/services/broadcast';
import { toast } from 'sonner';
import { setYoutubeChannelInfo, useAppDispatch } from '@/imports/Redux_imports';

const DashBoard = () => {
  const { status } = useSession();
  const buttonref = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();

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

  const youtubeChannelInfo = channel
    ? {
        channelId: channel.id,
        title: channel.snippet.title,
        description: channel.snippet.description,
        thumbnail: channel.snippet.thumbnails.medium.url,
        customUrl: channel.snippet.customUrl,
      }
    : null;

  if (youtubeChannelInfo) {
    dispatch(setYoutubeChannelInfo(youtubeChannelInfo));
  }

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
