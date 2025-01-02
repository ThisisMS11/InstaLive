'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StudioContextType {
    isVideoOn: boolean;
    setIsVideoOn: (_data: boolean) => void;
    isAudioOn: boolean;
    setIsAudioOn: (_data: boolean) => void;
    displayName: string;
    setDisplayName: (_data: string) => void;
    overlayImage: string;
    setOverlayImage: (_data: string) => void;
    startWebCam: (
        _ref: React.RefObject<HTMLVideoElement>
    ) => Promise<MediaStream | undefined>;
    stopWebCam: (
        _stream: MediaStream,
        _ref: React.RefObject<HTMLVideoElement>
    ) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider = ({ children }: { children: ReactNode }) => {
    const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
    const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
    const [displayName, setDisplayName] = useState<string>('');
    const [overlayImage, setOverlayImage] = useState<string>('');

    const startWebCam = async (ref: React.RefObject<HTMLVideoElement>) => {
        try {
            console.log('Starting the web cam...');
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true,
            });
            if (ref.current && stream) {
                ref.current.srcObject = stream;
            }
            return stream;
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const stopWebCam = async (
        stream: MediaStream,
        ref: React.RefObject<HTMLVideoElement>
    ) => {
        if (stream) {
            console.log('Stopping the web cam...');
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            if (ref.current) {
                ref.current.srcObject = null;
            }
        }
    };

    return (
        <StudioContext.Provider
            value={{
                isVideoOn,
                setIsVideoOn,
                isAudioOn,
                setIsAudioOn,
                displayName,
                setDisplayName,
                overlayImage,
                setOverlayImage,
                startWebCam,
                stopWebCam,
            }}
        >
            {children}
        </StudioContext.Provider>
    );
};

export const useStudio = () => {
    const context = useContext<StudioContextType | undefined>(StudioContext);
    if (!context) {
        throw new Error('useStudio must be used within a StudioProvider');
    }
    return context;
};
