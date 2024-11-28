import React, { memo } from 'react'
import PropTypes from 'prop-types'
import ColumnStatus from './ColumnStatus'
import TasksWarpper from './TasksWarpper'



const Column = memo(({ column }) => {


    return (


        <div className='flex flex-col h-full items-start w-[280px] space-y-1 flex-shrink-0'>
            <ColumnStatus name={column.name} columnId={column.id} />
            <TasksWarpper columnId={column.id} />

        </div>

    )
});

// Add display name for debugging
Column.displayName = 'Column';

// Add prop types validation
Column.propTypes = {
    column: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

export default Column