import React from 'react'


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


const ColumnStatus = ({ name }) => {

    const [colorClass] = React.useState(generateColor());


    return (
        <div>

            <div className='flex flex-row items-center gap-2'>
                <span className={ `p-1 w-3 h-3 ${colorClass} rounded-full`} ></span>
                <h2 className='text-[12px] font-semibold tracking-wider text-text-secondary'>
                    {name} (0)
                </h2>
            </div>

        </div>
    )
}

export default ColumnStatus