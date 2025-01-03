import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { openBoardDialog, openAlertDialog, } from '../store/modalSlice'

const Options = ({ handleOptions }) => {
    const dispatch = useDispatch()
    const boards = useSelector((state) => state.boards.boards)
    const activeBoard = useSelector((state) => state.boards.activeBoard)

    const currentBoard = boards.find(board => board.id === activeBoard)

    const handleEdit = () => {
        dispatch(openBoardDialog({
            type: 'edit',
            board: currentBoard

        }))

        handleOptions()


    }

    const handleDelete = () => {
        dispatch(openAlertDialog())
    }

    return (
        <div className='absolute translate-y-20 shadow-md translate-x-4 bg-white dark:bg-background-darkCard border border-lines w-[180px] rounded-lg gap-4 z-50 overflow-hidden dark:border-lines-dark '>
            <button disabled={boards.length === 0} type='button' className='text-text-secondary text-left px-4 py-3 text-sm w-full hover:bg-gray-100 border-b border-b-lines  dark:border-lines-dark dark:hover:bg-background-dark dark:text-white' onClick={handleEdit} >Edit Board</button>

            <button disabled={boards.length === 0} type='button' className='text-destructive text-left text-sm px-4 py-3 hover:bg-gray-100 w-full  dark:border-lines-dark dark:hover:bg-background-dark' onClick={handleDelete}>Delete Board</button>

        </div>
    )
}

export default Options