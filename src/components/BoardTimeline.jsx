// src/components/BoardTimeline.jsx
import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { openViewTaskDialog } from "../store/modalSlice";
import { HiCalendar, HiChevronLeft, HiChevronRight } from "react-icons/hi";

const BoardTimeline = () => {
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const people = useSelector((state) => state.people.people);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewDays, setViewDays] = useState(21); // Show 3 weeks (21 days)

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

  // Get dates based on view setting
  const getWeekDates = (date) => {
    const dates = [];
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const diff = startDate.getDate() - dayOfWeek; // First day of week (Sunday)

    startDate.setDate(diff);

    for (let i = 0; i < viewDays; i++) {
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      dates.push(day);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentDate);
  const today = new Date();

  // Navigation functions
  const goToPreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 14);
    setCurrentDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 14);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get tasks that span across the week with smart row assignment
  const getTasksSpanningWeek = () => {
    const tasks = allTasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const startDate = task.creationDate
          ? new Date(task.creationDate)
          : new Date();
        const endDate = new Date(task.dueDate);

        // Calculate which columns this task spans
        const taskColumns = [];
        weekDates.forEach((date, index) => {
          const dateOnly = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
          );
          const startOnly = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()
          );
          const endOnly = new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate()
          );

          if (dateOnly >= startOnly && dateOnly <= endOnly) {
            taskColumns.push(index);
          }
        });

        return {
          ...task,
          startColumn: taskColumns[0],
          endColumn: taskColumns[taskColumns.length - 1],
          spanColumns: taskColumns.length,
        };
      })
      .filter((task) => task.spanColumns > 0);

    // Assign rows to tasks to avoid overlaps
    const rows = [];
    tasks.forEach((task) => {
      let assignedRow = -1;

      // Try to find a row where this task doesn't overlap
      for (let i = 0; i < rows.length; i++) {
        const hasOverlap = rows[i].some((t) => {
          return !(
            task.startColumn > t.endColumn || task.endColumn < t.startColumn
          );
        });

        if (!hasOverlap) {
          assignedRow = i;
          rows[i].push(task);
          break;
        }
      }

      // If no suitable row found, create a new one
      if (assignedRow === -1) {
        rows.push([task]);
        assignedRow = rows.length - 1;
      }

      task.row = assignedRow;
    });

    return tasks;
  };

  const formatWeekRange = () => {
    const start = weekDates[0];
    const end = weekDates[viewDays - 1];
    const startMonth = start.toLocaleDateString("en-US", { month: "long" });
    const endMonth = end.toLocaleDateString("en-US", { month: "long" });

    if (startMonth === endMonth) {
      return `${startMonth} ${end.getFullYear()}`;
    }
    return `${startMonth} - ${endMonth} ${end.getFullYear()}`;
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
      {/* Simplified Header - Just month navigation and Today button */}
      <div className="flex items-center justify-between mb-6 px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={goToPreviousWeek}
            className="p-1.5 hover:bg-background dark:hover:bg-background-dark rounded-lg transition-colors"
          >
            <HiChevronLeft className="w-4 h-4 text-text-secondary" />
          </button>

          <h3 className="text-sm font-semibold text-text dark:text-white min-w-[200px] text-center">
            {formatWeekRange()}
          </h3>

          <button
            onClick={goToNextWeek}
            className="p-1.5 hover:bg-background dark:hover:bg-background-dark rounded-lg transition-colors"
          >
            <HiChevronRight className="w-4 h-4 text-text-secondary" />
          </button>
        </div>

        <button
          onClick={goToToday}
          className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-hover transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid - Full height */}
      <div className="bg-white dark:bg-background-darkCard rounded-lg shadow-sm overflow-x-auto flex-1 flex flex-col">
        {/* Compact Day Headers */}
        <div
          className="grid border-b border-lines dark:border-lines-dark min-w-max"
          style={{
            gridTemplateColumns: `repeat(${viewDays}, minmax(50px, 1fr))`,
          }}
        >
          {weekDates.map((date, index) => {
            const dayNames = ["S", "M", "T", "W", "T", "F", "S"];
            const fullDayNames = [
              "Sun",
              "Mon",
              "Tue",
              "Wed",
              "Thu",
              "Fri",
              "Sat",
            ];
            const dayName = dayNames[date.getDay()];
            const fullDayName = fullDayNames[date.getDay()];
            const isToday = date.toDateString() === today.toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            return (
              <div
                key={index}
                className={`px-1 py-1 text-center ${
                  isToday
                    ? "bg-primary/5 dark:bg-primary/10"
                    : isWeekend
                    ? "bg-gray-200 dark:bg-gray-800/40"
                    : "bg-gray-50 dark:bg-background-dark"
                }`}
                title={fullDayName}
              >
                <div
                  className={`font-medium text-[9px] ${
                    isWeekend
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-text-secondary"
                  }`}
                >
                  {dayName}
                </div>
                <div
                  className={`text-[11px] font-bold mt-0.5 ${
                    isToday
                      ? "text-white bg-primary rounded-full w-5 h-5 flex items-center justify-center mx-auto"
                      : isWeekend
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-text dark:text-white"
                  }`}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Task Grid - Using absolute positioning for spanning tasks */}
        <div
          className="grid flex-1 relative min-w-max"
          style={{
            gridTemplateColumns: `repeat(${viewDays}, minmax(50px, 1fr))`,
          }}
        >
          {/* Background columns */}
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === today.toDateString();
            const isWeekend = date.getDay() === 0 || date.getDay() === 6; // Sunday or Saturday
            return (
              <div
                key={index}
                className={`border-r border-lines dark:border-lines-dark ${
                  index === viewDays - 1 ? "border-r-0" : ""
                } ${isToday ? "bg-primary/5 dark:bg-primary/10" : ""}`}
                style={
                  isWeekend && !isToday
                    ? {
                        backgroundImage: `repeating-linear-gradient(
                          135deg,
                          rgba(0, 0, 0, 0.015),
                          rgba(0, 0, 0, 0.015) 6px,
                          rgba(0, 0, 0, 0.04) 6px,
                          rgba(0, 0, 0, 0.04) 7px
                        )`,
                        backgroundColor: "rgba(243, 244, 246, 0.8)",
                      }
                    : {}
                }
              />
            );
          })}

          {/* Spanning tasks */}
          <div
            className="absolute inset-0 grid gap-0 pointer-events-none pt-2"
            style={{
              gridTemplateColumns: `repeat(${viewDays}, minmax(50px, 1fr))`,
            }}
          >
            {getTasksSpanningWeek().map((task, taskIndex) => {
              const handleTaskClick = () => {
                const columnId = currentBoard.columns.find((col) =>
                  col.tasks.some((t) => t.id === task.id)
                )?.id;

                dispatch(
                  openViewTaskDialog({
                    ...task,
                    columnId,
                  })
                );
              };

              // Calculate position using smart row assignment
              const startCol = task.startColumn + 1;
              const endCol = task.endColumn + 1;
              const rowHeight = 0; // Card height (48px) + gap (8px)
              const topOffset = 8 + task.row * rowHeight; // Use assigned row for positioning

              return (
                <div
                  key={task.id}
                  onClick={handleTaskClick}
                  style={{
                    gridColumnStart: startCol,
                    gridColumnEnd: endCol + 1,
                    marginTop: `${topOffset}px`,
                  }}
                  className="group bg-white dark:bg-background-dark p-1.5 rounded border border-lines dark:border-lines-dark shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary dark:hover:border-primary mx-0.5 pointer-events-auto h-fit"
                >
                  {/* Priority indicator bar and content */}
                  <div className="flex gap-1">
                    <div
                      className={`w-[3px] rounded-sm flex-shrink-0 ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-orange-500"
                          : "bg-green-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[11px] font-semibold text-text dark:text-white line-clamp-1 leading-tight group-hover:text-primary dark:group-hover:text-primary transition-colors">
                        {task.title}
                      </h4>
                      <span className="text-[8px] text-text-secondary uppercase tracking-wide block mt-0.5">
                        {task.columnName}
                      </span>
                    </div>
                  </div>

                  {/* Bottom row with metadata */}
                  <div className="flex items-center justify-between gap-1 mt-1">
                    {/* Left side: Progress and priority */}
                    <div className="flex items-center gap-1.5">
                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center gap-1">
                          <svg
                            className="w-3 h-3 text-text-secondary"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <span className="text-[9px] text-text-secondary font-medium">
                            {
                              task.subtasks.filter((st) => st.isCompleted)
                                .length
                            }
                            /{task.subtasks.length}
                          </span>
                        </div>
                      )}
                      {task.priority && (
                        <span
                          className={`text-[8px] font-semibold px-1.5 py-0.5 rounded ${
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

                    {/* Right side: Assignee avatars */}
                    {task.assignees && task.assignees.length > 0 && (
                      <div className="flex items-center -space-x-1">
                        {task.assignees.slice(0, 3).map((assigneeId, idx) => {
                          const person = people.find(
                            (p) => p.id === assigneeId
                          );
                          if (!person) return null;
                          return (
                            <div
                              key={person.id}
                              className="relative group/avatar"
                              style={{ zIndex: 3 - idx }}
                            >
                              <div
                                className="w-4 h-4 rounded-full flex items-center justify-center text-white text-[7px] font-semibold border border-white dark:border-background-dark shadow-sm"
                                style={{ backgroundColor: person.color }}
                              >
                                {person.initials}
                              </div>
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 bg-gray-900 dark:bg-gray-800 text-white text-[9px] font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all duration-200 pointer-events-none z-50">
                                {person.name}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[3px] border-r-[3px] border-t-[3px] border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                              </div>
                            </div>
                          );
                        })}
                        {task.assignees.length > 3 && (
                          <div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[7px] font-semibold border border-white dark:border-background-dark shadow-sm">
                            +{task.assignees.length - 3}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardTimeline;
