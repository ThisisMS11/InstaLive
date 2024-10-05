import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import AxiosInstance from '@/utils/axios';
export const useGetLiveMessages = (liveChatId: string) => {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/v1/youtube/livechat?liveChatId=${liveChatId}`,
    AxiosFetcher,
    {
      // errorRetryCount: 0,
      // errorRetryInterval: 5000,
      refreshInterval: 5000,
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

  // const liveChatId2 = 'Cg0KC1pJSzNOMkpsMkNJKicKGFVDZWYxLThlT3BKZ3VkN3N6VlBsWlFBURILWklLM04ySmwyQ0k'
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
