import React from 'react'
import TaskCard from './TaskCard'
import { useSelector } from 'react-redux'



const TasksWarpper = ({ columnId }) => {

    const boards = useSelector(state => state.boards.boards)
    const activeBoard = useSelector(state => state.boards.activeBoard)
    const currentBoard = boards.find(board => board.id === activeBoard)

    const column = currentBoard?.columns.find(col => col.id === columnId)
    const tasks = column?.tasks || []

    return (
        <div className='flex flex-shrink-0 flex-col gap-3 w-full overflow-y-auto max-h-[calc(100vh-200px)]'>


            {tasks.map(task => (
                <TaskCard key={task.id} task={task} columnId={column.id} />
            ))}
        </div>
    )
}

export default TasksWarpper