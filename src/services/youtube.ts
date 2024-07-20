import AxiosInstance from '@/utils/axios';
import { broadCastState } from '@/redux/slices/broadcastSlice';
import { liveStreamState } from '@/redux/slices/liveStreamSlice';
import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import axios from 'axios';

export const CreateLiveStream = async (formData: any) => {
  try {
    const response = await AxiosInstance.post(
      '/api/youtube/broadcast',
      formData
    );

    const data = response.data.data;

    const broadCastInstance: broadCastState = {
      id: data.broadCastResponse.id,
      title: data.broadCastResponse.snippet.title,
      description: data.broadCastResponse.snippet.description,
      channelId: data.broadCastResponse.snippet.channelId,
      liveChatId: data.broadCastResponse.snippet.liveChatId,
      privacyStatus: data.broadCastResponse.status.privacyStatus,
      thumbnail: data.broadCastResponse.snippet.thumbnails.default.url,
      scheduledStartTime: data.broadCastResponse.snippet.scheduledStartTime,
    };

    const liveStreamInstance: liveStreamState = {
      id: data.liveStreamResponse.id,
      title: data.liveStreamResponse.snippet.title,
      channelId: data.liveStreamResponse.snippet.channelId,
      streamName: data.liveStreamResponse.cdn.ingestionInfo.streamName,
      resolution: data.liveStreamResponse.cdn.resolution,
      frameRate: data.liveStreamResponse.cdn.frameRate,
      ingestionAddress:
        data.liveStreamResponse.cdn.ingestionInfo.ingestionAddress,
      backupIngestionAddress:
        data.liveStreamResponse.cdn.ingestionInfo.backupIngestionAddress,
    };

    return { liveStreamInstance, broadCastInstance };
  } catch (error) {
    console.log('Some Error Occured while liveStreaming');
    throw error;
  }
};

export const transitionToLive: any = async (
  status: string,
  broadcastId: string
) => {
  const url = `${process.env.NEXT_PUBLIC_URL}/api/youtube/broadcast/status`;
  try {
    const response = await AxiosInstance.put(url, {
      youtubeBroadcastId: broadcastId,
      status: status,
    });

    const data = response.data.data;
    return data;
  } catch (error) {
    console.error(
      'Some error occurred while updating broadcast status to live.',
      error
    );
  }
};

type useBroadcastStatusResult = {
  status: string | undefined;
  isLoading: boolean;
  isError: any;
};

type BroadcastStatusResponse = {
  data: {
    broadCastStatus: string;
  };
};

export const useBroadcastStatus = (
  broadcastId: string
): useBroadcastStatusResult => {
  const { data, error, isLoading } = useSWR<BroadcastStatusResponse>(
    `/api/youtube/broadcast/status?broadcastId=${broadcastId}`,
    AxiosFetcher,
    {
      refreshInterval: 2000,
    }
  );

  return {
    status: data?.data?.broadCastStatus,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

export const useAllBroadcasts = () => {
  console.info('Fetching All Past Broadcast info ...');
  const { data, error, isLoading } = useSWR(
    `/api/youtube/broadcast`,
    AxiosFetcher
  );

  return {
    broadcasts: data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

/* to get the total number of views till present */
export const useBroadcastMetrics = (broadcastId: string) => {
  const { data, error, isLoading } = useSWR(
    `/api/youtube/broadcast/stats?broadcastId=${broadcastId}&type=metrics`,
    AxiosFetcher,
    {
      refreshInterval: 30000,
    }
  );

  return {
    data: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};

export const uploadCustomOverlay = async (overlayForm: any) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/youtube/broadcast/overlay`,
    overlayForm,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
};

export const useOverlays = () => {
  const { data, error, isLoading } = useSWR(
    `/api/youtube/broadcast/overlay`,
    AxiosFetcher
  );

  return {
    overlays: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};
