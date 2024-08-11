import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import AxiosInstance from '@/utils/axios';
import { LiveChatMessage } from '@/app/types/livechat'
export const useGetLiveMessages = (livechatId: string) => {

    console.info('Fetching All Livechat Messages ...');
    // const livechatId2 = 'Cg0KC1pJSzNOMkpsMkNJKicKGFVDZWYxLThlT3BKZ3VkN3N6VlBsWlFBURILWklLM04ySmwyQ0k'

    const { data, error, isLoading, mutate } = useSWR(
        `/api/youtube/livechat/${livechatId}`,
        AxiosFetcher,
        { refreshInterval: 1000 }
    );

    return {
        messages: data?.data,
        isLoading: isLoading as boolean,
        isError: error,
        mutate
    };
};

export const postLivechatMessage = async (livechatId: string, message: string) => {
    console.info('Posting a livechat Message at ', livechatId);

    // const livechatId2 = 'Cg0KC1pJSzNOMkpsMkNJKicKGFVDZWYxLThlT3BKZ3VkN3N6VlBsWlFBURILWklLM04ySmwyQ0k'
    try {
        const response = await AxiosInstance.post(`/api/youtube/livechat/${livechatId}`, {
            message
        })
        return response.data;
    } catch (error) {
        console.error("Error while posting livechatMessage : ",error);
        throw error;
    }
}

