// src/components/BoardTimeline.jsx
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  HiCalendar,
  HiChevronLeft,
  HiChevronRight,
  HiClock,
  HiExclamation,
} from "react-icons/hi";

const BoardTimeline = () => {
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Get current board tasks
  const currentBoard = boards.find((board) => board.id === activeBoard);
  const allTasks = useMemo(() => {
    if (!currentBoard) return [];
    return currentBoard.columns.reduce((acc, column) => {
      return acc.concat(
        column.tasks.map((task) => ({
          ...task,
          columnName: column.name,
        }))
      );
    }, []);
  }, [currentBoard]);

  // Get week dates
  const getWeekDates = (date) => {
    const week = [];
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek; // First day of week (Sunday)

    startDate.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      week.push(day);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return allTasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.getDate()} ${start.toLocaleDateString("en-US", {
      month: "short",
    })} - ${end.getDate()} ${end.toLocaleDateString("en-US", {
      month: "short",
    })} ${end.getFullYear()}`;
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="text-center">
          <HiCalendar className="w-16 h-16 text-text-secondary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text dark:text-white mb-2">
            No Board Selected
          </h2>
          <p className="text-text-secondary">
            Select a board to view its task timeline
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Compact Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-sm font-medium text-text dark:text-white flex items-center gap-1">
              <HiCalendar className="w-4 h-4" />
              Timeline View
            </h2>
            <p className="text-text-secondary text-xs">
              {currentBoard.name} • {allTasks.length} tasks
            </p>
          </div>

          <button
            onClick={goToToday}
            className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-hover transition-colors"
          >
            Today
          </button>
        </div>

        {/* Compact Week Navigation */}
        <div className="flex items-center justify-between bg-white dark:bg-background-darkCard px-3 py-2 rounded-md shadow-sm border border-lines dark:border-lines-dark">
          <button
            onClick={goToPreviousWeek}
            className="p-1 hover:bg-gray-100 dark:hover:bg-background-dark rounded transition-colors"
          >
            <HiChevronLeft className="w-4 h-4 text-text-secondary" />
          </button>

          <h3 className="text-sm font-medium text-text dark:text-white">
            {formatWeekRange()}
          </h3>

          <button
            onClick={goToNextWeek}
            className="p-1 hover:bg-gray-100 dark:hover:bg-background-dark rounded transition-colors"
          >
            <HiChevronRight className="w-4 h-4 text-text-secondary" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white dark:bg-background-darkCard rounded-lg shadow-sm overflow-hidden flex-1">
        {/* Compact Day Headers */}
        <div className="grid grid-cols-7 border-b border-lines dark:border-lines-dark">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
            (day, index) => (
              <div
                key={day}
                className="px-2 py-2 text-center bg-gray-50 dark:bg-background-dark"
              >
                <div className="font-medium text-text-secondary text-xs mb-0.5">
                  {day}
                </div>
                <div
                  className={`text-sm font-semibold ${
                    weekDates[index].toDateString() === today.toDateString()
                      ? "text-primary"
                      : "text-text dark:text-white"
                  }`}
                >
                  {weekDates[index].getDate()}
                </div>
              </div>
            )
          )}
        </div>

        {/* Task Grid */}
        <div className="grid grid-cols-7 min-h-[500px]">
          {weekDates.map((date, index) => {
            const dayTasks = getTasksForDate(date);
            const isToday = date.toDateString() === today.toDateString();

            return (
              <div
                key={index}
                className={`p-2 border-r border-lines dark:border-lines-dark min-h-[500px] ${
                  index === 6 ? "border-r-0" : ""
                } ${isToday ? "bg-primary/5" : ""}`}
              >
                <div className="space-y-1.5">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white dark:bg-background-dark p-2 rounded border border-lines dark:border-lines-dark shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-xs font-medium text-text dark:text-white line-clamp-2">
                          {task.title}
                        </h4>
                        {task.priority === "high" && (
                          <HiExclamation className="w-3 h-3 text-red-600 flex-shrink-0" />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-text-secondary truncate">
                          {task.columnName}
                        </span>
                        {task.priority && (
                          <span
                            className={`text-[8px] px-1 py-0.5 rounded flex-shrink-0 ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-700"
                                : task.priority === "medium"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {task.priority}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {dayTasks.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-text-secondary text-xs opacity-50">
                        No tasks
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BoardTimeline;
