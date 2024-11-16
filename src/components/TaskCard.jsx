import React from 'react'

const TaskCard = () => {
    return (
        <div className=' group bg-white py-6 px-4 flex flex-col gap-2 rounded-lg border border-lines  hover:shadow-sm cursor-pointer group-hover:text-primary '>
            <h1 className='text-text text-[15px] font-semibold group-hover:text-primary'>Build UI for onboarding flow</h1>
            <p className='text-text-secondary text-[12px] font-medium'>0 of 6 substasks</p>

        </div>
    )
}

export default TaskCard