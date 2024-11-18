// src/features/boardsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

const boardsSlice = createSlice({
    name: 'boards',
    initialState: {
        boards: [],
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
            const { boardId, columnId, task } = action.payload;

            // Find the board first
            const board = state.boards.find(b => b.id === boardId);
            if (!board) return;

            // Find the column using columnId
            const column = board.columns.find(c => c.id === columnId);
            if (!column) return;

            // Add the task with all required properties
            const newTask = {
                ...task,
                id: uuidv4(),
                status: column.name,
                subtasks: task.subtasks.map(st => ({
                    id: uuidv4(),
                    title: st.title,
                    isCompleted: false
                }))
            };

            column.tasks.push(newTask);
        },
        // In boardsSlice.js, update the editTask reducer:
        editTask: (state, action) => {
            const { boardId, oldColumnId, newColumnId, taskId, task } = action.payload
            const board = state.boards.find(b => b.id === boardId)

            // If status changed, move task to new column
            if (oldColumnId !== newColumnId) {
                // Remove from old column
                const oldColumn = board?.columns.find(c => c.id === oldColumnId)
                const taskToMove = oldColumn?.tasks.find(t => t.id === taskId)
                if (oldColumn && taskToMove) {
                    oldColumn.tasks = oldColumn.tasks.filter(t => t.id !== taskId)
                }

                // Add to new column
                const newColumn = board?.columns.find(c => c.id === newColumnId)
                if (newColumn && taskToMove) {
                    newColumn.tasks.push({
                        ...taskToMove,
                        ...task,
                        status: newColumn.name,
                        subtasks: task.subtasks.map(st => ({
                            id: st.id || uuidv4(),
                            title: st.title,
                            isCompleted: st.isCompleted || false
                        }))
                    })
                }
            } else {
                // Update task in same column
                const column = board?.columns.find(c => c.id === newColumnId)
                if (column) {
                    const taskIndex = column.tasks.findIndex(t => t.id === taskId)
                    if (taskIndex !== -1) {
                        column.tasks[taskIndex] = {
                            ...column.tasks[taskIndex],
                            ...task,
                            subtasks: task.subtasks.map(st => ({
                                id: st.id || uuidv4(),
                                title: st.title,
                                isCompleted: st.isCompleted || false
                            }))
                        }
                    }
                }
            }
        },

        deleteTask: (state, action) => {
            const { boardId, columnId, taskId } = action.payload
            const board = state.boards.find(b => b.id === boardId)
            const column = board?.columns.find(c => c.id === columnId)
            if (column) {
                const taskIndex = column.tasks.findIndex(t => t.id === taskId)
                if (taskIndex !== -1) {
                    column.tasks.splice(taskIndex, 1)
                }
            }
        },
        toggleSubtask: (state, action) => {
            const { boardId, columnId, taskId, subtaskId } = action.payload;
            const board = state.boards.find(b => b.id === boardId);
            if (!board) return;

            const column = board.columns.find(c => c.id === columnId);
            if (!column) return;

            const task = column.tasks.find(t => t.id === taskId);
            if (!task) return;

            const subtask = task.subtasks.find(st => st.id === subtaskId);
            if (!subtask) return;

            subtask.isCompleted = !subtask.isCompleted;
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
    editTask,
    deleteTask,
    toggleSubtask,
    setActiveBoard,
    editBoard,
    deleteBoard
} = boardsSlice.actions

export default boardsSlice.reducer
