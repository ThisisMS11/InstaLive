'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import DashBoardCard from '@/components/Card';
import DialogBox from '@/components/DialogBox';
import { Loader } from 'lucide-react';
import Temp from '@/components/Temp';
import axios from 'axios';

const DashBoard = () => {
  const { data: session, status } = useSession();

  const [youtubeChannelInfo, setYoutubeChannelInfo] = useState<any>();
  const [isLoading, setisLoading] = useState<boolean>(true);

  const buttonref = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const fetchUserYoutubeChannelInfo = async () => {
      setisLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URL}/api/youtube/info`
        );
        const data = response.data.data;

        // console.log({ data });

        // Transform the response data to match the YouTube type
        const youtubeChannelInfo = {
          channelId: data.id,
          title: data.snippet.title,
          description: data.snippet.description,
          customUrl: data.snippet.customUrl,
          thumbnail: data.snippet.thumbnails.medium.url,
        };

        // Update the state with the YouTube channel info
        setYoutubeChannelInfo(youtubeChannelInfo);
        setisLoading(false);
      } catch (error) {
        console.log(
          'Error while fetching user YouTube channel information at Card.tsx',
          error
        );
      }
    };

    fetchUserYoutubeChannelInfo();
  }, []);

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

  return (
    <div className="flex h-[100vh] items-center justify-center p-0">
      {/* <DashBoardCard
        buttonRef={buttonref}
        setYoutubeChannelInfo={setYoutubeChannelInfo}
      /> */}

      <Temp buttonRef={buttonref} />

      <DialogBox
        buttonRef={buttonref}
        youtubeChannelInfo={youtubeChannelInfo}
      />
    </div>
  );
};

export default DashBoard;
