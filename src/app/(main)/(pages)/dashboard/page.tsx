'use client';
import React, { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import DashBoardCard from '@/components/Card';
import DialogBox from '@/components/DialogBox';

const DashBoard = () => {
  const { data: session, status } = useSession();
  const buttonref = useRef<HTMLButtonElement | null>(null);


  useEffect(() => {
    if (status === 'loading') {
      console.log('Session is loading...');
    } else if (status === 'authenticated') {
      console.log("User is Authenticated.")
      // console.log('Session data:', session);
    } else {
      console.log('Session status:', status);
    }
  }, [session, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }


  return (
    <div className='flex items-center justify-center p-10'>
      <DashBoardCard buttonRef={buttonref} />
      <DialogBox buttonRef={buttonref} />
    </div>
  );
};

export default DashBoard;
