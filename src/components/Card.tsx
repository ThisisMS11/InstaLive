import React from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const DashBoardCard = (({ buttonRef }: { buttonRef: React.RefObject<HTMLButtonElement> }) => (
    <Card className="w-[350px] flex p-4">
        <CardHeader className='p-2'>
            <CardTitle>Create your Live Stream</CardTitle>
            <CardDescription >You are just a click away</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">

            <Button onClick={() => // @ts-ignore
                buttonRef.current?.click()}>Create +</Button>
        </CardFooter>
    </Card>
));

export default DashBoardCard;
