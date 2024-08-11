import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import { LiveChatMessage } from '@/app/types/livechat'
export const useGetLiveMessages = (livechatId: string) => {

    console.info('Fetching All Livechat Messages ...');

    const livechatId2  = 'Cg0KC1pJSzNOMkpsMkNJKicKGFVDZWYxLThlT3BKZ3VkN3N6VlBsWlFBURILWklLM04ySmwyQ0k'
    const { data, error, isLoading } = useSWR(
        `/api/youtube/livechat/${livechatId2}`,
        AxiosFetcher,
        {refreshInterval : 500}
    );

    return {
        messages: data?.data,
        isLoading: isLoading as boolean,
        isError: error,
    };
};

