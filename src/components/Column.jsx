import React from 'react'
import ColumnStatus from './ColumnStatus'
import TasksWarpper from './TasksWarpper'


const Column = ({column}) => {

    return (

        <>
            
                <div className='flex flex-col items-start w-[280px] space-y-5 flex-shrink-0'>
                    <ColumnStatus name={column.name} columnId={column.id} />
                    <TasksWarpper columnId={column.id}/>

                </div>

        </>


    )
}

export default Column