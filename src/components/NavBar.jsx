import React from 'react'
import logo_dark from '../assets/logo-dark.svg'
import dots from '../assets/icon-vertical-ellipsis.svg'


const NavBar = () => {
    return (
        <div >
            <nav className='flex flex-row items-center w-full h-24 bg-white border-b border-b-lines '>

                <div className='p-8 w-[300px] border-r border-r-lines h-full'>

                    <img src={logo_dark} alt="logo" className='w-36' />

                </div>

                <div className='flex items-center justify-between flex-1 p-8'>

                    <h1 className='text-text text-2xl font-bold'>Platform Launch</h1>

                    <div className='flex items-center gap-5 '>

                        <button className='bg-primary text-sm font-semibold text-white px-6 py-4 rounded-full hover:bg-primary-hover'>+ Add New Task</button>
                        <img src={dots} alt="dots" className=' cursor-pointer p-2' />

                    </div>

                </div>

            </nav>


        </div>
    )
}

export default NavBar