import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeAlertDialog } from '../store/modalSlice'
import { deleteBoard } from '../store/boardsSlice'
import toast from 'react-hot-toast'

const AlertDialog = () => {

    const dispatch = useDispatch()
    const activeBoard = useSelector((state) => state.boards.activeBoard)
    const boards = useSelector((state) => state.boards.boards)

    const currentBoard = boards.find(board => board.id === activeBoard)
    



    const handleDelete = () => {
        dispatch(deleteBoard(activeBoard))
        dispatch(closeAlertDialog())
        toast.success('Board deleted successfully!')

    }

    const handleCancel = () => {
        dispatch(closeAlertDialog())
    }



    return (
        <div className='fixed inset-0 flex items-center justify-center  bg-neutral-950/70 z-50'>

            <div className='bg-white w-[500px] rounded-lg p-8 flex flex-col shadow-sm gap-6 '>
                <h1 className='text-destructive text-xl font-bold'>Delete this board?</h1>
                <p className='text-text-secondary text-sm leading-6'>Are you sure you want to delete the <span className='font-semibold'> '{currentBoard?.name}' </span>  board ? This action will remove all columns and tasks and cannot be reversed.</p>
                <div className='flex flex-row items-center justify-center w-full gap-5'>
                    <button type='button' className='bg-destructive text-white px-6 py-3 text-sm font-bold rounded-full hover:bg-destructive-hover w-full' onClick={handleDelete}>Delete</button>
                    <button type='button' className='text-text-secondary bg-background text-sm font-bold px-6 py-3 rounded-full hover:bg-gray-100 w-full' onClick={handleCancel}>Cancel</button>
                </div>

            </div>

        </div>
    )
}

export default AlertDialog