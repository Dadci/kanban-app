import React from 'react'
import dots from '../assets/icon-vertical-ellipsis.svg'
import { useState, useEffect, useRef } from 'react'
import CardOptions from './CardOptions'
import { useSelector } from 'react-redux'
import { useDraggable } from '@dnd-kit/core'




const TaskCard = ({ task, columnId }) => {

    const cardRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (cardRef.current && !cardRef.current.contains(event.target)) {
                setOpenOptions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    const { attributes, listeners, setNodeRef, transform, isDragging, transition } = useDraggable({
        id: task.id.toString(),
        data: { task }
    });


    // const style = {
    //     transform: CSS.Transform.toString(transform),
    //     transition,
    //     zIndex: isDragging ? 50 : 0
    // };

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0) ${isDragging ? 'rotate(6deg)' : ''}`,
        zIndex: isDragging ? 10 : 0,
        transition,
        position: 'relative'
    } : undefined;

    

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


    // const handleOptions = () => {
    //     setOpenOptions(!openOptions)
    // }


    const handleOptionsClick = (e) => {
        // Stop the event from triggering drag
        if (!isDragging) {

            e.stopPropagation();
            setOpenOptions(!openOptions)
        }
    };

 

    return (
        <div {...listeners} {...attributes} ref={setNodeRef}
            style={{
                ...style,
                transition: 'transform 0.2s ease, opacity 0.2s ease' // Added smooth transition
            }} 
            key={task.id} 
            className={`group flex-shrink-0 bg-white py-4 px-4 flex flex-col gap-1 rounded-lg border border-lines hover:shadow-sm hover:cursor-grab active:cursor-grabbing group-hover:text-primary ${isDragging ? 'opacity-70 border-dashed' : ''}`}
        >
            <div className='flex flex-row items-start justify-between gap-4' draggable={false} ref={cardRef} >
                <h1 className='text-text text-[14px] font-semibold group-hover:text-primary break-all leading-5'>{task.title}</h1>

                <button className='p-1 rounded-full shrink-0 z-[45]' draggable={false} onClick={handleOptionsClick} onPointerDown={(e) => {
                    e.stopPropagation(); 
                }}>
                    <img draggable={false} src={dots} alt="dots" className='w-1 cursor-pointer text-lg'/>
                </button>

                {openOptions &&
                    <CardOptions handleOptions={() => setOpenOptions(false)} task={{ ...task, columnId }}/>
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
}

export default TaskCard