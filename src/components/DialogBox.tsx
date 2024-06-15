import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
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

  const handleLiveStream = () => {
    router.push('/studio');
    console.log({ formData });
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
