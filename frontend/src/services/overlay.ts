import useSWR from 'swr';
import AxiosFetcher from '@/utils/axiosFetcher';
import axios from 'axios';

export const uploadCustomOverlay = async (overlayForm: any) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_URL}/api/v1/youtube/broadcast/overlay`,
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
    `/api/v1/youtube/broadcast/overlay`,
    AxiosFetcher,
    { errorRetryCount: 1, errorRetryInterval: 5000 }
  );

  return {
    overlays: data?.data,
    isLoading: isLoading as boolean,
    isError: error,
  };
};
