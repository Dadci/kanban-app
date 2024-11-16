import { configureStore } from '@reduxjs/toolkit';
import boardsReducer from './boardsSlice'; 
import modalReducer from './modalSlice';

const store = configureStore({
    reducer: {
        boards: boardsReducer,
        modal: modalReducer

    }
});

export default store;
