'use client';
import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useStudio } from '@/app/context/StudioContext';
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/imports/Shadcn_imports';

export default function StudioEntry({
  setGotoStudio,
}: {
  setGotoStudio: (_data: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLDivElement>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null)

  const {
    isVideoOn,
    setIsVideoOn,
    isAudioOn,
    setIsAudioOn,
    displayName,
    setDisplayName,
    startWebCam,
    stopWebCam
  } = useStudio();

  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const handleVideoToggle = async () => {
    if (isVideoOn && localStream) {
      stopWebCam(localStream, videoRef);
      setLocalStream(null);
    }
    else {
      const stream = await startWebCam(videoRef);
      if (stream)
        setLocalStream(stream);
    }

    setIsVideoOn(!isVideoOn);
  };

  const handleAudioToggle = () => {
    if (isAudioOn) {
      if (audioContext) {
        setAudioLevel(0); // Set audio level to zero immediately
        audioContext.suspend(); // Suspend audio context
      }
    } else {
      if (!audioContext) {
        startAudio(); // Restart audio stream
      } else {
        audioContext.resume(); // Resume audio context
      }
    }
    setIsAudioOn(!isAudioOn);
  };

  async function startAudio() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const newAudioContext = new AudioContext();
      const source = newAudioContext.createMediaStreamSource(stream);
      const analyser = newAudioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 256;
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const analyze = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average);
        requestAnimationFrame(analyze);
      };

      analyze();
      setAudioContext(newAudioContext);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  }

  useEffect(() => {
    async function initiate() {
      const stream = await startWebCam(videoRef);
      if (stream)
        setLocalStream(stream);
      startAudio();
    }

    initiate();


    return () => {
      if (localStream)
        stopWebCam(localStream, videoRef);
    }
  }, []);

  return (
    <Card className="w-[700px]">
      <CardHeader>
        <CardTitle className="text-center">
          Let&apos;s check your camera and audio
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-10 gap-4 h-74">
          <div className="col-span-8 space-y-1.5 rounded-lg border bg-card text-card-foreground shadow-sm">
            <video ref={videoRef} autoPlay muted className="w-full h-full" />
          </div>
          <div className="col-span-2 space-y-1.5 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div
              ref={audioRef}
              className="h-full w-full bg-gray-200 relative flex items-end justify-center"
            >
              <div
                className={classNames('w-full', {
                  'bg-red-500': audioLevel > 90,
                  'bg-orange-500': audioLevel > 60 && audioLevel <= 90,
                  'bg-green-500': audioLevel <= 60,
                })}
                style={{ height: `${audioLevel}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* ButtonGroup to toggle audio and video */}
        <div className="mt-6 flex justify-center gap-10">
          <Button onClick={handleAudioToggle}>
            {isAudioOn ? <Mic /> : <MicOff />}
          </Button>
          <Button onClick={handleVideoToggle}>
            {isVideoOn ? <Video /> : <VideoOff />}
          </Button>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between flex-col w-full gap-4">
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            placeholder="Name of your display"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Button
            className="w-full"
            onClick={() => {

              if (localStream) {
                stopWebCam(localStream, videoRef);
                setLocalStream(null);
              }

              setGotoStudio(true);
            }}
          >
            Enter Studio
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
