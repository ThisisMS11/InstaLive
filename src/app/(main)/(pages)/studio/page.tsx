'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MainStudio, StudioEntry } from '@/imports/Component_imports';
import { StudioProvider } from '@/app/context/StudioContext';
import { useAppSelector } from '@/hooks/redux';
import { io } from 'socket.io-client';
import { useRouter } from '@/imports/Nextjs_imports';
import { toast } from 'sonner';
import { ShieldAlert } from 'lucide-react';

const Studio = () => {
  const liveStreamData = useAppSelector((state) => state.livestreams);
  const router = useRouter();
  const [gotoStudio, setGotoStudio] = useState<boolean>(false);
  const broadcast_socket = useRef<any>(null);
  const model_socket = useRef<any>(null);

  useEffect(() => {
    if (liveStreamData.id === '') {
      const timer = setTimeout(() => {
        toast('Error', {
          description: 'Livestream is not yet Established',
          duration: 5000,
          icon: <ShieldAlert color="#ba2c2c" />,
        });

        // router.push('/dashboard');
      }, 1000);

      // Clear the timer on cleanup to avoid multiple toasts
      return () => clearTimeout(timer);
    }
  }, [liveStreamData.id, router]);

  useEffect(() => {
    const InstaLive = async () => {
      console.log('Connecting to the server ....');

      if (liveStreamData) {
        const ingestionAddress = liveStreamData.ingestionAddress;
        const streamName = liveStreamData.streamName;

        const youtubeUrl = `${ingestionAddress}/${streamName}`;
        const broadcasting_server_url = `${process.env.NEXT_PUBLIC_FFMPEG_SERVER}/?youtubeUrl=${youtubeUrl}`;
        const model_server_url = `http://localhost:8005`;

        broadcast_socket.current = io(broadcasting_server_url, {
          transports: ['websocket'],
        });

        model_socket.current = io(model_server_url, {
          transports: ['websocket'],
        })
      }
    };
    InstaLive();
  }, [liveStreamData, router]);

  return (
    <StudioProvider>
      {/* {!gotoStudio ? (
        <div className="flex items-center justify-center h-[98vh] overflow-y-hidden">
          <StudioEntry setGotoStudio={setGotoStudio} />
        </div>
      ) : (
        <MainStudio broadcast_socket={broadcast_socket} model_socket={model_socket} />
      )} */}
      <MainStudio broadcast_socket={broadcast_socket} model_socket={model_socket} />
    </StudioProvider>
  );
};

export default Studio;
