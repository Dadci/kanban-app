// src/constants/columns.js
export const STANDARD_COLUMNS = [
    {
        name: "TO DO",
        color: "bg-blue-500", // Blue for new tasks
        order: 0
    },
    {
        name: "IN PROGRESS",
        color: "bg-yellow-500", // Yellow for work in progress
        order: 1
    },
    {
        name: "IN REVIEW",
        color: "bg-purple-500", // Purple for review stage
        order: 2
    },
    {
        name: "DONE",
        color: "bg-green-500", // Green for completed tasks
        order: 3
    }
];

// Helper function to get column color by name
export const getColumnColor = (columnName) => {
    const column = STANDARD_COLUMNS.find(col => col.name === columnName);
    return column ? column.color : "bg-gray-500"; // fallback color
};

// Helper function to create standard columns with unique IDs
export const createStandardColumns = () => {
    return STANDARD_COLUMNS.map(col => ({
        id: `${col.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: col.name,
        color: col.color,
        order: col.order,
        tasks: []
    }));
};
