export interface LiveChatMessageAuthor {
  id: string;
  channelUrl: string;
  displayName: string;
  profileImageUrl: string;
  liveChatMessages: LiveChatMessage[];
}

export interface LiveChatMessage {
  id: string;
  type: string;
  liveChatId: string;
  publishedAt: Date;
  messageText: string;
  authorChannelId: string;
  author: LiveChatMessageAuthor;
}
