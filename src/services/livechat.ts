import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import { LiveChatMessage } from '@/app/types/livechat'

export const useGetLiveMessages = (livechatId: string) => {
    console.info('Fetching All Livechat Messages ...');
    const { data, error, isLoading } = useSWR(
        `/api/youtube/livechat/Cg0KC2ZQSWY5bXJsdkZnKicKGFVDZWYxLThlT3BKZ3VkN3N6VlBsWlFBURILZlBJZjltcmx2Rmc`,
        AxiosFetcher,
        {refreshInterval : 500}
    );

    return {
        messages: data?.data,
        isLoading: isLoading as boolean,
        isError: error,
    };
};

