
import AxiosFetcher from "@/utils/axiosFetcher";
import useSWR from "swr";

export function getYoutubeChannelInfo() {
    const { data, error, isLoading } = useSWR('/api/youtube/info', AxiosFetcher);
    console.log({data,error,isLoading});
    
    return {
        channel: data?.data,
        isLoading,
        isError: error
    }
}

