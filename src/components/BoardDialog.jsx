import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addBoard, editBoard } from '../store/boardsSlice'
import { closeBoardDialog } from '../store/modalSlice'
import { v4 as uuidv4 } from 'uuid'
import close_icon from '../assets/icon-cross.svg'
import toast from 'react-hot-toast'





const BoardDialog = () => {



    const dispatch = useDispatch()
    const { dialogType, boardData } = useSelector(state => state.modal)
    const [boardName, setBoardName] = useState('')
    const [error, setError] = useState('')
    const [columns, setColumns] = useState([
        {
            id: uuidv4(),
            name: ''
        }
    ])

    useEffect(() => {
        if (dialogType === 'edit' && boardData) {
            setBoardName(boardData.name)
            setColumns(boardData.columns.map(col => ({
                id: col.id,
                name: col.name
            })))
        }
    }, [dialogType, boardData])


    const handleAddColumn = (e) => {
        e.preventDefault()
        setColumns([
            ...columns,
            { id: uuidv4(), name: '' }
        ])
    }


    const handleRemoveColumn = (columnId) => (e) => {
        e.preventDefault()
        if (columns.length === 1) {
            setError('Board must have at least one column!')
            return
        }
        setColumns(columns.filter(col => col.id !== columnId))
    }


    const handleColumnChange = (id, value) => {
        setColumns(columns.map(col =>
            col.id === id ? { ...col, name: value } : col
        ))
    }

    const handleClose = () => {

        dispatch(closeBoardDialog())

    }


    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        if (!boardName.trim()) {
            setError('Board name is required!')
            return
        }

        if (columns.some(col => !col.name.trim())) {
            setError('All columns must have names!')
            return
        }

        if (dialogType === 'edit') {
            dispatch(editBoard({
                id: boardData.id,
                name: boardName,
                columns: columns
            }))
            toast.success('Changes saved successfully!')
        } else {
            const newBoard = {
                id: uuidv4(),
                name: boardName,
                columns: columns.map(col => ({
                    id: col.id,
                    name: col.name.toUpperCase(),
                    tasks: [],

                }))
            }
            dispatch(addBoard(newBoard))
            toast.success('Board added successfully!')
        }
        dispatch(closeBoardDialog())
    }



    return (
        <div className='fixed inset-0 flex items-center justify-center  bg-neutral-950/70 z-50'>
            <div className='w-[480px] flex flex-col p-8 bg-white rounded-lg shadow-sm '>

                <div className='flex flex-row items-center justify-between w-full'>
                    <h1 className='text-text font-bold text-lg'> {dialogType === 'edit' ? 'Edit Board' : 'Add New Board'}</h1>
                    <img src={close_icon} alt='close' type='button' className='cursor-pointer'
                        onClick={handleClose}
                    />


                </div>


                {error && (
                    <p className="text-destructive text-sm mt-2 mb-4">{error}</p>
                )}
                <form onSubmit={handleSubmit} className='flex flex-col mt-6  w-full'>
                    <label htmlFor='name' className='text-text-secondary text-[12px] font-medium mb-2'>Name</label>
                    <input type="text" className='border border-lines rounded-lg p-3 placeholder-text-secondary mb-6' placeholder='e.g. Web Design' value={boardName} onChange={(e) => setBoardName(e.target.value)} />

                    <label htmlFor='columns' className='text-text-secondary text-[12px] font-medium mb-2'>Columns</label>
                    {columns.map(column => (
                        <div key={column.id} className='flex flex-row items-center  justify-between gap-4 gap-y-3 w-full'>
                            <input type="text" className='border mb-4 border-lines rounded-lg p-3 flex-1 placeholder-text-secondary' placeholder='e.g. To Do' value={column.name} onChange={(e) => handleColumnChange(column.id, e.target.value)} />
                            <img src={close_icon} alt='close' type='button' className='cursor-pointer mb-4'
                                onClick={handleRemoveColumn(column.id)}
                            />
                        </div>
                    ))}
                    <button type='button' className='text-primary mb-6 font-semibold text-sm px-4 py-3 bg-primary/25 rounded-full' onClick={handleAddColumn}>+ Add New Column</button>

                    <button type='submit' className='bg-primary text-sm font-semibold text-white px-4 py-3 rounded-full w-fullhover:bg-primary-hover'>{dialogType === 'edit' ? 'Save Changes' : 'Create New Board'}</button>
                </form>

            </div>

        </div>
    )
}

export default BoardDialog