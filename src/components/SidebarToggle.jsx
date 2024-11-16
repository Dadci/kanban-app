import React from 'react'
import Hide_icon from '../assets/icon-hide-sidebar.svg'

const SidebarToggle = ({ open, setOpen }) => {

    const handleToggle = () => {
        setOpen(!open)
    }

    return (
        <div className='flex flex-row items-center gap-4 pl-8 cursor-pointer hover' onClick={handleToggle}>
            <img src={Hide_icon} alt='hide' />
            <h2 className='text-[14px] font-medium tracking-wider text-text-secondary'>Hide Sidebar</h2>

        </div>
    )
}

export default SidebarToggle