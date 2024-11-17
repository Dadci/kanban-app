import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeTaskDialog, openTaskDialog } from '../store/modalSlice'
import TaskAlertDialog from './TaskAlertDialog'

const Options = ({ handleOptions, task }) => {
    const [openDeleteAlert, setOpenDeleteAlert] = useState(false)
    const dispatch = useDispatch()
    const boards = useSelector((state) => state.boards.boards)
    const activeBoard = useSelector((state) => state.boards.activeBoard)

    const currentBoard = boards.find(board => board.id === activeBoard)

    const handleEdit = () => {
        dispatch(openTaskDialog({
            type: 'edit',
            task: task

        }))

        handleOptions()

    }
    const handleDelete = () => {
        setOpenDeleteAlert(true)
        // handleOptions()
    }

    return (
        <>

            <div className='absolute translate-y-2 shadow-md translate-x-[116px] bg-white border border-lines w-[120px] rounded-lg gap-2 z-50 overflow-hidden '>
                <button type='button' className='text-text-secondary text-left px-4 py-2 border-b text-[12px] w-full hover:bg-gray-100'  >View Task</button>

                <button type='button' className='text-text-secondary text-left px-4 py-2 border-b text-[12px] w-full hover:bg-gray-100' onClick={handleEdit} >Edit Task</button>

                <button type='button' className='text-destructive text-left text-[12px] px-4 py-2 hover:bg-gray-100 w-full' onClick={handleDelete}>Delete Task</button>


            </div>

            {openDeleteAlert && <TaskAlertDialog task={task} setOpenDeleteAlert={setOpenDeleteAlert} />}
        </>
    )
}

export default Options