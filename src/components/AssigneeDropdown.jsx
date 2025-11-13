// src/components/AssigneeDropdown.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

const AssigneeDropdown = ({ assignees, onToggleAssignee }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const people = useSelector(state => state.people.people)

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const selectedPeople = people.filter(person => assignees.includes(person.id))

    return (
        <div className="relative" ref={dropdownRef}>
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="border border-lines dark:border-lines-dark dark:bg-background-darkCard rounded-lg p-3 cursor-pointer hover:border-primary dark:hover:border-primary transition-colors"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-wrap flex-1">
                        {selectedPeople.length === 0 ? (
                            <span className="text-text-secondary text-sm">Select team members...</span>
                        ) : (
                            <>
                                {selectedPeople.slice(0, 3).map(person => (
                                    <div
                                        key={person.id}
                                        className="flex items-center gap-1.5 bg-background dark:bg-background-dark px-2 py-1 rounded-md"
                                    >
                                        <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                                            style={{ backgroundColor: person.color }}
                                        >
                                            {person.initials}
                                        </div>
                                        <span className="text-text dark:text-white text-xs font-medium">
                                            {person.name}
                                        </span>
                                    </div>
                                ))}
                                {selectedPeople.length > 3 && (
                                    <span className="text-text-secondary text-xs font-medium">
                                        +{selectedPeople.length - 3} more
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                    <svg
                        className={`w-4 h-4 text-text-secondary transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-background-darkCard border border-lines dark:border-lines-dark rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
                    {people.length === 0 ? (
                        <div className="p-4 text-center">
                            <p className="text-text-secondary text-sm">No team members available.</p>
                            <p className="text-text-secondary text-xs mt-1">Add people first!</p>
                        </div>
                    ) : (
                        <div className="py-2">
                            {people.map(person => (
                                <label
                                    key={person.id}
                                    className="flex items-center gap-3 px-4 py-2.5 cursor-pointer hover:bg-background dark:hover:bg-background-dark transition-colors"
                                >
                                    <input
                                        type="checkbox"
                                        checked={assignees.includes(person.id)}
                                        onChange={() => onToggleAssignee(person.id)}
                                        className="w-4 h-4 cursor-pointer accent-primary"
                                    />
                                    <div
                                        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                                        style={{ backgroundColor: person.color }}
                                    >
                                        {person.initials}
                                    </div>
                                    <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-text dark:text-white text-sm font-medium truncate">
                                            {person.name}
                                        </span>
                                        {person.role && (
                                            <span className="text-text-secondary text-xs truncate">
                                                {person.role}
                                            </span>
                                        )}
                                    </div>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AssigneeDropdown

