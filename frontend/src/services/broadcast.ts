import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';

type useBroadcastStatusResult = {
  status: string | undefined;
  isLoading: boolean;
  isError: any;
};

type BroadcastStatusResponse = {
  data: string;
};

export const useBroadcastStatus = (
  broadcastId: string
): useBroadcastStatusResult => {
  const { data, error, isLoading } = useSWR<BroadcastStatusResponse>(
    `/api/v1/youtube/broadcast/status?broadcastId=${broadcastId}`,
    AxiosFetcher,
    {
      refreshInterval: 2000,
      errorRetryCount: 0,
      errorRetryInterval: 5000,
    }
  );
  return {
    status: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

/* To fetch all the previous livestream data to display on dashboard page */
export const useAllBroadcasts = () => {
  const { data, error, isLoading } = useSWR(
    `/api/v1/youtube/broadcast`,
    AxiosFetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryCount: 1,
      errorRetryInterval: 1000,
    }
  );

  return {
    broadcasts: data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

/* To get previous broadcast metrices information or liveStream information */
export const useBroadcastMetrics = (
  broadcastId: string,
  type: string,
  refreshIntervalinMs: number
) => {
  const { data, error, isLoading } = useSWR(
    `/api/v1/youtube/broadcast/stats?broadcastId=${broadcastId}&type=${type}`,
    AxiosFetcher,
    {
      refreshInterval: refreshIntervalinMs,
      errorRetryCount: 1,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};
