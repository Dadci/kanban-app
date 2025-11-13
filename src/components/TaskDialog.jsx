// src/components/TaskDialog.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, editTask } from '../store/boardsSlice'
import { closeTaskDialog } from '../store/modalSlice'
import { v4 as uuidv4 } from 'uuid'
import close_icon from '../assets/icon-cross.svg'
import toast from 'react-hot-toast'
import AssigneeDropdown from './AssigneeDropdown'

const TaskDialog = () => {
    const dispatch = useDispatch()
    const activeBoard = useSelector(state => state.boards.activeBoard)
    const boards = useSelector(state => state.boards.boards)
    const currentBoard = boards.find(board => board.id === activeBoard)
    const { taskDialogType, taskData } = useSelector(state => state.modal)

    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [status, setStatus] = useState(currentBoard?.columns[0]?.name || '')
    const [priority, setPriority] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [assignees, setAssignees] = useState([])
    const [subtasks, setSubtasks] = useState([
        { id: uuidv4(), title: '' }
    ])



    const [error, setError] = useState('')


    useEffect(() => {
        if (taskDialogType === 'edit' && taskData) {
            setTitle(taskData.title)
            setDescription(taskData.description)
            setStatus(taskData.status)
            setPriority(taskData.priority)
            setDueDate(taskData.dueDate || '')
            setAssignees(taskData.assignees || [])
            setSubtasks(taskData.subtasks)
        } else {
            // Reset assignees for create mode
            setAssignees([])
        }
    }, [taskDialogType, taskData])







    const handleClose = () => {
        dispatch(closeTaskDialog())
    }

    const handleAddSubtask = (e) => {
        e.preventDefault()
        setSubtasks([...subtasks, { id: uuidv4(), title: '' }])
    }

    const handleRemoveSubtask = (subtaskId) => (e) => {
        e.preventDefault()
        if (subtasks.length === 1) {
            setError('Task must have at least one subtask!')
            return
        }
        setSubtasks(subtasks.filter(st => st.id !== subtaskId))
    }

    const handleSubtaskChange = (id, value) => {
        setSubtasks(subtasks.map(st =>
            st.id === id ? { ...st, title: value } : st
        ))
    }

    const handlePriorityChange = (e) => {
        setPriority(e.target.value)
    }

    const handleToggleAssignee = (personId) => {
        setAssignees(prev => {
            if (prev.includes(personId)) {
                return prev.filter(id => id !== personId)
            } else {
                return [...prev, personId]
            }
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!title.trim()) {
            setError('Title is required!');
            return;
        }

        if (subtasks.some(st => !st.title.trim())) {
            setError('All subtasks must have titles!');
            return;
        }

        // Find the target column based on status
        const targetColumn = currentBoard.columns.find(col => col.name === status);

        if (!targetColumn) {
            setError('Invalid column status!');
            return;
        }

        if (taskDialogType === 'edit') {
            const oldColumn = currentBoard.columns.find(col =>
                col.tasks.some(t => t.id === taskData?.id)
            );

            dispatch(editTask({
                boardId: activeBoard,
                oldColumnId: oldColumn?.id,
                newColumnId: targetColumn.id,
                taskId: taskData.id,
                task: {
                    title,
                    description,
                    priority,
                    status,
                    dueDate,
                    assignees,
                    subtasks
                }
            }));
            toast.success('Task saved successfully!');
        } else {
            dispatch(addTask({
                boardId: activeBoard,
                columnId: targetColumn.id, // Use targetColumn instead of undefined column
                task: {
                    title,
                    description,
                    priority,
                    status,
                    dueDate,
                    assignees,
                    subtasks,
                    creationDate: new Date().toISOString()
                }
            }));
            toast.success('Task added successfully!');
        }
        dispatch(closeTaskDialog());
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50 p-4">
            <div className="w-full max-w-[480px] max-h-[90vh] flex flex-col bg-white dark:bg-background-darkCard rounded-lg shadow-sm">
                <div className="flex flex-row items-center justify-between w-full p-8 pb-4">
                    <h1 className="text-text dark:text-white font-bold text-lg">{taskDialogType === 'edit' ? 'Edit Task' : 'Add New Task'}</h1>
                    <img
                        src={close_icon}
                        alt="close"
                        className="cursor-pointer hover:opacity-70 transition-opacity"
                        onClick={handleClose}
                    />
                </div>

                {error && (
                    <p className="text-destructive text-sm font-medium px-8 mb-2">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col px-8 pb-8 overflow-y-auto">
                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm rounded-lg p-2.5 mb-4"
                        placeholder="e.g. Take coffee break"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm rounded-lg p-2.5 mb-4 min-h-[80px] resize-none"
                        placeholder="e.g. It's always good to take a break..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Due Date (Optional)
                    </label>
                    <input
                        type="date"
                        className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard text-sm rounded-lg p-2.5 mb-4"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Assign To (Optional)
                    </label>
                    <div className="mb-6">
                        <AssigneeDropdown 
                            assignees={assignees} 
                            onToggleAssignee={handleToggleAssignee} 
                        />
                    </div>

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Subtasks
                    </label>
                    <div className='space-y-3 mb-4'>
                        {subtasks.map(subtask => (
                            <div key={subtask.id} className="flex flex-row items-center gap-3">
                                <input
                                    type="text"
                                    className="border placeholder:text-sm text-sm dark:border-lines-dark dark:text-white dark:bg-background-darkCard border-lines rounded-lg p-2.5 flex-1"
                                    placeholder="e.g. Make coffee"
                                    value={subtask.title}
                                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleRemoveSubtask(subtask.id)}
                                    className="p-2 hover:bg-background dark:hover:bg-background-dark rounded-lg transition-colors"
                                >
                                    <img
                                        src={close_icon}
                                        alt="remove"
                                        className="w-4 h-4"
                                    />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="text-primary mb-4 font-semibold text-sm px-4 py-2.5 bg-primary/25 dark:bg-background rounded-full hover:bg-primary/30 dark:hover:bg-background-dark transition-colors"
                        onClick={handleAddSubtask}
                    >
                        + Add New Subtask
                    </button>

                    <div className='flex gap-4 w-full flex-nowrap mb-4'>

                        <div className='flex flex-col w-1/2  '>

                            <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm lowercase rounded-lg p-2.5"
                            >
                                {currentBoard?.columns.map(column => (
                                    <option key={column.id} value={column.name}>
                                        {column.name}
                                    </option>
                                ))}
                            </select>

                        </div>

                        <div className='flex flex-col w-1/2'>

                            <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                                Priority
                            </label>
                            <select
                                value={priority}
                                onChange={handlePriorityChange}
                                className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm lowercase rounded-lg p-2.5"
                            >
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>

                        </div>


                    </div>


                    <button
                        type="submit"
                        className="bg-primary text-sm font-semibold text-white px-4 py-2.5 rounded-full hover:bg-primary-hover transition-colors"
                    >
                        {taskDialogType === 'edit' ? 'Save Changes' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TaskDialog