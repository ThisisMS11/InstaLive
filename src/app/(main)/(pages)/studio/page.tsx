'use client';
import React, { useState } from 'react'
import StudioEntry from '@/components/StudioEntry'
import MainStudio from '@/components/MainStudio'
import { StudioProvider } from '@/app/context/StudioContext';

const Studio = () => {
    const [gotoStudio, setGotoStudio] = useState<boolean>(false);

    return (
        /* Get the Configuration before moving on to the main studio like audio check ,video check and display name */
        <StudioProvider>


            {/* {!gotoStudio ? <div className='flex items-center justify-center p-10'> <StudioEntry setGotoStudio={setGotoStudio} /> </div> : <MainStudio />} */}

            <MainStudio />

        </StudioProvider>

    )
}

export default Studio