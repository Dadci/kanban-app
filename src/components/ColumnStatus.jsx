import React from 'react'
import { useSelector } from 'react-redux'


const tailwindColors = [
    'bg-red',
    'bg-blue',
    'bg-green',
    'bg-yellow',
    'bg-purple',
    'bg-pink',
    'bg-indigo',
    'bg-orange',
    'bg-teal',
    'bg-cyan'
  ];
  
  const generateColor = () => {
    // Get random color name from tailwind colors
    const colorIndex = Math.floor(Math.random() * tailwindColors.length);
    // Get random shade (400-600 for better visibility)
    const shade = Math.floor(Math.random() * 3) * 100 + 400;
    return `${tailwindColors[colorIndex]}-${shade}`;
};


const ColumnStatus = ({ name, columnId }) => {
    
    const [colorClass] = React.useState(generateColor());

    const boards = useSelector(state => state.boards.boards)
    const activeBoard = useSelector(state => state.boards.activeBoard)
    const currentBoard = boards.find(board => board.id === activeBoard)

    const column = currentBoard?.columns.find(col => col.id === columnId)
    const tasks = column?.tasks || []



    return (
        <div >

            <div className='flex flex-row items-center p-2 gap-2'>
                <span className={ `p-1 w-3 h-3 ${colorClass} rounded-full`} ></span>
                <h2 className='text-[12px] font-semibold tracking-wider text-text-secondary'>
                    {name} ({tasks.length})
                </h2>
            </div>

        </div>
    )
}

export default ColumnStatus