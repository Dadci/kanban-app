import React, { useState, useEffect, Suspense, lazy } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DndContext, useSensors, useSensor, PointerSensor, MeasuringStrategy } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { editTask } from '../store/boardsSlice'
import toast from 'react-hot-toast'
import NavBar from './NavBar'
import SideBar from './SideBar'
import BoardWarpper from './BoardWarpper'
import Open_icon from '../assets/icon-show-sidebar.svg'
import { useNavigate, useLocation } from 'react-router-dom'
import {Outlet} from 'react-router-dom'


// Lazy load heavy dialog components
const BoardDialog = lazy(() => import('./BoardDialog'))
const AlertDialog = lazy(() => import('./AlertDialog'))
const TaskDialog = lazy(() => import('./TaskDialog'))
const ViewTaskDialog = lazy(() => import('./ViewTaskDialog'))

// Simple loading component for dialogs
const DialogLoading = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
)


const DashboardLayout = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const boards = useSelector(state => state.boards.boards);
    const activeBoard = useSelector(state => state.boards.activeBoard);
    const [open, setOpen] = useState(false);

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
        <div className="h-screen flex">

            <div className='w-screen h-screen bg-background dark:bg-background-dark  flex flex-col relative'>
                <NavBar />
                <div className='flex flex-1 flex-shrink-0 overflow-hidden relative'>
                    <div className='hidden md:block'>

                        <SideBar open={open} setOpen={setOpen} />
                    </div>

                    <div className={`p-5 bg-primary absolute w-14 h-14 rounded-r-full self-end mb-8 cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out z-50 
                ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100px]'} 
                ${open ? 'visible' : 'invisible'}`}>
                        <img src={Open_icon} alt='open' onClick={() => setOpen(!open)} className=' self-center' />
                    </div>

                    {/* Conditionally wrap with DndContext */}
                    {location.pathname === '/' ? (
                        <DndContext onDragEnd={handleDragEnd} sensors={sensors} measuring={measuringConfig}>
                            <BoardWarpper />
                        </DndContext>
                    ) : (
                        <Outlet />
                    )}
                </div>
                <Suspense fallback={<DialogLoading />}>
                    {openModal && <BoardDialog />}
                    {openAlert && <AlertDialog />}
                    {isTaskDialogOpen && <TaskDialog />}
                    {isViewTaskDialogOpen && <ViewTaskDialog task={viewTaskData} />}
                </Suspense>

            </div>
        </div>
    )
}

export default DashboardLayout