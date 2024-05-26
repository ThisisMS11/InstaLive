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

const DialogBox = (({ buttonRef }: { buttonRef: React.RefObject<HTMLButtonElement> }) => (
    <Dialog>
        <DialogTrigger asChild>
            <Button variant="outline" ref={buttonRef} className='hidden'>Edit Profile</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Create Live Stream</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-center">Your Destinations</Label>
                    here will come my image
                    {/* <Image ></Image> */}
                    
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Title</Label>
                    <Input id="username" defaultValue="@peduarte" className="col-span-3" />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">Description</Label>
                    <Input id="username" defaultValue="@peduarte" className="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
));

export default DialogBox;
