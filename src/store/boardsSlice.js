// src/features/boardsSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import { createStandardColumns, STANDARD_COLUMNS } from '../constants/columns'

const boardsSlice = createSlice({
    name: 'boards',
    initialState: {
        boards: [],
        activeBoard: null,
        viewMode: 'kanban', // 'kanban', 'timeline', or 'list'
    },
    reducers: {
        addBoard: (state, action) => {
            const newBoard = {
                ...action.payload,
                columns: createStandardColumns() // Use standard columns
            }
            state.boards.push(newBoard)
            state.activeBoard = action.payload.id
        },
        editBoard: (state, action) => {
            const { id, name } = action.payload; // Only accept id and name now
            const boardIndex = state.boards.findIndex(b => b.id === id);
            if (boardIndex !== -1) {
                // Only update the board name, keep existing columns and tasks
                state.boards[boardIndex].name = name;

                // Ensure board has standard columns (migration support)
                const existingColumns = state.boards[boardIndex].columns;
                const standardColumns = createStandardColumns();

                // Migrate existing tasks to standard columns
                const migratedColumns = standardColumns.map(stdCol => {
                    // Try to find existing column with same or similar name
                    const existingCol = existingColumns.find(ec =>
                        ec.name === stdCol.name ||
                        ec.name.toLowerCase().includes(stdCol.name.toLowerCase()) ||
                        stdCol.name.toLowerCase().includes(ec.name.toLowerCase())
                    );

                    return {
                        ...stdCol,
                        tasks: existingCol ? existingCol.tasks : []
                    };
                });

                // Handle any tasks from columns that don't match standard ones
                const unmatchedTasks = [];
                existingColumns.forEach(existingCol => {
                    const isMatched = standardColumns.some(stdCol =>
                        existingCol.name === stdCol.name ||
                        existingCol.name.toLowerCase().includes(stdCol.name.toLowerCase()) ||
                        stdCol.name.toLowerCase().includes(existingCol.name.toLowerCase())
                    );

                    if (!isMatched) {
                        unmatchedTasks.push(...existingCol.tasks);
                    }
                });

                // Put unmatched tasks in TO DO column
                if (unmatchedTasks.length > 0) {
                    const todoColumn = migratedColumns.find(col => col.name === "TO DO");
                    if (todoColumn) {
                        todoColumn.tasks.push(...unmatchedTasks);
                    }
                }

                state.boards[boardIndex].columns = migratedColumns;
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
        reorderTasks: (state, action) => {
            const { boardId, columnId, tasks } = action.payload;
            const board = state.boards.find(b => b.id === boardId);
            if (!board) return;

            const column = board.columns.find(c => c.id === columnId);
            if (!column) return;

            column.tasks = tasks;
        },
        setViewMode: (state, action) => {
            state.viewMode = action.payload; // 'kanban', 'timeline', or 'list'
        }
    }
})

export const {
    addBoard,
    addTask,
    editTask,
    deleteTask,
    toggleSubtask,
    setActiveBoard,
    editBoard,
    deleteBoard,
    reorderTasks,
    setViewMode
} = boardsSlice.actions

export default boardsSlice.reducer
