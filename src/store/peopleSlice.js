// src/store/peopleSlice.js
import { createSlice } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

// Helper function to generate initials from name
const getInitials = (name) => {
    if (!name) return '??'
    const parts = name.trim().split(' ')
    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase()
    }
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

// Available avatar colors
const AVATAR_COLORS = [
    '#635FC7', // primary purple
    '#3B82F6', // blue
    '#10B981', // green
    '#F59E0B', // orange
    '#EF4444', // red
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#14B8A6', // teal
]

const getRandomColor = () => {
    return AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
}

const peopleSlice = createSlice({
    name: 'people',
    initialState: {
        people: []
    },
    reducers: {
        addPerson: (state, action) => {
            const { name, email, role } = action.payload
            const newPerson = {
                id: uuidv4(),
                name: name.trim(),
                email: email?.trim() || '',
                role: role?.trim() || '',
                initials: getInitials(name),
                color: getRandomColor(),
                createdAt: new Date().toISOString()
            }
            state.people.push(newPerson)
        },
        editPerson: (state, action) => {
            const { id, name, email, role } = action.payload
            const personIndex = state.people.findIndex(p => p.id === id)
            if (personIndex !== -1) {
                state.people[personIndex] = {
                    ...state.people[personIndex],
                    name: name.trim(),
                    email: email?.trim() || '',
                    role: role?.trim() || '',
                    initials: getInitials(name)
                }
            }
        },
        deletePerson: (state, action) => {
            const personId = action.payload
            state.people = state.people.filter(p => p.id !== personId)
        },
        // Bulk action to initialize default people (optional)
        initializeDefaultPeople: (state) => {
            if (state.people.length === 0) {
                const defaultPeople = [
                    { name: 'John Doe', email: 'john@example.com', role: 'Developer' },
                    { name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
                ]
                defaultPeople.forEach(person => {
                    state.people.push({
                        id: uuidv4(),
                        name: person.name,
                        email: person.email,
                        role: person.role,
                        initials: getInitials(person.name),
                        color: getRandomColor(),
                        createdAt: new Date().toISOString()
                    })
                })
            }
        }
    }
})

export const {
    addPerson,
    editPerson,
    deletePerson,
    initializeDefaultPeople
} = peopleSlice.actions

export default peopleSlice.reducer
