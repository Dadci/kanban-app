// src/features/modalSlice.js
import { createSlice } from '@reduxjs/toolkit'


const modalSlice = createSlice({
    name: 'modal',
    initialState:
    {
        isBoardDialogOpen: false,
        isAlertDialogOpen: false,
        dialogType: null, // 'create' or 'edit'
        boardData: null,
    },
    reducers: {
        openBoardDialog: (state, action) => {
            state.isBoardDialogOpen = true
            state.dialogType = action.payload?.type || 'create'
            state.boardData = action.payload?.board || null
        },
        closeBoardDialog: (state) => {
            state.isBoardDialogOpen = false
            state.dialogType = null
            state.boardData = null
        },
        openAlertDialog: (state) => {
            state.isAlertDialogOpen = true
        },
        closeAlertDialog: (state) => {
            state.isAlertDialogOpen = false
        }
    }
})

export const { openBoardDialog, closeBoardDialog, openAlertDialog, closeAlertDialog } = modalSlice.actions
export default modalSlice.reducer