import React from 'react'
import TaskCard from './TaskCard'
import { useSelector } from 'react-redux'
import { useDroppable } from '@dnd-kit/core';




const TasksWarpper = ({ columnId }) => {

    const { setNodeRef, isOver } = useDroppable({
        id: columnId
    });



    const boards = useSelector(state => state.boards.boards)
    const activeBoard = useSelector(state => state.boards.activeBoard)
    const currentBoard = boards.find(board => board.id === activeBoard)

    const column = currentBoard?.columns.find(col => col.id === columnId)
    const tasks = column?.tasks || []

    return (


        <div ref={setNodeRef} className={`flex flex-col flex-shrink-0 gap-3 w-full flex-1 p-2 mb-8  pb-4  ${isOver ? ' border-2 border-dashed border-text-secondary/30 dark:border-lines/50 rounded-lg' : ''} `} draggable={false} >



            {tasks.map(task => (
                <TaskCard key={task.id} task={task} columnId={column.id} />
            ))}





        </div>


    )
}

export default TasksWarpper