'use client';

import {
  Button,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/imports/Shadcn_imports';
import { useSession } from 'next-auth/react';

export default function ChatBox() {
  const session = useSession();

  return (
    <div className="flex items-center bg-white rounded-lg shadow max-w-lg h-full w-[100%]  relative  ">
      <div className="flex items-center p-4 border-b absolute top-0 my-4 w-full">
        <Avatar>
          {/* @ts-ignore */}
          <AvatarImage src={session ? session?.data?.user.image : './placeholder-user.jpg'} />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          {/* @ts-ignore */}
          <div className="font-semibold">{session && session.data.user.name}</div>
        </div>
      </div>

      <div className="space-y-2 p-4 w-full">
        {/* user waala  */}
        <div className="flex items-end justify-start">
          <div className="p-3 bg-gray-100 rounded-lg">
            <p className="text-sm">Hi, how can I help you today?</p>
          </div>
        </div>
        {/* my message  */}
        <div className="flex items-end justify-end">
          <div className="p-3 bg-gray-300 rounded-lg">
            <p className="text-sm">
              Hey, I&apos;m having trouble with my account.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center p-4 border-t absolute  bottom-0 my-4 w-full">
        <Input placeholder="Type your message..." className="flex-1" />
        <Button variant="ghost" className="ml-2 p-2">
          <PaperclipIcon className="h-6 w-6 rotate-90" />
        </Button>
      </div>
    </div>
  );
}
// @ts-ignore
function PaperclipIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}

