import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import axios from 'axios'
import { Loader } from 'lucide-react';

const DashBoardCard = (({ buttonRef, setYoutubeChannelInfo }: { buttonRef: React.RefObject<HTMLButtonElement>, setYoutubeChannelInfo: (channel: any) => void }) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        console.log(process.env.NEXT_PUBLIC_URL)
        try {

            setIsLoading(true);

            const response = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/youtube/info`);
            const data = response.data.data;

            console.log({ data });

            // Transform the response data to match the YouTube type
            const youtubeChannelInfo = {
                channelId: data.id,
                title: data.snippet.title,
                description: data.snippet.description,
                customUrl: data.snippet.customUrl,
                thumbnail: data.snippet.thumbnails.medium.url,
            };

            // Update the state with the YouTube channel info
            setYoutubeChannelInfo(youtubeChannelInfo);

            setIsLoading(false);
            // Simulate button click if needed
            buttonRef.current?.click();
        } catch (error) {
            console.log("Error while fetching user YouTube channel information at Card.tsx", error);
        }
    };

    return <>
        {
            isLoading ? <div className='flex h-[100vh] fixed top-0 w-full bg-white opacity-60 items-center justify-center gap-2'>
                <Loader className='animate-spin' />
                <span className='text-sm font-semibold '>Hang Tight ! Live Streaming is Loading ...</span>
            </div > : 
            (<Card className="w-[350px] flex p-4">
                <CardHeader className='p-2'>
                    <CardTitle>Create your Live Stream</CardTitle>
                    <CardDescription >You are just a click away</CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between">
                    <Button onClick={handleClick}>Create +</Button>
                </CardFooter>
            </Card>)
        }
    </>

});

export default DashBoardCard;
