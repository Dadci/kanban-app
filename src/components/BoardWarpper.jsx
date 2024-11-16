import React from 'react'
import Column from './Column'
import { useSelector, useDispatch } from 'react-redux'
import { openBoardDialog } from '../store/modalSlice'

const BoardWarpper = () => {

    const activeBoard = useSelector((state) => state.boards.activeBoard)
    const boards = useSelector((state) => state.boards.boards)

    const currentBoard = boards.find(board => board.id === activeBoard)

    const columns = currentBoard?.columns || []

    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(openBoardDialog())
    }

    const handleAddColumn = () => {

        dispatch(openBoardDialog({ type: 'addColumn', boardId: activeBoard }))
    }


    return (
        <>
            {boards.length === 0 ? <div className='flex flex-col items-center justify-center flex-1 gap-4'>
                <h1 className='text-text-secondary font-medium text-[15px]'>
                    There's no Board yet . Create a new one to get started.
                </h1>
                <button className='bg-primary text-sm font-semibold text-white px-6 py-3 rounded-full hover:bg-primary-hover' onClick={handleClick}>+ Create New Board</button>



            </div> : <div className='flex flex-row flex-1 p-6 space-x-6 '>

                {columns.map((column) => (

                    <Column key={column.id} column={column} />

                ))}

                <div className='flex flex-col items-center justify-center p-5 bg-primary-hover/10 w-[280px] rounded-lg cursor-pointer mt-10' onClick={handleAddColumn}>

                    <h1 className='text-text-secondary font-medium text-xl '>+ Add New Column</h1>


                </div>



            </div>}
        </>
    )
}

export default BoardWarpper