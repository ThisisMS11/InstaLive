'use client';

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import classNames from 'classnames';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { useStudio } from "@/app/context/StudioContext";


export default function StudioEntry() {

    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLDivElement>(null);

    const { isVideoOn, setIsVideoOn, isAudioOn, setIsAudioOn, displayName } = useStudio();

    const [audioLevel, setAudioLevel] = useState<number>(0);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

    const handleVideoToggle = () => {
        if (isVideoOn) stopVideo();
        else startVideo();

        setIsVideoOn(!isVideoOn);
    };

    const handleAudioToggle = () => {
        if (isAudioOn) {
            if (audioContext) {
                setAudioLevel(0);  // Set audio level to zero immediately
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

    const startVideo = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error("Error accessing webcam:", error);
        }
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            const tracks = stream.getTracks();

            tracks.forEach(track => track.stop());
        }
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
            console.error("Error accessing microphone:", error);
        }
    }

    useEffect(() => {
        if (isVideoOn) startVideo();
        if (isAudioOn) startAudio();

        return () => {
            stopVideo();
            if (audioContext) {
                audioContext.close();
                setAudioLevel(0);
            }
        };
    }, []);

    return (
        <Card className="grid grid-cols-12">
            {/* <CardHeader>
                <CardTitle className="text-center">Main {displayName}</CardTitle>
            </CardHeader> */}
            <div className="col-span-10 gap-4">

                <CardContent className=" bb items-center justify-center flex flex-col">

                <div className="w-[65rem] h-[40rem] rounded-lg border bg-card text-card-foreground shadow-sm">
                        <video ref={videoRef} autoPlay className="w-full h-full object-cover" />
                    </div>
                    {/* <div className="col-span-2 space-y-1.5 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <div ref={audioRef} className="h-full w-full bg-gray-200 relative flex items-end justify-center">
                            <div className={classNames('w-full', { 'bg-red-500': audioLevel > 90, 'bg-orange-500': audioLevel > 60 && audioLevel <= 90, 'bg-green-500': audioLevel <= 60 })} style={{ height: `${audioLevel}%` }}></div>
                        </div>
                    </div> */}

                    {/* ButtonGroup to toggle audio and video */}
                    <div className="bb mt-2 flex justify-center gap-10">
                        <Button onClick={handleAudioToggle}>
                            {isAudioOn ? <Mic /> : <MicOff />}
                        </Button>
                        <Button onClick={handleVideoToggle}>
                            {isVideoOn ? <Video /> : <VideoOff />}
                        </Button>
                    </div>

                </CardContent>
            </div>


        </Card>
    );
}
