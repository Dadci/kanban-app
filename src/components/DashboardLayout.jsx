import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import BoardWarpper from './BoardWarpper'
import BoardDialog from './BoardDialog'
import AlertDialog from './AlertDialog'
import { useDispatch, useSelector } from 'react-redux'
import Open_icon from '../assets/icon-show-sidebar.svg'
import TaskDialog from './TaskDialog'
import ViewTaskDialog from './ViewTaskDialog'
import { DndContext, useSensors, useSensor, PointerSensor, MeasuringStrategy } from '@dnd-kit/core'
import { editTask } from '../store/boardsSlice'
import { SortableContext } from '@dnd-kit/sortable'
import toast from 'react-hot-toast'



const DashboardLayout = () => {

    const dispatch = useDispatch();
    const boards = useSelector(state => state.boards.boards);
    const activeBoard = useSelector(state => state.boards.activeBoard);


    const [open, setOpen] = useState(false) // Sidebar state 

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const measuringConfig = {
        droppable: {
            strategy: MeasuringStrategy.Always,
        }
    };


    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || !active) return;

        const taskId = active.id;
        const newColumnId = over.id;

        const currentBoard = boards.find(board => board.id === activeBoard);
        const oldColumn = currentBoard.columns.find(col =>
            col.tasks.some(t => t.id === taskId)
        );

        if (oldColumn.id !== newColumnId) {
            const task = oldColumn.tasks.find(t => t.id === taskId);
            const newColumn = currentBoard.columns.find(col => col.id === newColumnId);

            dispatch(editTask({
                boardId: activeBoard,
                oldColumnId: oldColumn.id,
                newColumnId: newColumn.id,
                taskId: taskId,
                task: {
                    ...task,
                    status: newColumn.name
                }
            }));

            toast.success('Task moved successfully to ' + newColumn.name);
        }
    };



    const openModal = useSelector((state) => state.modal.isBoardDialogOpen) // Board Dialog state
    const openAlert = useSelector((state) => state.modal.isAlertDialogOpen) // Alert Dialog state

    const isTaskDialogOpen = useSelector((state) => state.modal.isTaskDialogOpen) // Task Dialog state

    const isViewTaskDialogOpen = useSelector((state) => state.modal.isViewTaskDialogOpen)

    const viewTaskData = useSelector((state) => state.modal.viewTaskData)

    return (
        <div className='w-screen h-screen bg-background flex flex-col relative'>
            <NavBar />
            <div className='flex flex-1 flex-shrink-0 overflow-hidden relative'>
                <div className='hidden md:block'>

                    <SideBar open={open} setOpen={setOpen} />
                </div>

                <div className={`p-5 bg-primary absolute w-14 h-14 rounded-r-full self-end mb-8 cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out
                ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100px]'} 
                ${open ? 'visible' : 'invisible'}`}>
                    <img src={Open_icon} alt='open' onClick={() => setOpen(!open)} className=' self-center' />
                </div>


                <DndContext onDragEnd={handleDragEnd} sensors={sensors} measuring={measuringConfig}>
                    <BoardWarpper />

                </DndContext>

            </div>
            {openModal && <BoardDialog />}
            {openAlert && <AlertDialog />}
            {isTaskDialogOpen && <TaskDialog />}
            {isViewTaskDialogOpen && <ViewTaskDialog task={viewTaskData} />}

        </div>
    )
}

export default DashboardLayout