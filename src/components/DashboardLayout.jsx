import React, { useState, useEffect } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import BoardWarpper from './BoardWarpper'
import BoardDialog from './BoardDialog'
import AlertDialog from './AlertDialog'
import { useDispatch, useSelector } from 'react-redux'
import Open_icon from '../assets/icon-show-sidebar.svg'
import TaskDialog from './TaskDialog'


const DashboardLayout = () => {

    const [open, setOpen] = useState(false) // Sidebar state 




    const openModal = useSelector((state) => state.modal.isBoardDialogOpen) // Board Dialog state
    const openAlert = useSelector((state) => state.modal.isAlertDialogOpen) // Alert Dialog state

    const isTaskDialogOpen = useSelector((state) => state.modal.isTaskDialogOpen) // Task Dialog state


    return (
        <div className='w-screen h-screen bg-background flex flex-col relative'>
            <NavBar />
            <div className='flex flex-1 overflow-hidden relative'>
                <SideBar open={open} setOpen={setOpen} />

                <div className={`p-5 bg-primary absolute w-14 h-14 rounded-r-full self-end mb-8 cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out
                ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100px]'} 
                ${open ? 'visible' : 'invisible'}`}>
                    <img src={Open_icon} alt='open' onClick={() => setOpen(!open)} className=' self-center' />
                </div>

                <BoardWarpper />
            </div>
            {openModal && <BoardDialog />}
            {openAlert && <AlertDialog />}
            {isTaskDialogOpen && <TaskDialog />}

        </div>
    )
}

export default DashboardLayout