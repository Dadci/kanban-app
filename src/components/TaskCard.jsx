import React from 'react'
import dots from '../assets/icon-vertical-ellipsis.svg'
import { useState } from 'react'
import CardOptions from './CardOptions'
import { useSelector } from 'react-redux'

const TaskCard = ({ task, columnId }) => {

    const [openOptions, setOpenOptions] = useState(false)
    const activeBoard = useSelector(state => state.boards.activeBoard)


    const currentTask = useSelector(state => {
        const board = state.boards.boards.find(b => b.id === activeBoard);
        const column = board?.columns.find(col =>
            col.tasks.some(t => t.id === task.id)
        );
        return column?.tasks.find(t => t.id === task.id);
    });

    const completedSubtasks = currentTask?.subtasks.filter(st => st.isCompleted).length || 0;


    const handleOptions = () => {
        setOpenOptions(!openOptions)
    }


    return (

        <>

            <div key={task.id} className=' group flex-shrink-0 bg-white py-4 px-4 flex flex-col gap-1 rounded-lg border border-lines hover:shadow-sm hover:cursor-grab active:cursor-grabbing  group-hover:text-primary '>
                <div className='flex flex-row items-start justify-between gap-4'>

                    <h1 className='text-text text-[15px] font-semibold group-hover:text-primary break-all leading-5'>{task.title}</h1>
                    <img src={dots} alt="dots" className=' w-1 active cursor-pointer text-lg ' onClick={handleOptions} />

                    {openOptions && <CardOptions handleOptions={handleOptions} task={{ ...task, columnId }}
                    />}

                </div>

                <p className='text-text-secondary text-[12px] font-medium mb-2'>{completedSubtasks} of {task?.subtasks.length} subtasks</p>

                {task.priority === 'low' ? <span className='text-[10px] text-center w-1/5 font-semibold px-3 py-[2px] bg-green-100 text-green-700 rounded-md'>Low</span> : task.priority === 'medium' ? <span className='text-[10px] text-center w-[25%] font-semibold px-3 py-[2px] bg-orange-100 text-orange-700 rounded-md'>Medium</span> : <span className='text-[10px] text-center w-1/5 font-semibold px-3 py-[2px] bg-red-100 text-red-700 rounded-md'>High
                </span>}


            </div>



        </>
    )
}

export default TaskCard