// studioContext.tsx
'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface StudioContextType {
  isVideoOn: boolean;
  setIsVideoOn: (data: boolean) => void;
  isAudioOn: boolean;
  setIsAudioOn: (data: boolean) => void;
  displayName: string;
  setDisplayName: (data: string) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider = ({ children }: { children: ReactNode }) => {
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [displayName, setDisplayName] = useState<string>('');

  return (
    <StudioContext.Provider
      value={{
        isVideoOn,
        setIsVideoOn,
        isAudioOn,
        setIsAudioOn,
        displayName,
        setDisplayName,
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
