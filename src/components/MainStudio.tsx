'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VideoOff, MonitorUp, CircleX } from 'lucide-react';
import {
  useAppSelector,
  useAppDispatch,
  emptyBroadcast,
  emptyLiveStream,
} from '@/imports/Redux_imports';
import { useRouter } from '@/imports/Nextjs_imports';
import {
  Graph,
  StatTable,
  OverlayAccordion,
  ChatBox,
} from '@/imports/Component_imports';
import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  CardContent,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/imports/Shadcn_imports';
import {
  transitionToLive,
  useBroadcastStatus,
  useOverlays,
} from '@/services/youtube';
import { toast } from 'sonner';
import { Loader } from '@/imports/Component_imports';
import { ShieldAlert } from 'lucide-react';

export function AlertDialogDemo({
  transitionToLive,
  stopStreaming,
}: {
  transitionToLive: (_status: string, _broadCastId: string) => void;
  stopStreaming: () => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const broadcastData = useAppSelector((state) => state.broadcasts);
  return (
    <AlertDialog
      onOpenChange={(e) => {
        console.log(e);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button>
          Stop Stream <CircleX color="#ffffff" size="30" className="ml-4" />{' '}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will stop the currently ongoing
            streaming and broadcast.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <form
              onSubmit={async (event) => {
                event.preventDefault();

                try {
                  const response = await transitionToLive(
                    'complete',
                    broadcastData.id
                  );
                  //@ts-ignore
                  if (response.status == 200) {
                    stopStreaming();
                    dispatch(emptyLiveStream());
                    dispatch(emptyBroadcast());

                    toast('Stream Completed', {
                      description: 'Stream has been successfully completed',
                      duration: 5000,
                    });

                    router.push('/dashboard');
                  }
                } catch (error) {
                  console.log(
                    'faced some issue while completing the stream at line81 in Mainstudio.tsx'
                  );
                  throw error;
                }
              }}
            >
              {/** some inputs */}
              <Button type="submit">Stop</Button>
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function StudioEntry({ socket }: { socket: any }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [weAreLive, setWeAreLive] = useState<boolean>(false);
  const router = useRouter();

  // const { overlayImage, setOverlayImage } = useStudio();
  const [overlayImage, setOverlayImage] = useState<string>('');

  const broadcastData = useAppSelector((state) => state.broadcasts);

  const {
    status,
    isError: broadcastStatusError,
    isLoading: broadcastIsLoading,
  } = useBroadcastStatus(broadcastData.id);
  const {
    overlays,
    isError: overlaysError,
    isLoading: overlaysIsLoading,
  } = useOverlays();

  if (overlaysError) {
    console.log('Error Overlays fetching : ', overlays);
    toast('Error', {
      description: 'Error fetching overlays',
      duration: 3000,
      icon: <ShieldAlert color="#ba2c2c" />,
    });
  }

  const stopStreaming = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      // Clear the video source object
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
    setMediaStream(null);
    setWeAreLive(false);
  };

  const handleStreaming = async () => {
    setWeAreLive(true);

    const media = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    if (overlayImage === '') {
      console.log('WithoutOverlay');
      socket.current.emit('without-overlay');
    } else {
      console.log('WithOverlay');
      socket.current.emit('with-overlay', overlayImage);
    }

    setTimeout(() => {
      setMediaStream(media);
      // @ts-ignore
      videoRef.current.srcObject = media;
    }, 2000);

    // transitionToLive('live');
  };

  useEffect(() => {
    // console.log('broadcast status ');
    // console.log({ status, broadcastStatusError, broadcastIsLoading });

    if (status === 'testing') {
      (async () => {
        await transitionToLive('live', broadcastData.id);
      })();
    }

    if (status == 'complete') {
      toast('Stream Completed', {
        description: 'Stream has been successfully completed',
        duration: 5000,
      });
      router.push('/dashboard');
    }
  }, [status, broadcastStatusError, broadcastIsLoading]);

  useEffect(() => {
    if (mediaStream) {
      const mediaRecorder = new MediaRecorder(mediaStream, {
        mimeType: 'video/webm; codecs=vp9,opus',
        audioBitsPerSecond: 128000,
        videoBitsPerSecond: 2500000,
        //@ts-ignore
        framerate: 25,
      });

      mediaRecorder.ondataavailable = (ev) => {
        socket.current.emit('binarystream', {
          stream: ev.data,
          overlay: overlayImage,
        });
      };

      mediaRecorder.start(500);
    }
  }, [mediaStream]);

  useEffect(() => {
    if (mediaStream && socket.current) {
      stopStreaming();

      if (overlayImage === '') {
        console.log('WithoutOverlay');
        socket.current.emit('without-overlay');
      } else {
        console.log('WithOverlay');
        socket.current.emit('with-overlay', overlayImage);
      }

      /* Giving some time to Settle things up */
      setTimeout(() => {
        handleStreaming();
      }, 2000);
    }
  }, [overlayImage]);

  if (overlaysIsLoading) {
    return <Loader message="Getting Ready for LiveStreaming 😁 .." />;
  }

  return (
    <>
      <ResizablePanelGroup
        direction="horizontal"
        className="rounded-lg border z-10"
      >
        <ResizablePanel defaultSize={20}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50} className="mt-10 p-2">
              <Graph />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} className="mt-10 p-2">
              <StatTable />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel defaultSize={60}>
          <div className="col-span-9 gap-4">
            <CardContent className="p-10 items-center justify-center flex flex-col gap-2">
              <div>
                <p className="text-center text-2xl">Main Display</p>
              </div>

              <div className="w-[95%] h-[34rem] rounded-lg border bg-card text-card-foreground shadow-sm">
                {weAreLive ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    className="w-full h-full object-cover"
                    playsInline
                    muted
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50 backdrop-blur-md">
                    <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-4 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                      <span
                        className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
                        onClick={handleStreaming}
                      >
                        Go Live
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-2 flex justify-center gap-10 border-2 bg-white py-2 px-4">
                <Button>{true ? <MonitorUp /> : <VideoOff />}</Button>
                <Button>
                  {true ? (
                    <AlertDialogDemo
                      transitionToLive={transitionToLive}
                      stopStreaming={stopStreaming}
                    />
                  ) : (
                    <VideoOff />
                  )}
                </Button>
              </div>
            </CardContent>
          </div>
        </ResizablePanel>
        <ResizableHandle />

        <ResizablePanel defaultSize={20}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={50}>
              <OverlayAccordion
                setOverlayImage={setOverlayImage}
                overlays={overlays}
              />
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
