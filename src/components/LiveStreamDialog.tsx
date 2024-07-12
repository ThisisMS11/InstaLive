import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  setBroadcast,
  setLiveStream,
  useAppDispatch,
} from '@/imports/Redux_imports';

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Textarea,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
} from '@/imports/Shadcn_imports';

import { Image, useRouter } from '@/imports/Nextjs_imports';
import { Loader } from 'lucide-react';
import { CreateLiveStream } from '@/services/youtube';

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
  const [loadingLiveStream, setLoadingLiveStream] = useState(false);
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
    console.log({ formData });
    try {
      setLoadingLiveStream(true);

      const { liveStreamInstance, broadCastInstance } =
        await CreateLiveStream(formData);

      dispatch(setLiveStream(liveStreamInstance));
      dispatch(setBroadcast(broadCastInstance));

      router.push('/studio');
      setLoadingLiveStream(false);
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
                {loadingLiveStream ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button onClick={handleLiveStream}>Create Stream</Button>
                )}
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
