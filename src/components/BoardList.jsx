// src/components/BoardList.jsx
import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openViewTaskDialog } from "../store/modalSlice";
import { STANDARD_COLUMNS, getColumnColor } from "../constants/columns";
import {
  HiChevronDown,
  HiChevronRight,
  HiDotsHorizontal,
} from "react-icons/hi";

const BoardList = () => {
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const dispatch = useDispatch();

  // State for expanded columns
  const [expandedColumns, setExpandedColumns] = useState({
    "TO DO": true,
    "IN PROGRESS": true,
    "IN REVIEW": true,
    DONE: true,
  });

  // Get current board and tasks
  const currentBoard = boards.find((board) => board.id === activeBoard);

  const columnData = useMemo(() => {
    if (!currentBoard) return [];

    return STANDARD_COLUMNS.map((standardCol) => {
      const boardColumn = currentBoard.columns.find(
        (col) => col.name === standardCol.name
      );
      return {
        ...standardCol,
        id: boardColumn?.id || `${standardCol.name}_${Date.now()}`,
        tasks: boardColumn?.tasks || [],
        isExpanded: expandedColumns[standardCol.name],
      };
    });
  }, [currentBoard, expandedColumns]);

  const toggleColumn = (columnName) => {
    setExpandedColumns((prev) => ({
      ...prev,
      [columnName]: !prev[columnName],
    }));
  };

  const handleTaskClick = (task, columnId) => {
    dispatch(
      openViewTaskDialog({
        ...task,
        columnId,
      })
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const getPriorityBadge = (priority) => {
    if (!priority) return null;

    const badges = {
      low: "bg-green-100 text-green-700",
      medium: "bg-yellow-100 text-yellow-700",
      high: "bg-red-100 text-red-700",
    };

    return (
      <span
        className={`px-2 py-1 rounded text-xs font-medium ${badges[priority]}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-background-darkCard rounded-lg flex items-center justify-center mx-auto mb-4">
            📋
          </div>
          <h2 className="text-xl font-semibold text-text dark:text-white mb-2">
            No Board Selected
          </h2>
          <p className="text-text-secondary">
            Select a board to view its task list
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-text dark:text-white flex items-center gap-2">
          📋 List View
        </h2>
        <p className="text-text-secondary text-sm">
          {currentBoard.name} •{" "}
          {columnData.reduce((acc, col) => acc + col.tasks.length, 0)} tasks
        </p>
      </div>

      {/* Tree Structure */}
      <div className="flex-1 bg-white dark:bg-background-darkCard rounded-lg shadow-sm overflow-auto">
        {columnData.map((column, index) => (
          <div
            key={column.name}
            className={index !== columnData.length - 1 ? "mb-4" : ""}
          >
            {/* Column Header */}
            <div
              className={`flex items-center gap-3 p-4 bg-gray-50 dark:bg-background-dark border-l-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                column.name === "TO DO"
                  ? "border-l-blue-500"
                  : column.name === "IN PROGRESS"
                  ? "border-l-yellow-500"
                  : column.name === "IN REVIEW"
                  ? "border-l-purple-500"
                  : "border-l-green-500"
              }`}
              onClick={() => toggleColumn(column.name)}
            >
              <div className="flex items-center gap-3">
                {column.isExpanded ? (
                  <HiChevronDown className="w-5 h-5 text-text-secondary" />
                ) : (
                  <HiChevronRight className="w-5 h-5 text-text-secondary" />
                )}
                <span
                  className={`w-4 h-4 ${getColumnColor(
                    column.name
                  )} rounded-full`}
                ></span>
                <span className="font-semibold text-text dark:text-white text-base">
                  {column.name}
                </span>
                <span className="bg-gray-200 dark:bg-background-darkCard text-text-secondary px-2 py-1 rounded-full text-xs font-medium">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks */}
            {column.isExpanded && (
              <div className="bg-white dark:bg-background-darkCard">
                {column.tasks.map((task, taskIndex) => (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-3 p-3 pl-16 border-l-4 border-l-gray-200 dark:border-l-gray-600 hover:bg-gray-50 dark:hover:bg-background-dark cursor-pointer transition-colors ${
                      taskIndex !== column.tasks.length - 1
                        ? "border-b border-gray-100 dark:border-gray-700"
                        : ""
                    }`}
                    onClick={() => handleTaskClick(task, column.id)}
                  >
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 bg-gray-300 rounded-full flex-shrink-0"></div>
                        <div className="flex flex-col gap-1">
                          <span className="text-text dark:text-white text-sm font-medium">
                            {task.title}
                          </span>
                          {task.description && (
                            <span className="text-text-secondary text-xs max-w-md line-clamp-1">
                              {task.description}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {task.dueDate && (
                          <span className="text-text-secondary text-xs bg-gray-100 dark:bg-background-dark px-2 py-1 rounded">
                            {formatDate(task.dueDate)}
                          </span>
                        )}
                        {getPriorityBadge(task.priority)}
                        <button
                          className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HiDotsHorizontal className="w-4 h-4 text-text-secondary" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardList;
