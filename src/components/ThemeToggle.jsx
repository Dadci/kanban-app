// src/components/ThemeToggle.jsx
import { useTheme } from '../context/ThemeContext'
import Moon from '../assets/icon-dark-theme.svg'
import Sun from '../assets/icon-light-theme.svg'

const ThemeToggle = () => {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <div className='py-3 px-16 bg-background dark:bg-background-dark rounded-md flex flex-row gap-2 items-center ml-8'>
            <img src={Sun} alt='sun' />
            <label className="relative inline-flex cursor-pointer items-center">
                <input
                    type="checkbox"
                    className="peer sr-only"
                    checked={darkMode}
                    onChange={toggleTheme}
                />
                <div className="peer h-4 w-11 rounded-full border bg-slate-200 after:absolute after:-top-1 after:left-0 after:h-6 after:w-6 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:ring-primary"></div>
            </label>
            <img src={Moon} alt='moon' />
        </div>
    )
}

export default ThemeToggle