// src/features/modalSlice.js
import { createSlice } from '@reduxjs/toolkit'


const modalSlice = createSlice({
    name: 'modal',
    initialState:
    {
        isBoardDialogOpen: false,
        isTaskDialogOpen: false,

        isAlertDialogOpen: false,
        isTaskAlertDialogOpen: false,
        taskToDelete: null,

        dialogType: null, // 'create' or 'edit'
        boardData: null,

        taskDialogType: null, // 'create' or 'edit'
        taskData: null,
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
        },
        openTaskDialog: (state, action) => {
            state.isTaskDialogOpen = true
            state.taskDialogType = action.payload?.type || 'create'
            state.taskData = action.payload?.task || null
        },
        closeTaskDialog: (state) => {
            state.isTaskDialogOpen = false
            state.taskDialogType = null
            state.taskData = null
        },
        openTaskAlertDialog: (state, action) => {
            state.isTaskAlertDialogOpen = true
            state.taskToDelete = action.payload // Store task data for deletion
        },
        closeTaskAlertDialog: (state) => {
            state.isTaskAlertDialogOpen = false
            state.taskToDelete = null
        }
    }
})

export const { openBoardDialog, closeBoardDialog, openAlertDialog, closeAlertDialog, openTaskDialog, closeTaskDialog, openTaskAlertDialog, closeTaskAlertDialog } = modalSlice.actions
export default modalSlice.reducer
