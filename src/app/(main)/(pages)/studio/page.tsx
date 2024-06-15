'use client';
import React, { useState, useEffect } from 'react';
import StudioEntry from '@/components/StudioEntry';
import MainStudio from '@/components/MainStudio';
import { StudioProvider } from '@/app/context/StudioContext';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';

const Studio = () => {
  const liveStreamData = useAppSelector((state) => state.livestreams);
  const broadcastData = useAppSelector((state) => state.broadcasts);

  const [gotoStudio, setGotoStudio] = useState<boolean>(false);

  useEffect(() => {
    console.log('livestream data : ', liveStreamData);
    console.log('broadcast data : ', broadcastData);
  }, []);

  return (
    /* Get the Configuration before moving on to the main studio like audio check ,video check and display name */
    <StudioProvider>
      {/* {!gotoStudio ? <div className='flex items-center justify-center h-[98vh] overflow-y-hidden border-2 '> <StudioEntry setGotoStudio={setGotoStudio} /> </div> : <MainStudio />} */}

      <MainStudio />
    </StudioProvider>
  );
};

export default Studio;
