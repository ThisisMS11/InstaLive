import AxiosInstance from '@/utils/axios';
import { broadCastState } from '@/redux/slices/broadcastSlice';
import { liveStreamState } from '@/redux/slices/liveStreamSlice';

export const CreateLiveStream = async (formData: any) => {
    try {
        const response = await AxiosInstance.post(
            '/api/v1/youtube/broadcast',
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
            scheduledStartTime:
                data.broadCastResponse.snippet.scheduledStartTime,
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
                data.liveStreamResponse.cdn.ingestionInfo
                    .backupIngestionAddress,
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
    const url = `${process.env.NEXT_PUBLIC_URL}/api/v1/youtube/broadcast/status`;
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
