// src/components/ViewTaskDialog.jsx
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSubtask, editTask } from '../store/boardsSlice'
import close_icon from '../assets/icon-cross.svg'
import { closeViewTaskDialog } from '../store/modalSlice'
import toast from 'react-hot-toast'

const ViewTaskDialog = ({ task }) => {
    const dispatch = useDispatch()
    const activeBoard = useSelector(state => state.boards.activeBoard)
    const boards = useSelector(state => state.boards.boards)
    const currentTask = useSelector(state => {
        const board = state.boards.boards.find(b => b.id === activeBoard);
        const column = board?.columns.find(col =>
            col.tasks.some(t => t.id === task.id)
        );
        return column?.tasks.find(t => t.id === task.id);
    });
    const currentBoard = boards.find(board => board.id === activeBoard)

    const completedSubtasks = currentTask?.subtasks.filter(st => st.isCompleted).length || 0;

    const handleSubtaskToggle = (subtaskId) => {
        const currentColumn = currentBoard.columns.find(col =>
            col.tasks.some(t => t.id === task.id)
        );

        if (!currentColumn) return;

        dispatch(toggleSubtask({
            boardId: activeBoard,
            columnId: currentColumn.id, // Use current column id instead of task.columnId
            taskId: task.id,
            subtaskId
        }));
    };

    const handleStatusChange = (newStatus) => {
        const oldColumn = currentBoard.columns.find(col => col.id === task.columnId)
        const newColumn = currentBoard.columns.find(col => col.name === newStatus)

        dispatch(editTask({
            boardId: activeBoard,
            oldColumnId: oldColumn.id,
            newColumnId: newColumn.id,
            taskId: task.id,
            task: {
                ...task,
                status: newStatus
            },

        }))
        dispatch(closeViewTaskDialog())
        toast.success('Task status moved successfully to ' + newStatus)
    }

    const onClose = () => {
        dispatch(closeViewTaskDialog())
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50">
            <div className="w-[480px] flex flex-col p-8 bg-white dark:bg-background-darkCard rounded-lg shadow-sm overflow-y-auto">
                <div className="flex flex-row items-start justify-between w-full mb-[2px]">
                    <h1 className="text-text dark:text-white font-bold leading-7 text-lg">{task.title}</h1>
                    <img
                        src={close_icon}
                        alt="close"
                        className="cursor-pointer"
                        onClick={onClose}
                    />
                </div>

                <div className='mb-6 flex flex-wrap gap-2 items-center'>
                    {task.priority === 'low' ? <span className='text-[10px] text-center font-semibold px-3 py-[2px] bg-green-100 text-green-700 rounded-md'>Low</span> : task.priority === 'medium' ? <span className='text-[10px] text-center font-semibold px-3 py-[2px] bg-orange-100 text-orange-700 rounded-md'>Medium</span> : <span className='text-[10px] text-center font-semibold px-3 py-[2px] bg-red-100 text-red-700 rounded-md'>High</span>}

                    {task.dueDate && (
                        <span className='text-[10px] font-semibold px-3 py-[2px] bg-blue-100 text-blue-700 rounded-md border border-blue-200'>
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                    )}
                </div>

                <p className="text-text-secondary dark:text-white text-[14px] mb-6 leading-6">{task.description}</p>

                <div className="mb-6 shrink-0 overflow-y max-h-[60vh]">
                    <p className="text-text-secondary dark:text-white text-[12px] font-medium mb-3">
                        Subtasks ({completedSubtasks} of {task.subtasks.length})
                    </p>
                    {currentTask?.subtasks.map(subtask => (
                        <label
                            key={subtask.id}
                            className="flex items-center  gap-4 p-4 mb-2 bg-background dark:border-lines-dark dark:text-white dark:bg-background-dark/60 rounded hover:bg-primary/50 dark:hover:bg-background-dark cursor-pointer"
                        >

                            <input
                                type="checkbox"
                                checked={subtask.isCompleted}
                                onChange={() => handleSubtaskToggle(subtask.id)}
                                className="h-5 w-5 flex-shrink-0 rounded border border-lines checked:bg-primary checked:border-transparent relative"
                            />

                            <span className={`text-[13px] font-medium ${subtask.isCompleted ? 'text-text-secondary  line-through' : 'text-text dark:text-white'}`}>
                                {subtask.title}
                            </span>
                        </label>
                    ))}
                </div>

                <div>
                    <p className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">Current Status</p>
                    <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className="border border-lines  dark:border-lines-dark dark:text-white dark:bg-background-darkCard w-full rounded-lg p-3 text-[13px]"
                    >
                        {currentBoard?.columns.map(column => (
                            <option key={column.id} value={column.name}>
                                {column.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default ViewTaskDialog