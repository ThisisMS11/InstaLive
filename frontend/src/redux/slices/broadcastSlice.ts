'use client';
import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

export interface broadCastState {
    id: string;
    title: string;
    description: string;
    channelId: string;
    liveChatId: string;
    privacyStatus: string;
    thumbnail: string;
    scheduledStartTime: string;
}

const initialState: broadCastState = {
    id: '',
    title: '',
    description: '',
    channelId: '',
    thumbnail: '',
    liveChatId: '',
    scheduledStartTime: '',
    privacyStatus: '',
};

const broadcastSlice = createSlice({
    name: 'broadcast',
    initialState,
    reducers: {
        setBroadcast(state, action: PayloadAction<broadCastState>) {
            const {
                id,
                title,
                description,
                channelId,
                liveChatId,
                privacyStatus,
                thumbnail,
                scheduledStartTime,
            } = action.payload;
            return {
                ...state,
                id,
                title,
                description,
                channelId,
                liveChatId,
                privacyStatus,
                thumbnail,
                scheduledStartTime,
            };
        },

        emptyBroadcast() {
            return initialState;
        },
    },
});
export const { setBroadcast, emptyBroadcast } = broadcastSlice.actions;
export default broadcastSlice.reducer;
