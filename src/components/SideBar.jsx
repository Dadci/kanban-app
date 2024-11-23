import React, { useEffect } from 'react'
import SideBoardItem from './SideBoardItem'
import CreateBoardBtn from './CreateBoardBtn'
import ThemeToggle from './ThemeToggle'
import SidebarToggle from './SidebarToggle'
import { useDispatch, useSelector } from 'react-redux'

const SideBar = ({ open, setOpen }) => {




    const boards = useSelector((state) => state.boards.boards)



    return (
        <div className={` ${open ? 'w-0 translate-x-[-260px] opacity-0' : 'w-[300px] translate-x-0 opacity-100'} bg-white pt-6 border-r border-r-lines flex flex-col flex-shrink-0 justify-between h-full transition-all duration-700 ease-in-out dark:bg-background-darkCard dark:border-lines-dark`}>
            <div>

                <div className='pl-8'>
                    <h2 className='text-[12px] font-semibold tracking-wider text-text-secondary'>ALL BOARDS ({boards.length})</h2>
                </div>

                <div className='flex flex-col mt-5 mr-6 mb-2 gap-[2px]'>
                    <SideBoardItem />
                </div>

                <div className='px-8 py-2'>
                    <CreateBoardBtn />
                </div>

            </div>
            <div className='flex flex-col items-start gap-5 mb-8'>
                <ThemeToggle />
                <SidebarToggle open={open} setOpen={setOpen} />

            </div>

        </div>
    )
}

export default SideBar