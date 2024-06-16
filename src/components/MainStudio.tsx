'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import classNames from 'classnames';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Podcast,
  MonitorUp,
  CircleX,
} from 'lucide-react';
import { useStudio } from '@/app/context/StudioContext';
import { io } from 'socket.io-client';
import axios from 'axios';
import ChatBox from './ChatBox';
import Graph from './StreamStatisticsGraph';
import StatTable from './StatTable';

import { useAppSelector } from '@/hooks/redux';

export default function StudioEntry({ socket }: { socket: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const broadcastData = useAppSelector((state) => state.broadcasts);
  const [weAreLive, setWeAreLive] = useState<boolean>(false);
  // const socket = useRef<any>(null);

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

  const handleStreaming = async () => {
    setWeAreLive(true);

    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMediaStream(media);
    // @ts-ignore
    videoRef.current.srcObject = media;

    transitionToLive('live');
  };

  const handleStopLiveStream = async () => {
    transitionToLive('complete');
  };

  useEffect(() => {
    console.log('mediastream changed');

    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm; codecs=vp9,opus',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        //@ts-ignore
        framerate: 25,
      });

      mediaRecorder.ondataavailable = (ev) => {
        console.log('Binary Stream Available', ev.data);
        socket.current.emit('binarystream', ev.data);
      };

      mediaRecorder.start(25);
    }
  }, [mediaStream]);

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
                <Button onClick={handleStreaming}>
                  {true ? <MonitorUp /> : <VideoOff />}
                </Button>
                <Button onClick={handleStopLiveStream}>
                  {true ? <CircleX color="#e70d0d" size="38" /> : <VideoOff />}
                </Button>
              </div>
            </CardContent>
          </div>
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel defaultSize={30}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <Graph />
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
