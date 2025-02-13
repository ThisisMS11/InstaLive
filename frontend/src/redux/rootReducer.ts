import { combineReducers } from 'redux';
import storage from 'redux-persist/lib/storage';
import broadcastReducer from './slices/broadcastSlice';
import livestreamReducer from './slices/liveStreamSlice';
import youtubeChannelInfoReducer from './slices/youtubeChannelInfoSlice';

const rootPersistConfig = {
    key: 'root',
    storage,
    keyPrefix: 'redux-',
};

const rootReducer = combineReducers({
    livestreams: livestreamReducer,
    broadcasts: broadcastReducer,
    youtubeChannelInfo: youtubeChannelInfoReducer,
});

export { rootPersistConfig, rootReducer };
