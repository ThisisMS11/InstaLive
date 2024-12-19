import React, { useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
} from '@/imports/Shadcn_imports';
import {
  useGetBlockedUsersInfo,
  unBlockLiveChatUser,
} from '@/services/livechat';

// Types for the message object
interface BlockedUser {
  id: string;
  profileImage: string;
  channelName: string;
  messageContent: string;
  authorChannelId: string;
}

const BlockedUserItem: React.FC<{
  user: BlockedUser;
  onUnblock: any;
}> = ({ user, onUnblock }) => (
  <Accordion type="single" collapsible key={user.id} className="shadow">
    <AccordionItem value={user.id}>
      <div className="flex w-full items-center justify-between">
        <Avatar className="my-auto mr-3">
          <AvatarImage src={user.profileImage} />
          <AvatarFallback>N/A</AvatarFallback>
        </Avatar>
        <AccordionTrigger>{user.channelName}</AccordionTrigger>
        <Button
          className="bg-blue-600 text-white"
          onClick={() => onUnblock(user.id)}
        >
          Unblock
        </Button>
      </div>
      <AccordionContent className="p-2 text-gray-700">
        {user.messageContent}
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const BlockedUsers: React.FC = () => {
  const { messages, isLoading, isError } = useGetBlockedUsersInfo();

  const handleUnBlock = async (messageId: string) => {
    try {
      console.info('Attempting to unblock liveChatUser with id:', messageId);
      const response = await unBlockLiveChatUser(messageId);

      if (response?.authorChannelId) {
        console.info(
          'Successfully unblocked liveChatUser with id:',
          response.authorChannelId
        );
      } else {
        console.warn('Unexpected response while unblocking user:', response);
      }
    } catch (error) {
      console.error(
        `Error while unblocking message with id: ${messageId}`,
        error
      );
    }
  };

  const blockedUsers = useMemo(() => messages || [], [messages]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error(isError);
    return <div>Some Error Occurred</div>;
  }

  return (
    <div className="dark:bg-transparent bg-white p-3 rounded-lg shadow h-full">
      <div className="h-1/6 text-2xl font-bold">Blocked Users</div>
      <div className="h-5/6 p-2 overflow-y-scroll">
        {blockedUsers.length > 0 ? (
          blockedUsers.map((user: BlockedUser) => (
            <BlockedUserItem
              key={user.id}
              user={user}
              onUnblock={handleUnBlock}
            />
          ))
        ) : (
          <div>No blocked users to display</div>
        )}
      </div>
    </div>
  );
};

export default BlockedUsers;
