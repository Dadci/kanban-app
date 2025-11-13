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
    const people = useSelector(state => state.people.people)
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

    // Helper function to get due date status
    const getDueDateStatus = (dueDate) => {
        if (!dueDate) return null;

        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0)
            return {
                text: "Overdue",
                class: "bg-red-100 text-red-700 border-red-200",
            };
        if (diffDays === 0)
            return {
                text: "Due Today",
                class: "bg-yellow-100 text-yellow-700 border-yellow-200",
            };
        if (diffDays === 1)
            return {
                text: "Due Tomorrow",
                class: "bg-orange-100 text-orange-700 border-orange-200",
            };
        if (diffDays <= 3)
            return {
                text: `Due in ${diffDays} days`,
                class: "bg-blue-100 text-blue-700 border-blue-200",
            };

        return {
            text: due.toLocaleDateString(),
            class: "bg-gray-100 text-gray-700 border-gray-200",
        };
    };

    const dueDateStatus = getDueDateStatus(currentTask?.dueDate);

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50 p-4">
            <div className="w-full max-w-[560px] max-h-[90vh] flex flex-col bg-white dark:bg-background-darkCard rounded-xl shadow-2xl">
                {/* Header */}
                <div className="flex flex-col p-6 pb-4 border-b border-lines dark:border-lines-dark">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <h1 className="text-text dark:text-white font-bold text-xl leading-tight flex-1">
                            {task.title}
                        </h1>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-background dark:hover:bg-background-dark rounded-lg transition-colors shrink-0"
                        >
                            <img
                                src={close_icon}
                                alt="close"
                                className="w-4 h-4"
                            />
                        </button>
                    </div>

                    {/* Badges */}
                    <div className='flex flex-wrap gap-2 items-center'>
                        {/* Priority Badge */}
                        {task.priority === 'high' && (
                            <span className='text-[11px] font-semibold px-2.5 py-1 bg-red-100 text-red-700 rounded-md'>
                                High
                            </span>
                        )}
                        {task.priority === 'medium' && (
                            <span className='text-[11px] font-semibold px-2.5 py-1 bg-orange-100 text-orange-700 rounded-md'>
                                Medium
                            </span>
                        )}
                        {task.priority === 'low' && (
                            <span className='text-[11px] font-semibold px-2.5 py-1 bg-green-100 text-green-700 rounded-md'>
                                Low
                            </span>
                        )}

                        {/* Due Date Badge */}
                        {dueDateStatus && (
                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${dueDateStatus.class}`}>
                                {dueDateStatus.text}
                            </span>
                        )}
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Description */}
                    {task.description && (
                        <div>
                            <h3 className="text-text-secondary dark:text-white text-[13px] font-semibold mb-2">
                                Description
                            </h3>
                            <p className="text-text dark:text-white text-[14px] leading-relaxed">
                                {task.description}
                            </p>
                        </div>
                    )}

                    {/* Assigned People */}
                    {currentTask?.assignees && currentTask.assignees.length > 0 && (
                        <div>
                            <h3 className="text-text-secondary dark:text-white text-[13px] font-semibold mb-3">
                                Assigned To
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentTask.assignees.map(assigneeId => {
                                    const person = people.find(p => p.id === assigneeId);
                                    if (!person) return null;
                                    return (
                                        <div
                                            key={person.id}
                                            className="flex items-center gap-2.5 bg-background dark:bg-background-dark px-3 py-2 rounded-lg border border-lines dark:border-lines-dark"
                                        >
                                            <div
                                                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm"
                                                style={{ backgroundColor: person.color }}
                                            >
                                                {person.initials}
                                            </div>
                                            <span className="text-text dark:text-white text-sm font-medium">
                                                {person.name}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Subtasks */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-text-secondary dark:text-white text-[13px] font-semibold">
                                Subtasks
                            </h3>
                            <span className="text-text-secondary text-[12px] font-medium">
                                {completedSubtasks} of {task.subtasks.length} completed
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-background dark:bg-background-dark rounded-full h-2 mb-3">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{
                                    width: `${(completedSubtasks / task.subtasks.length) * 100}%`,
                                }}
                            />
                        </div>

                        <div className="space-y-2">
                            {currentTask?.subtasks.map(subtask => (
                                <label
                                    key={subtask.id}
                                    className="flex items-center gap-3 p-3 bg-background dark:bg-background-dark/60 rounded-lg border border-lines dark:border-lines-dark hover:bg-background/80 dark:hover:bg-background-dark cursor-pointer transition-colors group"
                                >
                                    <input
                                        type="checkbox"
                                        checked={subtask.isCompleted}
                                        onChange={() => handleSubtaskToggle(subtask.id)}
                                        className="h-4 w-4 flex-shrink-0 rounded border-2 border-lines dark:border-lines-dark checked:bg-primary checked:border-primary cursor-pointer accent-primary"
                                    />
                                    <span className={`text-[14px] font-medium flex-1 ${subtask.isCompleted ? 'text-text-secondary line-through' : 'text-text dark:text-white'}`}>
                                        {subtask.title}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div>
                        <h3 className="text-text-secondary dark:text-white text-[13px] font-semibold mb-2">
                            Current Status
                        </h3>
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard w-full rounded-lg p-2.5 text-[14px] font-medium cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
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
        </div>
    )
}

export default ViewTaskDialog