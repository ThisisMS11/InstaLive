'use client';
import {
  Button,
  Input,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Skeleton,
} from '@/imports/Shadcn_imports';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import {
  useGetLiveChatMessages,
  postLivechatMessage,
} from '@/services/livechat';
import { useAppSelector } from '@/imports/Redux_imports';
import { SendHorizontal } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ScrollToBottom from 'react-scroll-to-bottom';
import { useAutoAnimate } from '@formkit/auto-animate/react';

export default function ChatBox({ liveChatId }: { liveChatId: string }) {
  const session = useSession();
  const [parent] = useAutoAnimate();
  const [message, setMessage] = useState<string>('');
  const youtubeChannelInfo = useAppSelector(
    (state) => state.youtubeChannelInfo
  );
  // const liveChatMessages = data.data;
  // const [liveChatMessages, setLiveChatMessages] = useState<any>(data.data);

  const {
    messages: liveChatMessages,
    isError,
    isLoading,
    mutate,
  } = useGetLiveChatMessages(liveChatId);

  // console.log({ liveChatMessages, isError, isLoading });

  if (isError) {
    console.error(
      'Error while fetching livechat messages for livechatid : ',
      liveChatId,
      'with error : ',
      isError
    );
  }

  if (isLoading) {
    return (
      <div className="dark:bg-black flex items-center bg-white rounded-lg shadow max-w-lg h-full w-[100%]  relative  ">
        <div className="dark:bg-black flex items-center p-4 absolute top-0 my-4 w-full z-10 bg-white border-b">
          <Skeleton className="rounded-full w-8 h-8" />
          <div>
            <Skeleton className="w-28 h-8 ml-4" />
          </div>
        </div>

        <div className=" w-full flex gap-3 flex-col px-4">
          <div className="flex justify-start my-2">
            <Skeleton className="w-[60%] h-8 " />
          </div>
          <div className="flex justify-end my-2">
            <Skeleton className="w-[60%] h-8 " />
          </div>
          <div className="flex justify-start my-2">
            <Skeleton className="w-[60%] h-8 " />
          </div>
          <div className="flex justify-end my-2">
            <Skeleton className="w-[60%] h-8 " />
          </div>
          <div className="flex justify-start my-2">
            <Skeleton className="w-[60%] h-8 " />
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e: any) => {
    e.preventDefault();

    const newMessage = {
      id: uuidv4(), // Generate a unique ID
      snippet: {
        displayMessage: message,
      },
      authorDetails: {
        channelId: youtubeChannelInfo?.channelId,
        // @ts-ignore
        profileImageUrl: session?.data?.user.image,
      },
    };

    // setLiveChatMessages((prev : any) => [...prev, newMessage])

    /* calling the actual api */
    await postLivechatMessage(liveChatId, message);

    mutate(
      liveChatMessages ? [...liveChatMessages, newMessage] : [newMessage],
      {
        revalidate: false,
      }
    );
    setMessage('');
  };

  return (
    <div className="dark:bg-transparent flex items-center bg-white rounded-lg shadow max-w-lg h-full w-[100%]  relative  ">
      <div className="flex items-center p-4 border-b absolute top-0 my-4 w-full z-10">
        <Avatar>
          <AvatarImage
            // @ts-ignore
            src={session ? session?.data?.user.image : './placeholder-user.jpg'}
          />
          <AvatarFallback>MS</AvatarFallback>
        </Avatar>
        <div className="ml-3">
          {/* @ts-ignore */}
          <div className="font-semibold">
            {session && session?.data?.user?.name}
          </div>
        </div>
      </div>

      <div
        className="space-y-2 p-2 w-full h-[65%] overlflow-x-hidden "
        ref={parent}
      >
        {/* user waala  */}
        <ScrollToBottom
          mode="bottom"
          initialScrollBehavior="auto"
          className="h-[22rem] overflow-x-hidden"
        >
          {liveChatMessages &&
            liveChatMessages.map((message: any) => {
              // am i the author
              const isAuthor =
                message.authorDetails.channelId ===
                youtubeChannelInfo?.channelId;

              const class1 = isAuthor
                ? `flex items-end justify-end mt-2`
                : `flex items-end justify-start mt-2`;
              const class2 = isAuthor
                ? `p-3 bg-gray-300 rounded-lg flex items-center gap-2`
                : `p-3 bg-gray-100 rounded-lg flex items-center gap-2`;

              return (
                <div className={class1} key={message.id}>
                  <div className={class2}>
                    <Avatar className="w-8 h-8">
                      {/* @ts-ignore */}
                      <AvatarImage
                        src={
                          message
                            ? message.authorDetails.profileImageUrl
                            : './placeholder-user.jpg'
                        }
                      />
                      <AvatarFallback>MS</AvatarFallback>
                    </Avatar>
                    <p className="text-sm">{message.snippet.displayMessage}</p>
                  </div>
                </div>
              );
            })}
        </ScrollToBottom>
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex items-center p-4 border-t absolute  bottom-0  w-full "
      >
        <Input
          placeholder="Type your message..."
          className="flex-1"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Button variant="ghost" className="ml-2 p-2" type="submit">
          <SendHorizontal className="h-6 w-6" />
        </Button>
      </form>
    </div>
  );
}
