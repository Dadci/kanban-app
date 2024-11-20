import React, { useState } from 'react'
import Column from './Column'
import { useSelector, useDispatch } from 'react-redux'
import { openBoardDialog } from '../store/modalSlice'
import { DndContext, closestCenter, DragOverlay } from '@dnd-kit/core';




const BoardWarpper = () => {



    const activeBoard = useSelector((state) => state.boards.activeBoard)
    const boards = useSelector((state) => state.boards.boards)

    const currentBoard = boards.find(board => board.id === activeBoard)

    const columns = currentBoard?.columns || []

    const dispatch = useDispatch()

    const handleClick = () => {
        dispatch(openBoardDialog())
    }

    const handleEdit = () => {
        dispatch(openBoardDialog({
            type: 'edit',
            board: currentBoard
        }))
    }


    return (

        <>



            {boards.length === 0 ? <div className='flex flex-col items-center justify-center flex-1 gap-8'>
                <h1 className='text-text-secondary font-medium text-[15px]'>
                    There's no Board yet . Create a new one to get started.
                </h1>
                <button className='bg-primary text-sm font-semibold text-white px-6 py-4 rounded-full hover:bg-primary-hover' onClick={handleClick}>+ Create New Board</button>




            </div> :
                <div className='flex flex-row pb-6 flex-1 px-8 py-6 space-x overflow-auto flex-shrink-0 scroll-smooth '>

                    {columns.map((column) => (

                        <Column key={column.id} column={column} />

                    ))}

                    <div className='flex-shrink-0 flex flex-col items-center justify-center p-5 bg-[#E9EFFA] w-[280px] rounded-lg cursor-pointer ml-6 mt-11 mb' onClick={handleEdit}>

                        <h1 className='text-text-secondary font-medium text-xl '>+ Add New Column</h1>


                    </div>



                </div>}
        </>

    )
}

export default BoardWarpper