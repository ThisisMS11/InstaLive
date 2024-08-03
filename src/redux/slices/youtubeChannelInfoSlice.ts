'use client';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ChannelState {
    channelId: string;
    title: string;
    description: string;
    thumbnail: string;
    customUrl: string;
}

const initialState: ChannelState = {
    channelId: '',
    title: '',
    description: '',
    thumbnail: '',
    customUrl: '',
};

const youtubeChannelInfoSlice = createSlice({
    name: 'youtubeChannelInfo',
    initialState,
    reducers: {
        setYoutubeChannelInfo(state, action: PayloadAction<{
            channelId: string;
            title: string;
            description: string;
            thumbnail: string;
            customUrl: string;
        }>) {
            const {
                channelId,
                title,
                description,
                thumbnail,
                customUrl,
            } = action.payload;
            return {
                ...state,
                channelId,
                title,
                description,
                thumbnail,
                customUrl,
            };
        },

        emptyYoutubeChannelInfo() {
            return initialState;
        },
    },
});

export const { setYoutubeChannelInfo, emptyYoutubeChannelInfo } = youtubeChannelInfoSlice.actions;
export default youtubeChannelInfoSlice.reducer;
