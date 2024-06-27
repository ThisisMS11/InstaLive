import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import AxiosInstance from '@/utils/axios';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { setBroadcast, broadCastState } from '@/redux/slices/broadcastSlice';
import { setLiveStream, liveStreamState } from '@/redux/slices/liveStreamSlice';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import axios from 'axios';

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
  }, []);

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

    console.log({ formData });

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

      <DialogContent className="sm:max-w-[500px]">
        {youtubeChannelInfo ? (
          <>
            <Card className="m-2">
              <CardHeader>
                <CardTitle>Create New Stream</CardTitle>
                <CardDescription>
                  Set up a new live stream with the details below.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-center">Destinations</Label>
                  <Image
                    src={youtubeChannelInfo.thumbnail}
                    alt="Image not found"
                    height={50}
                    width={50}
                    className="ml-4"
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter stream title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter stream description"
                    rows={3}
                    name="description"
                    value={formData.description}
                    // @ts-ignore
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="privacy">Privacy</Label>
                  <RadioGroup
                    className="flex"
                    value={formData.privacy}
                    onValueChange={handlePrivacyChange}
                    required
                  >
                    <RadioGroupItem id="public" value="public" />
                    <Label htmlFor="public">Public</Label>
                    <RadioGroupItem id="private" value="private" />
                    <Label htmlFor="private">Private</Label>
                  </RadioGroup>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleLiveStream}>Create Stream</Button>
              </CardFooter>
            </Card>
          </>
        ) : (
          <Loader className="animate-spin" />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogBox;
