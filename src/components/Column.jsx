import React from 'react'
import ColumnStatus from './ColumnStatus'
import TasksWarpper from './TasksWarpper'


const Column = ({column}) => {

    return (

        <>
            
                <div className='flex flex-col items-start w-[280px] space-y-6'>
                    <ColumnStatus name={column.name} />
                    <TasksWarpper />

                </div>

        </>


    )
}

export default Column