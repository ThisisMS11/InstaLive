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
import { type } from 'os';
import ChatBox from './ChatBox';
import Graph from './StreamStatisticsGraph';
import StatTable from './StatTable';

export default function StudioEntry() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // const audioRef = useRef<HTMLAudioElement>(null);

  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const socket = useRef<any>(null);
  // const mediaRecorder = useRef<MediaRecorder | null>(null);

  let liveStreamRecorder;

  // const [audioLevel, setAudioLevel] = useState<number>(0);
  // const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const transitionToLive = async () => {
    const url = `${process.env.NEXT_PUBLIC_URL}/api/youtube/broadcast/status`;
    try {
      const response = await axios.put(url, {
        youtubeBroadcastId: 'GWodIL8vJ-k',
        status: 'testing',
      });
      const data = response.data;
      console.log({ data });
      return data;
    } catch (error) {
      console.error(
        'Some error occurred while updating broadcast status:',
        error
      );
      throw error;
    }
  };

  const InitiateRecording = async () => {
    const videoElement = videoRef.current as HTMLVideoElement & {
      captureStream?(frameRate?: number): MediaStream;
    };

    if (videoElement && videoElement.captureStream) {
      const videoStream = videoElement.captureStream(30); // Capture video at 30FPS

      console.log({ videoStream });

      try {
        // Capture audio stream
        const audioStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        // Combine video and audio streams
        const combinedStream = new MediaStream([
          ...videoStream.getVideoTracks(),
          ...audioStream.getAudioTracks(),
        ]);

        console.log({ combinedStream });

        liveStreamRecorder = new MediaRecorder(combinedStream, {
          audioBitsPerSecond: 128000,
          videoBitsPerSecond: 2500000,
          mimeType: 'video/webm;codecs=vp8,opus',
          //@ts-ignore
          framerate: 30,
        });

        liveStreamRecorder.ondataavailable = (e: any) => {
          console.log('Data is available and sent.');
          console.log(typeof e.data);
          console.log(e.data);

          socket.current.emit('binarystream', e.data);
        };

        // Start recording and dump data every second
        liveStreamRecorder.start(1000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      console.error('captureStream is not supported on this browser.');
    }
  };

  const handleStreaming = async () => {
    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setMediaStream(media);

    // @ts-ignore
    videoRef.current.srcObject = media;
  };

  // useEffect(() => {
  //     if (mediaStream) {
  //         const mediaRecorder = new MediaRecorder(mediaStream, {
  //             audioBitsPerSecond: 128000,
  //             videoBitsPerSecond: 2500000,
  //             // @ts-ignore
  //             framerate: 25
  //         })

  //         mediaRecorder.ondataavailable = ev => {
  //             console.log('Binary Stream Available', ev.data)
  //             socket.current.emit('binarystream', ev.data)
  //         }

  //         mediaRecorder.start(25)
  //     }
  // }, [mediaStream])

  useEffect(() => {
    const InstaLive = () => {
      console.log('live Me called');
      const youtubeUrl =
        'rtmp://a.rtmp.youtube.com/live2/w8vy-4dvt-42ea-5xtg-31zr';
      const url = `http://localhost:8005/?youtubeUrl=${youtubeUrl}`;
      socket.current = io(url, {
        transports: ['websocket'],
      });
    };

    InstaLive();
  }, []);

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className=" rounded-lg border mt-14 z-10"
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
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
              </div>

              {/* <div className="col-span-2 space-y-1.5 rounded-lg border bg-card text-card-foreground shadow-sm">
    <div ref={audioRef} className="h-full w-full bg-gray-200 relative flex items-end justify-center">
        <div className={classNames('w-full', { 'bg-red-500': audioLevel > 90, 'bg-orange-500': audioLevel > 60 && audioLevel <= 90, 'bg-green-500': audioLevel <= 60 })} style={{ height: `${audioLevel}%` }}></div>
    </div>
</div> */}

              {/* ButtonGroup to toggle audio and video */}
              <div className=" mt-2 flex justify-center gap-10 border-2 bg-white py-2 px-4">
                <Button>{true ? <Mic /> : <MicOff />}</Button>
                <Button>{true ? <Video /> : <VideoOff />}</Button>
                <Button onClick={handleStreaming}>
                  {true ? <MonitorUp /> : <VideoOff />}
                </Button>
                {true ? <CircleX color="#e70d0d" size="38" /> : <VideoOff />}
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
