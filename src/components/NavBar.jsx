import React from 'react'
import logo_dark from '../assets/logo-dark.svg'
import dots from '../assets/icon-vertical-ellipsis.svg'
import { useState, useEffect, useRef } from 'react'
import Options from './Options'
import { useSelector, useDispatch } from 'react-redux'
import { openTaskDialog } from '../store/modalSlice'



const NavBar = () => {
    const [openOptions, setOpenOptions] = useState(false)
    const optionsRef = useRef(null)
    const dispatch = useDispatch()

    const boards = useSelector((state) => state.boards.boards)
    const activeBoard = useSelector((state) => state.boards.activeBoard)

    const currentBoard = boards.find(board => board.id === activeBoard)

    const activeBoardName = currentBoard?.name || 'Welcome!'

    useEffect(() => {

        const handleClickOutside = (event) => {
            if (optionsRef.current && !optionsRef.current.contains(event.target)) {
                setOpenOptions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }

    }, [])


    const handleAddTask = () => {
        dispatch(openTaskDialog())
    }


    const handleOptions = () => {
        setOpenOptions(!openOptions)
    }



    return (
        <div >
            <nav className='flex flex-row items-center w-full h-24 bg-white border-b border-b-lines'  >

                <div className='p-8 w-[300px] border-r border-r-lines h-full'>

                    <img src={logo_dark} alt="logo" className='w-36' />

                </div>

                <div className='flex items-center justify-between flex-1 p-8'>

                    <h1 className='text-text text-2xl font-bold'>{activeBoardName}</h1>

                    <div className='flex items-center gap-5 relative' ref={optionsRef}>

                        <button disabled={boards.length === 0} className='bg-primary text-sm disabled:bg-primary-hover font-semibold text-white px-6 py-3 rounded-full hover:bg-primary-hover' onClick={handleAddTask}>+ Add New Task</button>
                        <img src={dots} alt="dots" className=' cursor-pointer p-2' onClick={handleOptions} />

                        {openOptions && <Options handleOptions={handleOptions} />}

                    </div>

                </div>

            </nav>


        </div>
    )
}

export default NavBar