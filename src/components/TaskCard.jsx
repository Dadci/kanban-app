import React, { useState, useEffect, useRef, memo, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { useDraggable } from '@dnd-kit/core'
import dots from '../assets/icon-vertical-ellipsis.svg'
import CardOptions from './CardOptions'

// Custom hook for handling click outside
const useClickOutside = (ref, callback) => {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                callback();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [ref, callback]);
};

const TaskCard = memo(({ task, columnId }) => {
    const [openOptions, setOpenOptions] = useState(false);
    const cardRef = useRef(null);

    // Memoize the callback
    const handleCloseOptions = useCallback(() => {
        setOpenOptions(false);
    }, []);

    // Use custom hook
    useClickOutside(cardRef, handleCloseOptions);

    const { attributes, listeners, setNodeRef, transform, isDragging, transition } = useDraggable({
        id: task.id.toString(),
        data: { task }
    });

    // Memoize style computation
    const style = React.useMemo(() => ({
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0) ${isDragging ? 'rotate(4deg)' : ''}` : undefined,
        transition,
        zIndex: isDragging ? 10 : 0,
        position: 'relative'
    }), [transform, transition, isDragging]);

    // Memoize click handler
    const handleDotsClick = useCallback((e) => {
        e.stopPropagation();
        setOpenOptions(prev => !prev);
    }, []);

    const activeBoard = useSelector(state => state.boards.activeBoard)

    const currentTask = useSelector(state => {
        const board = state.boards.boards.find(b => b.id === activeBoard);
        const column = board?.columns.find(col =>
            col.tasks.some(t => t.id === task.id)
        );
        return column?.tasks.find(t => t.id === task.id);
    });

    const completedSubtasks = currentTask?.subtasks.filter(st => st.isCompleted).length || 0;

    return (
        <div
            {...listeners} {...attributes} ref={setNodeRef}
            style={{
                ...style,
                transition: 'transform 0.2s ease, opacity 0.2s ease'
            }}
            key={task.id}
            className={`group flex-shrink-0 bg-white dark:bg-background-darkCard py-4 px-4 flex flex-col gap-1 rounded-lg border border-lines dark:border-lines-dark hover:shadow-sm hover:cursor-grab active:cursor-grabbing group-hover:text-primary dark:group-hover:text-text-secondary ${isDragging ? 'opacity-70 border-dashed' : ''}`}
        >
            <div className='flex flex-row items-start justify-between gap-4' draggable={false} ref={cardRef} >
                <h1 className='text-text dark:text-white text-[14px] font-semibold group-hover:text-primary dark:group-hover:text-text-secondary break-all leading-5'>{task.title}</h1>

                <button className='p-1 rounded-full shrink-0 z-[45]' draggable={false} onClick={handleDotsClick} onPointerDown={(e) => {
                    e.stopPropagation();
                }}>
                    <img draggable={false} src={dots} alt="dots" className='w-1 cursor-pointer text-lg' />
                </button>

                {openOptions &&
                    <CardOptions handleOptions={() => setOpenOptions(false)} task={{ ...task, columnId }} />
                }
            </div>

            <p className='text-text-secondary text-[12px] font-medium mb-2'>{completedSubtasks} of {task?.subtasks.length} subtasks</p>

            {task.priority === 'low' ?
                <span className='text-[10px] text-center w-1/5 font-semibold px-3 py-[2px] bg-green-100 text-green-700 rounded-md'>Low</span> :
                task.priority === 'medium' ?
                    <span className='text-[10px] text-center w-[25%] font-semibold px-3 py-[2px] bg-orange-100 text-orange-700 rounded-md'>Medium</span> :
                    <span className='text-[10px] text-center w-1/5 font-semibold px-3 py-[2px] bg-red-100 text-red-700 rounded-md'>High</span>
            }
        </div>
    )
})

// Add display name for debugging
TaskCard.displayName = 'TaskCard';

export default TaskCard