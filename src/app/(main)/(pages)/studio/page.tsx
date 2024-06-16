'use client';
import React, { useState, useEffect, useRef } from 'react';
import StudioEntry from '@/components/StudioEntry';
import MainStudio from '@/components/MainStudio';
import { StudioProvider } from '@/app/context/StudioContext';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { io } from 'socket.io-client';

const Studio = () => {
  const liveStreamData = useAppSelector((state) => state.livestreams);
  const broadcastData = useAppSelector((state) => state.broadcasts);

  const [gotoStudio, setGotoStudio] = useState<boolean>(false);
  const socket = useRef<any>(null);

  // useEffect(() => {
  //   console.log('livestream data : ', liveStreamData);
  //   console.log('broadcast data : ', broadcastData);
  // }, []);

  useEffect(() => {
    const InstaLive = async () => {
      console.log('Connecting to the server ....');

      if (liveStreamData) {
        const ingestionAddress = liveStreamData.ingestionAddress;
        const streamName = liveStreamData.streamName;

        const youtubeUrl = `${ingestionAddress}/${streamName}`;
        console.log({ youtubeUrl });
        const url = `http://localhost:8005/?youtubeUrl=${youtubeUrl}`;

        socket.current = io(url, {
          transports: ['websocket'],
        });
      }
    };

    InstaLive();
  }, []);

  return (
    /* Get the Configuration before moving on to the main studio like audio check ,video check and display name */
    <StudioProvider>
      {!gotoStudio ? (
        <div className="flex items-center justify-center h-[98vh] overflow-y-hidden border-2 ">
          {' '}
          <StudioEntry setGotoStudio={setGotoStudio} />{' '}
        </div>
      ) : (
        <MainStudio socket={socket} />
      )}
    </StudioProvider>
  );
};

export default Studio;
