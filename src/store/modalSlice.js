// src/features/modalSlice.js
import { createSlice } from '@reduxjs/toolkit'


const modalSlice = createSlice({
    name: 'modal',
    initialState:
    {
        isBoardDialogOpen: false
    },
    reducers: {
        openBoardDialog: (state) => {
            state.isBoardDialogOpen = true
        },
        closeBoardDialog: (state) => {
            state.isBoardDialogOpen = false
        }
    }
})

export const { openBoardDialog, closeBoardDialog } = modalSlice.actions
export default modalSlice.reducer