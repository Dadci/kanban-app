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
        <div className='flex flex-col gap-5 w-full overflow-y-auto'>


            {tasks.map(task => (
                <TaskCard key={task.id} task={task} columnId={column.id} />
            ))}
        </div>
    )
}

export default TasksWarpper