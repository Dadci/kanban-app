import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useDroppable } from '@dnd-kit/core'
import TaskCard from './TaskCard'

// Memoized selector for better performance
const selectTasksForColumn = (state, columnId) => {
    const boards = state.boards.boards;
    const activeBoard = state.boards.activeBoard;
    const currentBoard = boards.find(board => board.id === activeBoard);
    const column = currentBoard?.columns.find(col => col.id === columnId);
    return column?.tasks || [];
};

const TasksWarpper = memo(({ columnId }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: columnId
    });

    // Use memoized selector
    const tasks = useSelector(state => selectTasksForColumn(state, columnId));

    // Memoize the className computation
    const wrapperClassName = useMemo(() => {
        return `flex flex-col flex-shrink-0 gap-3 w-full flex-1 p-2 mb-8 pb-4 ${
            isOver ? 'border-2 border-dashed border-text-secondary/30 dark:border-lines/50 rounded-lg' : ''
        }`;
    }, [isOver]);

    // Memoize the tasks rendering
    const renderedTasks = useMemo(() => {
        return tasks.map(task => (
            <TaskCard
                key={task.id}
                task={task}
                columnId={columnId}
            />
        ));
    }, [tasks, columnId]);

    return (
        <div 
            ref={setNodeRef} 
            className={wrapperClassName}
            draggable={false}
        >
            {renderedTasks}
        </div>
    );
});

// Add display name for debugging
TasksWarpper.displayName = 'TasksWarpper';

// Add prop types validation
TasksWarpper.propTypes = {
    columnId: PropTypes.string.isRequired,
};

export default TasksWarpper;