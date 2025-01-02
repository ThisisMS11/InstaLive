'use client';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

export interface liveStreamState {
    id: string;
    title: string;
    channelId: string;
    streamName: string;
    resolution: string;
    frameRate: string;
    ingestionAddress: string;
    backupIngestionAddress: string;
}

const initialState: liveStreamState = {
    id: '',
    title: '',
    channelId: '',
    streamName: '',
    resolution: '',
    frameRate: '',
    ingestionAddress: '',
    backupIngestionAddress: '',
};

const liveStreamSlice = createSlice({
    name: 'livestream',
    initialState,
    reducers: {
        setLiveStream(state, action: PayloadAction<liveStreamState>) {
            const {
                id,
                backupIngestionAddress,
                title,
                channelId,
                streamName,
                resolution,
                frameRate,
                ingestionAddress,
            } = action.payload;
            return {
                ...state,
                id,
                backupIngestionAddress,
                title,
                channelId,
                streamName,
                resolution,
                frameRate,
                ingestionAddress,
            };
        },

        emptyLiveStream() {
            return initialState;
        },
    },
});

export const { setLiveStream, emptyLiveStream } = liveStreamSlice.actions;
export default liveStreamSlice.reducer;
