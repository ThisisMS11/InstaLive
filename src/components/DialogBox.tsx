import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AxiosInstance from '@/utils/axios';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setBroadcast, broadCastState } from '@/redux/slices/broadcastSlice';
import { setLiveStream, liveStreamState } from '@/redux/slices/liveStreamSlice';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';

const DialogBox = ({
  buttonRef,
  youtubeChannelInfo,
}: {
  buttonRef: React.RefObject<HTMLButtonElement>;
  youtubeChannelInfo: any;
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: '',
  });

  const router = useRouter();

  const dispatch = useAppDispatch();

  const tempdata = {
    broadCastResponse: {
      kind: 'youtube#liveBroadcast',
      etag: 'f4ffL_GpD7hIfOoEXv-YsKo1jxM',
      id: 'qM487UTe8lM',
      snippet: {
        publishedAt: '2024-05-27T12:17:29Z',
        channelId: 'UCpkVstDSqpHgLuWQQXQDtvg',
        title: 'Mohit Saini live stream try 1',
        description: 'live stream description',
        thumbnails: {
          default: {
            url: 'https://i9.ytimg.com/vi/qM487UTe8lM/default_live.jpg?sqp=CMTy0bIG&rs=AOn4CLBlk21UiyGUmRN8peIkUZMUN5Io8w',
            width: 120,
            height: 90,
          },
          medium: {
            url: 'https://i9.ytimg.com/vi/qM487UTe8lM/mqdefault_live.jpg?sqp=CMTy0bIG&rs=AOn4CLAaVXlMACVal1bfGd1e3hEKgKWyaA',
            width: 320,
            height: 180,
          },
          high: {
            url: 'https://i9.ytimg.com/vi/qM487UTe8lM/hqdefault_live.jpg?sqp=CMTy0bIG&rs=AOn4CLBOGHDJ140xs7k99UHxB4BdwjoW2Q',
            width: 480,
            height: 360,
          },
        },
        scheduledStartTime: '2024-05-27T12:17:28Z',
        isDefaultBroadcast: false,
        liveChatId: 'KicKGFVDcGtWc3REU3FwSGdMdVdRUVhRRHR2ZxILcU00ODdVVGU4bE0',
      },
      status: {
        lifeCycleStatus: 'created',
        privacyStatus: 'private',
        recordingStatus: 'notRecording',
        madeForKids: false,
        selfDeclaredMadeForKids: false,
      },
      contentDetails: {
        monitorStream: {
          enableMonitorStream: true,
          broadcastStreamDelayMs: 0,
          embedHtml:
            '<iframe width="425" height="344" src="https://www.youtube.com/embed/qM487UTe8lM?autoplay=1&livemonitor=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>',
        },
        enableEmbed: true,
        enableDvr: true,
        enableContentEncryption: false,
        recordFromStart: true,
        enableClosedCaptions: false,
        closedCaptionsType: 'closedCaptionsDisabled',
        enableLowLatency: false,
        latencyPreference: 'normal',
        projection: 'rectangular',
        enableAutoStart: true,
        enableAutoStop: true,
      },
    },
    liveStreamResponse: {
      kind: 'youtube#liveStream',
      etag: 'FlMFxXAhaEzpSKeKjSmUNHlGyrU',
      id: 'pkVstDSqpHgLuWQQXQDtvg1716812251530391',
      snippet: {
        publishedAt: '2024-05-27T12:17:31Z',
        channelId: 'UCpkVstDSqpHgLuWQQXQDtvg',
        title: 'Test Stream by Mohit',
        description: '',
        isDefaultStream: false,
      },
      cdn: {
        ingestionType: 'rtmp',
        ingestionInfo: {
          streamName: 'wfxy-2sk7-8hx0-u7j8-08kw',
          ingestionAddress: 'rtmp://a.rtmp.youtube.com/live2',
          backupIngestionAddress: 'rtmp://b.rtmp.youtube.com/live2?backup=1',
          rtmpsIngestionAddress: 'rtmps://a.rtmps.youtube.com/live2',
          rtmpsBackupIngestionAddress:
            'rtmps://b.rtmps.youtube.com/live2?backup=1',
        },
        resolution: '1080p',
        frameRate: '60fps',
      },
      status: {
        streamStatus: 'ready',
        healthStatus: {
          status: 'noData',
        },
      },
    },
  };

  useEffect(() => {
    if (youtubeChannelInfo) {
      console.log('YouTube channel info inside DialogBox:', {
        youtubeChannelInfo,
      });
      setFormData({
        title: youtubeChannelInfo.title || '',
        description: youtubeChannelInfo.description || '',
        privacy: '',
      });
    }
  }, [youtubeChannelInfo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePrivacyChange = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      privacy: value,
    }));
  };

  const handleLiveStream = async () => {
    /* this is the place where api call is to be made */

    try {
      const response = await AxiosInstance.post(
        '/api/youtube/broadcast',
        formData
      );
      const data = response.data;

      const broadCastInstance: broadCastState = {
        id: data.broadCastResponse.id,
        title: data.broadCastResponse.snippet.title,
        description: data.broadCastResponse.snippet.description,
        channelId: data.broadCastResponse.snippet.channelId,
        liveChatId: data.broadCastResponse.snippet.liveChatId,
        privacyStatus: data.broadCastResponse.status.privacyStatus,
        thumbnail: data.broadCastResponse.snippet.thumbnails.default.url,
        scheduledStartTime: data.broadCastResponse.snippet.scheduledStartTime,
      };

      const liveStreamInstance: liveStreamState = {
        id: data.liveStreamResponse.id,
        title: data.liveStreamResponse.snippet.title,
        channelId: data.liveStreamResponse.snippet.channelId,
        streamName: data.liveStreamResponse.cdn.ingestionInfo.streamName,
        resolution: data.liveStreamResponse.cdn.resolution,
        frameRate: data.liveStreamResponse.cdn.frameRate,
        ingestionAddress:
          data.liveStreamResponse.cdn.ingestionInfo.ingestionAddress,
        backupIngestionAddress:
          data.liveStreamResponse.cdn.ingestionInfo.backupIngestionAddress,
      };

      console.log({ liveStreamInstance, broadCastInstance });

      dispatch(setLiveStream(liveStreamInstance));
      dispatch(setBroadcast(broadCastInstance));

      router.push('/studio');
    } catch (error) {
      console.log('Error while creating liveStream  : ', error);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" ref={buttonRef} className="hidden">
          Edit Profile
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        {youtubeChannelInfo ? (
          <>
            <DialogHeader>
              <DialogTitle>Create Live Stream</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-center">Destinations</Label>
                <Image
                  src={youtubeChannelInfo.thumbnail}
                  alt="Image not found"
                  height={50}
                  width={50}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  className="col-span-3"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Input
                  id="description"
                  name="description"
                  className="col-span-3"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="privacy" className="text-right">
                  Privacy
                </Label>
                <Select onValueChange={handlePrivacyChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Choose Privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="w-full"
                onClick={handleLiveStream}
              >
                Create Live Stream
              </Button>
            </DialogFooter>
          </>
        ) : (
          <Loader className="animate-spin" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
