'use client';
import React, { useState, useEffect, useRef } from 'react';
import StudioEntry from '@/components/StudioEntry';
import MainStudio from '@/components/MainStudio';
import { StudioProvider } from '@/app/context/StudioContext';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { io } from 'socket.io-client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';
import { useDispatch } from 'react-redux';

const Studio = () => {
  const liveStreamData = useAppSelector((state) => state.livestreams);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gotoStudio, setGotoStudio] = useState<boolean>(false);
  const socket = useRef<any>(null);

  useEffect(() => {
    if (liveStreamData.id === '') {
      const timer = setTimeout(() => {
        toast('My toast', {
          className: 'my-classname',
          description: 'Livestream is not yet Established',
          duration: 5000,
          icon: <ShieldAlert color="#ba2c2c" />,
        });

        router.push('/dashboard');
      }, 1000);

      // Clear the timer on cleanup to avoid multiple toasts
      return () => clearTimeout(timer);
    }
  }, [liveStreamData.id]);

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
  }, [liveStreamData]);

  return (
    <StudioProvider>
      {!gotoStudio ? (
        <div className="flex items-center justify-center h-[98vh] overflow-y-hidden">
          <StudioEntry setGotoStudio={setGotoStudio} />
        </div>
      ) : (
        <MainStudio socket={socket} />
      )}
    </StudioProvider>
  );
};

export default Studio;
