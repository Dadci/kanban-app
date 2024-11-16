import React from 'react'
import TaskCard from './TaskCard'

const TasksWarpper = () => {
    return (
        <div className='flex flex-col gap-5 w-full'>
            <TaskCard />
        </div>
    )
}

export default TasksWarpper