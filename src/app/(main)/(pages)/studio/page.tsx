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
  const broadCastData = useAppSelector((state) => state.broadcasts);
  const router = useRouter();
  const [gotoStudio, setGotoStudio] = useState(false);
  const [errorOccurred, setErrorOccurred] = useState(false); // Add error state
  const broadcast_socket = useRef<any>(null);
  const model_socket = useRef<any>(null);

  // Livestream establishment check
  useEffect(() => {
    if (!liveStreamData?.id) {
      const timer = setTimeout(() => {
        toast.error('Livestream is not yet Established', {
          duration: 5000,
          icon: <ShieldAlert size={20} color="red" />,
        });
        router.push('/dashboard');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [liveStreamData?.id, router]);

  // Connect to servers for broadcasting and model handling
  useEffect(() => {
    const InstaLive = async () => {
      console.log('Connecting to the server...');

      if (liveStreamData && broadCastData) {
        const { ingestionAddress, streamName } = liveStreamData;
        const { liveChatId } = broadCastData;

        if (ingestionAddress === '' || streamName === '') {
          toast.error(
            'Invalid livestream data. Check the ingestion address or stream name.',
            { duration: 5000 }
          );
          setErrorOccurred(true);
          return;
        }

        const youtubeUrl = `${ingestionAddress}/${streamName}`;
        const broadcasting_server_url = `${process.env.NEXT_PUBLIC_FFMPEG_SERVER}/?youtubeUrl=${youtubeUrl}`;
        const model_server_url = `http://localhost:8005/?liveChatId=${liveChatId}`;

        try {
          if (!process.env.NEXT_PUBLIC_FFMPEG_SERVER) {
            throw new Error(
              'FFMPEG Server URL not found in environment variables'
            );
          }

          /* Broadcast socket connection */
          console.info('Establishing socket connections with model server');
          broadcast_socket.current = io(broadcasting_server_url, {
            transports: ['websocket'],
          });

          /* Model socket connection */
          console.info('Establishing socket connections with model server');
          model_socket.current = io(model_server_url, {
            transports: ['websocket'],
          });

          broadcast_socket.current.on('connect_error', (err: any) => {
            // toast.error('Failed to connect to the broadcasting server.', {
            //   duration: 5000,
            // });
            console.error('Broadcast connection error:', err);
            setErrorOccurred(true);
          });

          model_socket.current.on('connect_error', (err: any) => {
            // toast.error('Failed to connect to the model server.', {
            //   duration: 5000,
            // });
            console.error('Model connection error:', err);
            setErrorOccurred(true);
          });
        } catch (error) {
          // @ts-ignore
          toast.error(`Error initializing sockets: ${error?.message}`, {
            duration: 5000,
          });
          setErrorOccurred(true);
        }
      }
    };

    InstaLive();
  }, [liveStreamData, broadCastData]);

  if (errorOccurred) {
    return <div>Error occurred. Please check livestream data.</div>;
  }

  return (
    <StudioProvider>
      {!gotoStudio ? (
        <div className="flex items-center justify-center h-[98vh] overflow-y-hidden">
          <StudioEntry setGotoStudio={setGotoStudio} />
        </div>
      ) : (
        <MainStudio
          broadcast_socket={broadcast_socket}
          model_socket={model_socket}
        />
      )}
      {/* <MainStudio
        broadcast_socket={broadcast_socket}
        model_socket={model_socket}
      /> */}
    </StudioProvider>
  );
};

export default Studio;
