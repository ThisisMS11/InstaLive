import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { Loader } from 'lucide-react'

const DialogBox = (({ buttonRef, youtubeChannelInfo }: { buttonRef: React.RefObject<HTMLButtonElement>, youtubeChannelInfo: any }) => {

    if (youtubeChannelInfo) {
        console.log('youtube channel info inside dialogbox : ', { youtubeChannelInfo })
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" ref={buttonRef} className='hidden'>Edit Profile</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                {youtubeChannelInfo ?
                    <>
                        <DialogHeader>
                            <DialogTitle>Create Live Stream</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label className="text-center">Destinations</Label>

                                <Image src={youtubeChannelInfo.thumbnail} alt="Image not found" height={50} width={50} />

                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Title </Label>
                                <Input className="col-span-3" readOnly value={youtubeChannelInfo.title} />
                            </div>

                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">Description</Label>
                                <Input className="col-span-3" readOnly value={youtubeChannelInfo.description} />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </>
                    : <Loader className='animate-spin' />}
            </DialogContent>
        </Dialog>
    )
});

export default DialogBox;
