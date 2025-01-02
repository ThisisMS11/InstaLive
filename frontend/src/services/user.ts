import AxiosFetcher from '@/utils/axiosFetcher';
import useSWR from 'swr';

export function useYoutubeChannelInfo() {
    console.info('Fetching User youtube Channel information ...');
    const { data, error, isLoading } = useSWR(
        '/api/v1/youtube/info',
        AxiosFetcher
    );

    return {
        channel: data?.data,
        isLoading,
        isError: error,
    };
}
