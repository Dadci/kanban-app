// src/features/boardsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const boardsSlice = createSlice({
    name: 'boards',
    initialState: {
        boards: [
            //     {
            //         id: '',
            //         name: "",
            //         columns: [
            //             {
            //                 id: '',
            //                 name: "",
            //                 tasks: [
            //                     {
            //                         id: '',
            //                         title: "",
            //                         description: "",
            //                         status: "",
            //                         subtasks: [
            //                             {
            //                                 id: '',
            //                                 title: "",
            //                                 isCompleted: false
            //                             },
            //                             {
            //                                 id: '',
            //                                 title: "",
            //                                 isCompleted: false
            //                             }
            //                         ]
            //                     }
            //                 ]
            //             }
            //         ]
            //     }
        ],
        activeBoard: null,
    },
    reducers: {
        addBoard: (state, action) => {
            state.boards.push({
                ...action.payload,
                columns: action.payload.columns.map(col => ({
                    id: uuidv4(),
                    name: col.name,
                    tasks: []
                }))
            })
            state.activeBoard = action.payload.id
        },
        editBoard: (state, action) => {
            const { id, name, columns } = action.payload;
            const boardIndex = state.boards.findIndex(b => b.id === id);
            if (boardIndex !== -1) {
                // Preserve existing tasks while updating columns
                const existingColumns = state.boards[boardIndex].columns;
                const updatedColumns = columns.map(col => {
                    const existingColumn = existingColumns.find(ec => ec.name === col.name);
                    return {
                        id: existingColumn ? existingColumn.id : uuidv4(),
                        name: col.name,
                        tasks: existingColumn ? existingColumn.tasks : []
                    };
                });

                state.boards[boardIndex] = {
                    ...state.boards[boardIndex],
                    name,
                    columns: updatedColumns
                };
            }
        },
        deleteBoard: (state, action) => {
            const boardId = action.payload;
            const boardIndex = state.boards.findIndex(b => b.id === boardId);
            if (boardIndex !== -1) {
                state.boards.splice(boardIndex, 1);
                // If deleted board was active, set next available board as active
                if (state.activeBoard === boardId) {
                    state.activeBoard = state.boards.length > 0 ? state.boards[0].id : null;
                }
            }
        },
        addColumn: (state, action) => {
            const board = state.boards.find(b => b.id === state.activeBoard)
            if (board) {
                board.columns.push({
                    id: uuidv4(),
                    name: action.payload.name,
                    tasks: []
                })
            }
        },
        addTask: (state, action) => {
            const { boardId, columnId, task } = action.payload
            const board = state.boards.find(b => b.id === boardId)
            const column = board?.columns.find(c => c.id === columnId)
            if (column) {
                column.tasks.push({
                    ...task,
                    id: uuidv4(),
                    status: column.name,
                    subtasks: task.subtasks.map(st => ({
                        id: uuidv4(),
                        title: st.title,
                        isCompleted: false
                    }))
                })
            }
        },
        toggleSubtask: (state, action) => {
            const { boardId, columnId, taskId, subtaskId } = action.payload
            const board = state.boards.find(b => b.id === boardId)
            const column = board?.columns.find(c => c.id === columnId)
            const task = column?.tasks.find(t => t.id === taskId)
            const subtask = task?.subtasks.find(st => st.id === subtaskId)
            if (subtask) {
                subtask.isCompleted = !subtask.isCompleted
            }
        },
        moveTask: (state, action) => {
            const { taskId, fromColumnId, toColumnId, boardId } = action.payload
            const board = state.boards.find(b => b.id === boardId)
            const fromColumn = board?.columns.find(c => c.id === fromColumnId)
            const toColumn = board?.columns.find(c => c.id === toColumnId)
            if (fromColumn && toColumn) {
                const taskIndex = fromColumn.tasks.findIndex(t => t.id === taskId)
                const task = fromColumn.tasks[taskIndex]
                fromColumn.tasks.splice(taskIndex, 1)
                toColumn.tasks.push({ ...task, status: toColumn.name })
            }
        },

        setActiveBoard: (state, action) => {
            state.activeBoard = action.payload
        },
    }
})

export const {
    addBoard,
    addColumn,
    addTask,
    toggleSubtask,
    moveTask,
    setActiveBoard,
    editBoard,
    deleteBoard
} = boardsSlice.actions

export default boardsSlice.reducer
