import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeTaskAlertDialog } from '../store/modalSlice'
import { deleteTask } from '../store/boardsSlice'
import toast from 'react-hot-toast'

const TaskAlertDialog = ({ task, setOpenDeleteAlert, handleOptions }) => {
    const dispatch = useDispatch();
    const activeBoard = useSelector((state) => state.boards.activeBoard);

    const handleDelete = () => {
        dispatch(deleteTask({
            boardId: activeBoard,
            columnId: task.columnId,
            taskId: task.id
        }));
        setOpenDeleteAlert(false);
        handleOptions();
        toast.success('Task deleted successfully!');
    }

    // const handleBackdropClick = (e) => {
    //     if (e.target === e.currentTarget) {
    //         setOpenDeleteAlert(false);
    //     }
    // }

    const handleCancel = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setOpenDeleteAlert(false)
    }


    return (
        <div className='fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-[100]'
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    setOpenDeleteAlert(false)
                }
            }}>
            <div className='bg-white dark:bg-background-darkCard w-[500px] rounded-lg p-8 flex flex-col shadow-sm gap-6'
                onClick={e => e.stopPropagation()}>
                <h1 className='text-destructive text-xl font-bold'>Delete this task?</h1>
                <p className='text-text-secondary text-sm leading-6'>
                    Are you sure you want to delete '<span className='font-semibold'>{task.title}</span>' task and its subtasks?
                    This action cannot be reversed.
                </p>
                <div className='flex flex-row items-center justify-center w-full gap-5'>
                    <button
                        type='button'
                        className='bg-destructive text-white px-6 py-3 text-sm font-bold rounded-full hover:bg-destructive-hover w-full'
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                    <button
                        type='button'
                        className='text-text-secondary bg-background text-sm font-bold px-6 py-3 rounded-full hover:bg-gray-100 w-full'
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TaskAlertDialog;