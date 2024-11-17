import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boardsSlice';
import modalReducer from './modalSlice';
import { loadState, saveState } from '../utils/localStorage';
import throttle from 'lodash/throttle';


const persistedState = loadState();

const store = configureStore({
    reducer: {
        boards: boardsReducer,
        modal: modalReducer

    },
    preloadedState: persistedState
});

store.subscribe(throttle(() => {
    saveState({
        boards: store.getState().boards
        
    });
}, 1000));
export default store;
