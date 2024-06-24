'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { CardContent } from '@/components/ui/card';
import { VideoOff, MonitorUp, CircleX } from 'lucide-react';
import ChatBox from './ChatBox';
import Graph from './StreamStatisticsGraph';
import StatTable from './StatTable';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { emptyLiveStream } from '@/redux/slices/liveStreamSlice';
import { emptyBroadcast } from '@/redux/slices/broadcastSlice';
import OverlayAccordion from './OverlayAccordion';

export function AlertDialogDemo({
  transitionToLive,
}: {
  transitionToLive: (status: string) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  return (
    <AlertDialog
      onOpenChange={(e) => {
        console.log(e);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button>
          Stop Stream <CircleX color="#ffffff" size="30" className="ml-4" />{' '}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will stop the currently ongoing
            streaming and broadcast.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const response = transitionToLive('complete');

                //@ts-ignore
                if (response.status == 200) {
                  dispatch(emptyLiveStream());
                  dispatch(emptyBroadcast());
                  router.push('/');
                }
              }}
            >
              {/** some inputs */}
              <Button type="submit">Stop</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function StudioEntry({ socket }: { socket: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const broadcastData = useAppSelector((state) => state.broadcasts);
  const [weAreLive, setWeAreLive] = useState<boolean>(false);

  // const { overlayImage, setOverlayImage } = useStudio();
  const [overlayImage, setOverlayImage] = useState<string>('');

  const transitionToLive = async (status: string) => {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/youtube/broadcast/status`;
    try {
      const response = await axios.put(url, {
        youtubeBroadcastId: broadcastData.id,
        status: status,
      });

      const data = response.data;
      console.log({ data });
      return data;
    } catch (error) {
      console.error(
        'Some error occurred while updating broadcast status to live.',
        error
      );
    }
  };

  const stopStreaming = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      // Clear the video source object
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setMediaStream(null);
    setWeAreLive(false);
  };

  const handleStreaming = async () => {
    setWeAreLive(true);

    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (overlayImage === '') {
      console.log('WithoutOverlay');
      socket.current.emit('without-overlay');
    } else {
      console.log('WithOverlay');
      socket.current.emit('with-overlay', overlayImage);
    }

    setTimeout(() => {
      setMediaStream(media);
      // @ts-ignore
      videoRef.current.srcObject = media;
    }, 2000);

    // transitionToLive('live');
  };

  useEffect(() => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm; codecs=vp9,opus',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        //@ts-ignore
        framerate: 25,
      });

      mediaRecorder.ondataavailable = (ev) => {
        socket.current.emit('binarystream', {
          stream: ev.data,
          overlay: overlayImage,
        });
      };

      mediaRecorder.start(1000);
    }
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream && socket.current) {
      stopStreaming();

      if (overlayImage === '') {
        console.log('WithoutOverlay');
        socket.current.emit('without-overlay');
      } else {
        console.log('WithOverlay');
        socket.current.emit('with-overlay', overlayImage);
      }

      setTimeout(() => {
        handleStreaming();
      }, 2000);
    }
  }, [overlayImage]);

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border mt-14 z-10"
      >
        <ResizablePanel defaultSize={20}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <Graph />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <StatTable />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={50}>
          <div className="col-span-9 gap-4">
            <CardContent className="p-10 items-center justify-center flex flex-col gap-2">
              <div>
                <p className="text-center text-2xl">Main Display</p>
              </div>

              <div className="w-[95%] h-[34rem] rounded-lg border bg-card text-card-foreground shadow-sm">
                {weAreLive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50 backdrop-blur-md">
                    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-4 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span
                        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
                        onClick={handleStreaming}
                      >
                        Go Live
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-2 flex justify-center gap-10 border-2 bg-white py-2 px-4">
                <Button>{true ? <MonitorUp /> : <VideoOff />}</Button>
                <Button>
                  {true ? (
                    <AlertDialogDemo transitionToLive={transitionToLive} />
                  ) : (
                    <VideoOff />
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel defaultSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <OverlayAccordion setOverlayImage={setOverlayImage} />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
              <ChatBox />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  );
}
