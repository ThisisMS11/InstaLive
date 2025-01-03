'use client';

import React, { useEffect, useRef, useState } from 'react';
import { VideoOff, CircleX, Copy } from 'lucide-react';
import {
    useAppSelector,
    useAppDispatch,
    emptyBroadcast,
    emptyLiveStream,
} from '@/imports/Redux_imports';
import { Image, useRouter } from '@/imports/Nextjs_imports';
import {
    BlockedUsers,
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
    Avatar,
    AvatarFallback,
    AvatarImage,
    Progress,
} from '@/imports/Shadcn_imports';
import { transitionToLive } from '@/services/youtube';
import { useOverlays } from '@/services/overlay';
import { useBroadcastStatus } from '@/services/broadcast';
import { toast } from 'sonner';
import { Loader } from '@/imports/Component_imports';
import { useStudio } from '@/app/context/StudioContext';
import { useSWRConfig } from 'swr';
import { getBlockedUserInfo } from '@/services/livechat';
import { deleteRedisData } from '@/services/redis';
import { motion } from 'framer-motion';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export function AlertDialogDemo({
    transitionToLive,
    stopStreaming,
}: {
    transitionToLive: (_status: string, _broadcastId: string) => void;
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
                    Stop Stream{' '}
                    <CircleX color="#ffffff" size="30" className="ml-4" />{' '}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will stop the
                        currently ongoing streaming and broadcast.
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

                                        /* call the api to clean the redis data */
                                        try {
                                            console.log(`Deleting redis data`);
                                            const response =
                                                await deleteRedisData();
                                            if (response.status == 200) {
                                                console.info(
                                                    `Data deletion from redis successfull`
                                                );
                                            } else {
                                                console.warn(
                                                    `Unexpected Status Code from redis deletion api.`
                                                );
                                            }
                                        } catch (error) {
                                            console.error(
                                                `Some error occured while deleting data from redis : `,
                                                error
                                            );
                                        }

                                        toast('Stream Completed', {
                                            description:
                                                'Stream has been successfully completed',
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

export default function StudioEntry({
    broadcast_socket,
    model_socket,
}: {
    broadcast_socket: any;
    model_socket: any;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const [weAreLive, setWeAreLive] = useState<boolean>(false);
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { displayName } = useStudio();
    const [overlayImage, setOverlayImage] = useState<string | undefined>(
        undefined
    );

    const [broadcastStatus, setBroadcastStatus] =
        useState<string>('Starting...');
    const [broadcastProgress, setBroadcastProgress] = useState<number>(0);
    const [showProgress, setShowProgress] = useState(true);

    const broadcastData = useAppSelector((state) => state.broadcasts);
    const { startWebCam, stopWebCam } = useStudio();

    // swr
    const { mutate } = useSWRConfig();

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
    }

    const stopStreaming = () => {
        if (localStream) {
            stopWebCam(localStream, videoRef);
        }
        setLocalStream(null);
        setWeAreLive(false);
    };

    const startStreaming = async () => {
        setWeAreLive(true);

        const media = await startWebCam(videoRef);

        if (overlayImage == undefined) {
            console.log('WithoutOverlay');
            broadcast_socket.current.emit('without-overlay');
        } else {
            console.log('WithOverlay');
            broadcast_socket.current.emit('with-overlay', overlayImage);
        }

        setTimeout(() => {
            if (media) setLocalStream(media);
        }, 2000);
    };

    /* Listening to Changing broadCast status */
    useEffect(() => {
        if (status) setBroadcastStatus(status);

        switch (status?.toLowerCase()) {
            case 'ready':
                setBroadcastProgress(10);
                break;
            case 'teststarting':
                setBroadcastProgress(30);
                break;
            case 'testing':
                setBroadcastProgress(60);
                break;

            case 'livestarting':
                setBroadcastProgress(80);
                break;

            case 'live':
                setBroadcastProgress(80);
                setTimeout(() => {
                    setBroadcastProgress(100);
                    setTimeout(() => {
                        setShowProgress(false);
                    }, 500);
                }, 500);
                break;

            default:
                break;
        }

        if (status === 'testing') {
            (async () => {
                await transitionToLive('live', broadcastData.id);
            })();
        }
        console.log({ status });

        if (status == 'complete') {
            toast('Stream Completed', {
                description: 'Stream has been successfully completed',
                duration: 5000,
            });

            const cleanRedisData = async () => {
                /* call the api to clean the redis data */
                try {
                    console.log(`Deleting redis data`);
                    const response = await deleteRedisData();
                    if (response.status == 200) {
                        console.info(`Data deletion from redis successfull`);
                    } else {
                        console.warn(
                            `Unexpected Status Code from redis deletion api.`
                        );
                    }
                } catch (error) {
                    console.error(
                        `Some error occured while deleting data from redis : `,
                        error
                    );
                }
            };

            dispatch(emptyLiveStream());
            dispatch(emptyBroadcast());
            cleanRedisData();

            router.push('/dashboard');
        }
    }, [status, broadcastStatusError, broadcastIsLoading]);

    /* If LocalStream is Available start sending to the server */
    useEffect(() => {
        if (localStream) {
            const mediaRecorder = new MediaRecorder(localStream, {
                mimeType: 'video/webm; codecs=h264,opus',
                audioBitsPerSecond: 128000,
                videoBitsPerSecond: 4500000,
                //@ts-ignore
                framerate: 30,
            });

            mediaRecorder.ondataavailable = (ev) => {
                broadcast_socket.current.emit('binarystream', {
                    stream: ev.data,
                    overlay: overlayImage,
                });
            };

            mediaRecorder.start(750);
        }
    }, [localStream]);

    /* Listening to Model Socket events */
    useEffect(() => {
        if (model_socket.current) {
            model_socket.current.on('block-user', async (data: any) => {
                console.log('User Block Event Listened with:', data);

                // Refetch the data to load the most updated data
                mutate('/api/v1/youtube/livechat/block-user');

                const { messageId } = data;

                console.log('messageId : ', messageId);

                try {
                    // Fetch blocked user information
                    console.log(`Calling useGetBlockedUserInfo ${messageId}`);
                    const userInfo = await getBlockedUserInfo(messageId);

                    console.log({ userInfo });

                    if (userInfo) {
                        // Display toast notification
                        console.log('calling the toast ');

                        toast(`${userInfo.channelName} Blocked`, {
                            description: userInfo.messageContent,
                            duration: 10000,
                            position: 'top-center',
                            className: 'flex gap-6 items-center',
                            icon: (
                                <Avatar className="my-auto mr-3 w-8 h-8">
                                    <AvatarImage src={userInfo.profileImage} />
                                    <AvatarFallback>N/A</AvatarFallback>
                                </Avatar>
                            ),
                        });
                    }
                } catch (error: any) {
                    console.error(
                        `Error fetching blocked user data: ${error?.message}`
                    );
                }
            });
        }

        // Cleanup the socket event listener on unmount
        return () => {
            if (model_socket.current) {
                model_socket.current.off('block-user');
            }
        };
    }, [model_socket]);

    /* Listening to Changing Requirements of Overlays */
    useEffect(() => {
        if (localStream && broadcast_socket.current) {
            stopStreaming();

            if (overlayImage == undefined) {
                console.log('WithoutOverlay');
                broadcast_socket.current.emit('without-overlay');
            } else {
                console.log('WithOverlay');
                broadcast_socket.current.emit('with-overlay', overlayImage);
            }

            /* Giving some time to Settle things up */
            setTimeout(() => {
                startStreaming();
            }, 2000);
        }
    }, [overlayImage]);

    /* If Anything is  Loading then let's wait for it */
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
                        <ResizablePanel defaultSize={50} className=" p-2">
                            <BlockedUsers />
                        </ResizablePanel>
                        <ResizableHandle />
                        <ResizablePanel defaultSize={50} className="mt-10 p-2">
                            <StatTable broadCastId={broadcastData.id} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={60}>
                    <div className="col-span-9 gap-4">
                        <CardContent className="p-8 items-center justify-center flex flex-col gap-2">
                            <div className="w-full flex flex-col items-center justify-center">
                                <p className="text-center text-2xl">
                                    {/* {broadcastData.liveChatId} */}
                                    {displayName}
                                </p>

                                <motion.p
                                    className="text-center text-xl text-gray-600"
                                    initial={{ scale: 1 }}
                                    animate={{ scale: showProgress ? 1 : 1.2 }} // Increase the scale when progress bar disappears
                                    transition={{ duration: 0.5 }}
                                >
                                    {broadcastStatus.toLowerCase() === 'live' &&
                                        !showProgress
                                        ? 'You are Live'
                                        : `${broadcastStatus}...` || 'nothing'}
                                </motion.p>

                                {showProgress && (
                                    <Progress
                                        className="w-5/6 mt-1"
                                        value={broadcastProgress}
                                        max={100}
                                    />
                                )}
                            </div>

                            <div className="relative w-[95%] h-[34rem] rounded-lg border bg-card text-card-foreground shadow-sm">
                                {weAreLive ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            className="w-full h-full object-cover"
                                            playsInline
                                            muted
                                        />
                                        {/* @ts-ignore  */}
                                        {overlayImage && (
                                            <Image
                                                src={overlayImage}
                                                className="absolute top-0 left-0 w-full h-full  z-10"
                                                alt="Overlay"
                                                width={400}
                                                height={400}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <div className="dark:bg-black w-full h-full flex items-center justify-center bg-gray-200 bg-opacity-50 backdrop-blur-md">
                                        <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-4 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                                            <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                                            <span
                                                className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl"
                                                onClick={startStreaming}
                                            >
                                                Go Live
                                            </span>
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="dark:bg-black mt-2 flex justify-center gap-10 border-2 bg-white py-2 px-4">
                                {/* <Button>
                                    {true ? <MonitorUp /> : <VideoOff />}
                                </Button> */}
                                <CopyToClipboard text={`https://www.youtube.com/watch?v=${broadcastData.id}`}>
                                    <Button>
                                        Copy URL
                                        <Copy className='ml-3' />
                                    </Button>
                                </CopyToClipboard>
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
                            <ChatBox liveChatId={broadcastData.liveChatId} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    );
}
