import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeTaskDialog, openTaskDialog, openViewTaskDialog } from '../store/modalSlice'
import TaskAlertDialog from './TaskAlertDialog'


import { createPortal } from 'react-dom'

const CardOptions = ({ handleOptions, task }) => {
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const dispatch = useDispatch();
    const boards = useSelector((state) => state.boards.boards);
    const activeBoard = useSelector((state) => state.boards.activeBoard);

    const currentBoard = boards.find(board => board.id === activeBoard);

    const handleView = () => {
        const columnId = currentBoard.columns.find(col =>
            col.tasks.some(t => t.id === task.id)
        )?.id;

        dispatch(openViewTaskDialog({
            ...task,
            columnId
        }));
        handleOptions();
    }

    const handleEdit = () => {
        dispatch(openTaskDialog({
            type: 'edit',
            task: task
        }));
        handleOptions();
    }

    const handleDelete = (e) => {
        e.stopPropagation();
        setOpenDeleteAlert(true);
        // handleOptions();
    }

    return (
        <>
            <div className='absolute translate-y-2 shadow-md translate-x-[116px] bg-white dark:bg-background-dark border border-lines dark:border-lines-dark  w-[120px] rounded-lg gap-2 z-[50] overflow-hidden' onClick={(e) => e.stopPropagation()}>
                <button type='button' className='text-text-secondary dark:text-white text-left px-4 py-2 border-b text-[12px] w-full hover:bg-gray-100 dark:border-lines-dark dark:hover:bg-background-darkCard' onClick={handleView}>
                    View Task
                </button>
                <button type='button' className='text-text-secondary dark:text-white text-left px-4 py-2 border-b text-[12px] w-full hover:bg-gray-100  dark:border-lines-dark dark:hover:bg-background-darkCard' onClick={handleEdit}>
                    Edit Task
                </button>
                <button type='button' className='text-destructive text-left text-[12px] px-4 py-2 hover:bg-gray-100 w-full  dark:border-lines-dark dark:hover:bg-background-darkCard' onClick={handleDelete}>
                    Delete Task
                </button>
            </div>

            {openDeleteAlert &&
                <TaskAlertDialog
                    task={task}
                    setOpenDeleteAlert={setOpenDeleteAlert}
                    handleOptions={handleOptions}
                />

            }
        </>
    );
}
export default CardOptions