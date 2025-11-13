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

        isViewTaskDialogOpen: false,
        viewTaskData: null,

        dialogType: null, // 'create' or 'edit'
        boardData: null,

        taskDialogType: null, // 'create' or 'edit'
        taskData: null,

        isPeopleDialogOpen: false,
        peopleDialogType: null, // 'create' or 'edit'
        personData: null,

        isPeopleListOpen: false,
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
        },
        openViewTaskDialog: (state, action) => {
            state.isViewTaskDialogOpen = true
            state.viewTaskData = action.payload
        },
        closeViewTaskDialog: (state) => {
            state.isViewTaskDialogOpen = false
            state.viewTaskData = null
        },
        openPeopleDialog: (state, action) => {
            state.isPeopleDialogOpen = true
            state.peopleDialogType = action.payload?.type || 'create'
            state.personData = action.payload?.person || null
        },
        closePeopleDialog: (state) => {
            state.isPeopleDialogOpen = false
            state.peopleDialogType = null
            state.personData = null
        },
        openPeopleList: (state) => {
            state.isPeopleListOpen = true
        },
        closePeopleList: (state) => {
            state.isPeopleListOpen = false
        }
    }
})

export const {
    openBoardDialog,
    closeBoardDialog,
    openAlertDialog,
    closeAlertDialog,
    openTaskDialog,
    closeTaskDialog,
    openTaskAlertDialog,
    closeTaskAlertDialog,
    openViewTaskDialog,
    closeViewTaskDialog,
    openPeopleDialog,
    closePeopleDialog,
    openPeopleList,
    closePeopleList
} = modalSlice.actions
export default modalSlice.reducer
