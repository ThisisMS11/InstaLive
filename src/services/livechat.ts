import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import AxiosInstance from '@/utils/axios';
export const useGetLiveChatMessages = (liveChatId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/youtube/livechat?liveChatId=${liveChatId}`,
    AxiosFetcher,
    {
      // errorRetryCount: 0,
      // errorRetryInterval: 5000,
      refreshInterval: 10000,
      dedupingInterval: 4000,
    }
  );

  return {
    messages: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
    mutate,
  };
};

export const postLivechatMessage = async (
  liveChatId: string,
  message: string
) => {
  console.info('Posting a livechat Message at ', liveChatId);
  try {
    const response = await AxiosInstance.post(
      `/api/v1/youtube/livechat?liveChatId=${liveChatId}`,
      {
        message,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error while posting livechatMessage : ', error);
    throw error;
  }
};

/* Get the blocked users information */
export const useGetBlockedUsersInfo = () => {
  console.info('Fetching Blocked Users Information');

  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/youtube/livechat/block-user`,
    AxiosFetcher,
    {
      errorRetryCount: 2,
      errorRetryInterval: 3000,
      refreshInterval: 5000,
      dedupingInterval: 2000,
    }
  );

  return {
    messages: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
    mutate,
  };
};

/* Get the information for a single blocked user*/
export const getBlockedUserInfo = async (messageId: string) => {
  try {
    const response = await AxiosFetcher(
      `/api/v1/youtube/livechat/block-user?messageId=${messageId}`
    );

    return response.data;
  } catch (error: any) {
    console.error(`Error fetching blocked user information: ${error?.message}`);
    return null;
  }
};

/* Unblock a banned user in livechat */ 
export const unBlockLiveChatUser = async (
  messageId: string,
) => {
  try {
    const response = await AxiosInstance.put(
      `/api/v1/youtube/livechat/block-user`,
      {
        messageId
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
