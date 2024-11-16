import React, { useState } from 'react'
import NavBar from './NavBar'
import SideBar from './SideBar'
import BoardWarpper from './BoardWarpper'
import BoardDialog from './BoardDialog'
import { useDispatch, useSelector } from 'react-redux'
import Open_icon from '../assets/icon-show-sidebar.svg'


const DashboardLayout = () => {

    const [open, setOpen] = useState(false)



    const openModal = useSelector((state) => state.modal.isBoardDialogOpen)



    return (
        <div className='w-screen h-screen bg-background flex flex-col relative'>
            <NavBar />
            <div className='flex flex-1 overflow-hidden'>
                <SideBar open={open} setOpen={setOpen} />

                <div className={`p-4 bg-primary w-16 h-12 rounded-r-full self-end mb-8 cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out
                ${open ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[-100px]'} 
                ${open ? 'visible' : 'invisible'}`}>
                    <img src={Open_icon} alt='open' onClick={() => setOpen(!open)} />
                </div>

                <BoardWarpper />
            </div>
            {openModal && <BoardDialog />}
        </div>
    )
}

export default DashboardLayout