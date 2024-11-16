import React from 'react'
import Moon from '../assets/icon-dark-theme.svg'
import Sun from '../assets/icon-light-theme.svg'

const ThemeToggle = () => {
    return (
        <div className='py-3 px-16 bg-background rounded-sm flex flex-row gap-2 items-center ml-8'>
            <img src={Sun} alt='sun' />
            <label className="relative inline-flex cursor-pointer items-center">
                <input id="switch-2" type="checkbox" className="peer sr-only" />
                <label htmlFor="switch-2" className="hidden"></label>
                <div className="peer h-4 w-11 rounded-full border bg-slate-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:ring-primary"></div>
            </label>
            <img src={Moon} alt='moon' />
        </div>
    )
}

export default ThemeToggle