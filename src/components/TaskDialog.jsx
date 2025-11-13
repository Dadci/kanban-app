// src/components/TaskDialog.jsx
import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addTask, editTask } from '../store/boardsSlice'
import { closeTaskDialog } from '../store/modalSlice'
import { v4 as uuidv4 } from 'uuid'
import close_icon from '../assets/icon-cross.svg'
import toast from 'react-hot-toast'

const TaskDialog = () => {
    const dispatch = useDispatch()
    const activeBoard = useSelector(state => state.boards.activeBoard)
    const boards = useSelector(state => state.boards.boards)
    const currentBoard = boards.find(board => board.id === activeBoard)
    const { taskDialogType, taskData } = useSelector(state => state.modal)
    const people = useSelector(state => state.people.people)

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
                    creationDate: new Date().toLocaleDateString('eu-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                    })
                }
            }));
            toast.success('Task added successfully!');
        }
        dispatch(closeTaskDialog());
    };
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50">
            <div className="w-[480px] flex flex-col p-8 bg-white dark:bg-background-darkCard rounded-lg shadow-sm">
                <div className="flex flex-row items-center justify-between w-full">
                    <h1 className="text-text dark:text-white font-bold text-lg">{taskDialogType === 'edit' ? 'Edit Task' : 'Add New Task'}</h1>
                    <img
                        src={close_icon}
                        alt="close"
                        className="cursor-pointer"
                        onClick={handleClose}
                    />
                </div>

                {error && (
                    <p className="text-destructive text-sm font-medium mt-2 mb-4">{error}</p>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col mt-6 w-full overflow-y-auto">
                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm rounded-lg p-3 mb-6"
                        placeholder="e.g. Take coffee break"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Description
                    </label>
                    <textarea
                        className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm rounded-lg p-3 mb-6 min-h-[112px]"
                        placeholder="e.g. It's always good to take a break..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Due Date (Optional)
                    </label>
                    <input
                        type="date"
                        className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard text-sm rounded-lg p-3 mb-6"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />

                    <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                        Assign To (Optional)
                    </label>
                    <div className="border border-lines dark:border-lines-dark rounded-lg p-3 mb-6 max-h-[150px] overflow-y-auto">
                        {people.length === 0 ? (
                            <p className="text-text-secondary text-xs">No team members available. Add people first!</p>
                        ) : (
                            <div className="space-y-2">
                                {people.map(person => (
                                    <label
                                        key={person.id}
                                        className="flex items-center gap-3 cursor-pointer hover:bg-background dark:hover:bg-background-dark p-2 rounded-lg"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={assignees.includes(person.id)}
                                            onChange={() => handleToggleAssignee(person.id)}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                                            style={{ backgroundColor: person.color }}
                                        >
                                            {person.initials}
                                        </div>
                                        <div className="flex flex-col flex-1 min-w-0">
                                            <span className="text-text dark:text-white text-sm font-medium truncate">
                                                {person.name}
                                            </span>
                                            {person.role && (
                                                <span className="text-text-secondary text-xs truncate">
                                                    {person.role}
                                                </span>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='overflow-y-auto max-h-[25vh]'>


                        <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                            Subtasks
                        </label>
                        {subtasks.map(subtask => (
                            <div key={subtask.id} className="flex flex-row items-center gap-4 overflow-y-auto">
                                <input
                                    type="text"
                                    className="border mb-4 placeholder:text-sm text-sm dark:border-lines-dark dark:text-white dark:bg-background-darkCard border-lines rounded-lg p-3 flex-1"
                                    placeholder="e.g. Make coffee"
                                    value={subtask.title}
                                    onChange={(e) => handleSubtaskChange(subtask.id, e.target.value)}
                                />
                                <img
                                    src={close_icon}
                                    alt="remove"
                                    className="cursor-pointer mb-4"
                                    onClick={handleRemoveSubtask(subtask.id)}
                                />
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        className="text-primary mb-6 font-semibold text-sm px-4 py-3 bg-primary/25 dark:bg-background rounded-full"
                        onClick={handleAddSubtask}
                    >
                        + Add New Subtask
                    </button>

                    <div className='flex gap-4 w-full flex-nowrap mb-6'>

                        <div className='flex flex-col w-1/2  '>

                            <label className="text-text-secondary dark:text-white text-[12px] font-medium mb-2">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm lowercase rounded-lg p-3 "

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
                                className="border border-lines dark:border-lines-dark dark:text-white dark:bg-background-darkCard placeholder:text-sm text-sm lowercase rounded-lg p-3  "

                            >
                                <option value='low'>Low</option>
                                <option value='medium'>Medium</option>
                                <option value='high'>High</option>
                            </select>

                        </div>


                    </div>


                    <button
                        type="submit"
                        className="bg-primary text-sm font-semibold text-white px-4 py-3 rounded-full hover:bg-primary-hover"
                    >
                        {taskDialogType === 'edit' ? 'Save Changes' : 'Create Task'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default TaskDialog