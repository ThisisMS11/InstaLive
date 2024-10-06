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
    // {
    //   refreshInterval: 2000,
    // },
    { errorRetryCount: 0, errorRetryInterval: 5000 }
  );
  return {
    status: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

export const useAllBroadcasts = () => {
  console.info('Fetching All Past Broadcast info ...');
  const { data, error, isLoading } = useSWR(
    `/api/v1/youtube/broadcast`,
    AxiosFetcher
  );

  return {
    broadcasts: data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

/* to get the total number of views till present */
export const useBroadcastMetrics = (
  broadcastId: string,
  type: string,
  refreshIntervalinMs: number
) => {
  const { data, error, isLoading } = useSWR(
    `/api/v1/youtube/broadcast/stats?broadcastId=${broadcastId}&type=${type}`,
    AxiosFetcher,
    // {
    //   refreshInterval: refreshIntervalinMs,
    // }
    { errorRetryCount: 1, errorRetryInterval: 5000 }
  );

  return {
    data: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};
