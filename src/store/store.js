import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boardsSlice';
import modalReducer from './modalSlice';
import { loadState, saveState } from '../utils/localStorage';
import throttle from 'lodash/throttle';
import themeReducer from './themeSlice';


const persistedState = loadState();

const store = configureStore({
    reducer: {
        boards: boardsReducer,
        modal: modalReducer,
        theme: themeReducer

    },
    preloadedState: persistedState
});

store.subscribe(throttle(() => {
    saveState({
        boards: store.getState().boards,
        theme: store.getState().theme

    });
}, 1000));
export default store;
