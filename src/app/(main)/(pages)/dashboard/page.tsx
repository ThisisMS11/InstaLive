'use client';
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';

const DashBoard = () => {
  const { data: session, status } = useSession();

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
    <div>
      <h1>DashBoard</h1>
      {status === 'authenticated' && <p>Welcome, {session.user?.name}!</p>}
    </div>
  );
};

export default DashBoard;
