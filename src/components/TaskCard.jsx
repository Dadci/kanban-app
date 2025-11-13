import React, { useState, useEffect, useRef, memo, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDraggable } from "@dnd-kit/core";
import dots from "../assets/icon-vertical-ellipsis.svg";
import CardOptions from "./CardOptions";

// Custom hook for handling click outside
const useClickOutside = (ref, callback) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, callback]);
};

const TaskCard = memo(({ task, columnId }) => {
  const [openOptions, setOpenOptions] = useState(false);
  const cardRef = useRef(null);

  // Memoize the callback
  const handleCloseOptions = useCallback(() => {
    setOpenOptions(false);
  }, []);

  // Use custom hook
  useClickOutside(cardRef, handleCloseOptions);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
    transition,
  } = useDraggable({
    id: task.id.toString(),
    data: { task },
  });

  // Memoize style computation
  const style = React.useMemo(
    () => ({
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0) ${
            isDragging ? "rotate(4deg)" : ""
          }`
        : undefined,
      transition,
      zIndex: isDragging ? 10 : 0,
      position: "relative",
    }),
    [transform, transition, isDragging]
  );

  // Memoize click handler
  const handleDotsClick = useCallback((e) => {
    e.stopPropagation();
    setOpenOptions((prev) => !prev);
  }, []);

  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const people = useSelector((state) => state.people.people);

  const currentTask = useSelector((state) => {
    const board = state.boards.boards.find((b) => b.id === activeBoard);
    const column = board?.columns.find((col) =>
      col.tasks.some((t) => t.id === task.id)
    );
    return column?.tasks.find((t) => t.id === task.id);
  });

  const completedSubtasks =
    currentTask?.subtasks.filter((st) => st.isCompleted).length || 0;

  // Helper function to get due date status
  const getDueDateStatus = useCallback((dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        status: "overdue",
        text: "Overdue",
        class: "bg-red-100 text-red-700 border-red-200",
      };
    if (diffDays === 0)
      return {
        status: "today",
        text: "Due Today",
        class: "bg-yellow-100 text-yellow-700 border-yellow-200",
      };
    if (diffDays === 1)
      return {
        status: "tomorrow",
        text: "Due Tomorrow",
        class: "bg-orange-100 text-orange-700 border-orange-200",
      };
    if (diffDays <= 3)
      return {
        status: "soon",
        text: `Due in ${diffDays} days`,
        class: "bg-blue-100 text-blue-700 border-blue-200",
      };

    return {
      status: "future",
      text: due.toLocaleDateString(),
      class: "bg-gray-100 text-gray-700 border-gray-200",
    };
  }, []);

  const dueDateStatus = getDueDateStatus(currentTask?.dueDate);

  return (
    <div
      {...listeners}
      {...attributes}
      ref={setNodeRef}
      style={{
        ...style,
        transition: "transform 0.2s ease, opacity 0.2s ease",
      }}
      key={task.id}
      className={`group flex-shrink-0 bg-white dark:bg-background-darkCard p-4 flex flex-col gap-3 rounded-lg border border-lines dark:border-lines-dark hover:shadow-md hover:cursor-grab active:cursor-grabbing transition-shadow ${
        isDragging ? "opacity-70 border-dashed shadow-lg" : ""
      }`}
    >
      {/* Header with options button */}
      <div
        className="flex flex-row items-start justify-between gap-2"
        draggable={false}
        ref={cardRef}
      >
        <h1 className="text-text dark:text-white text-[15px] font-bold group-hover:text-primary dark:group-hover:text-text-secondary break-words leading-snug flex-1">
          {task.title}
        </h1>

        <button
          className="p-1.5 hover:bg-background dark:hover:bg-background-dark rounded-lg shrink-0 z-[45] transition-colors"
          draggable={false}
          onClick={handleDotsClick}
          onPointerDown={(e) => {
            e.stopPropagation();
          }}
        >
          <img
            draggable={false}
            src={dots}
            alt="options"
            className="w-1 cursor-pointer"
          />
        </button>

        {openOptions && (
          <CardOptions
            handleOptions={() => setOpenOptions(false)}
            task={{ ...task, columnId }}
          />
        )}
      </div>

      {/* Subtasks count with progress bar */}
      <div className="flex items-center gap-2">
        <div className="w-full bg-background dark:bg-background-dark rounded-full h-1.5">
          <div
            className="bg-primary h-1.5 rounded-full transition-all"
            style={{
              width: `${(completedSubtasks / task?.subtasks.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-text-secondary text-[11px] font-medium whitespace-nowrap">
          {completedSubtasks}/{task?.subtasks.length}
        </span>
      </div>

      {/* Badges and Avatars in one row */}
      <div className="flex items-center justify-between gap-2">
        {/* Left side: Priority and Due Date badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Priority Badge - Always show if priority exists */}
          {task.priority && (
            <>
              {task.priority === "low" && (
                <span className="text-[10px] font-semibold px-2 py-1 bg-green-100 text-green-700 rounded-md">
                  Low
                </span>
              )}
              {task.priority === "medium" && (
                <span className="text-[10px] font-semibold px-2 py-1 bg-orange-100 text-orange-700 rounded-md">
                  Medium
                </span>
              )}
              {task.priority === "high" && (
                <span className="text-[10px] font-semibold px-2 py-1 bg-red-100 text-red-700 rounded-md">
                  High
                </span>
              )}
            </>
          )}

          {/* Due Date Badge */}
          {dueDateStatus && (
            <span
              className={`text-[10px] font-semibold px-2 py-1 rounded-md ${dueDateStatus.class}`}
            >
              {dueDateStatus.text}
            </span>
          )}
        </div>

        {/* Right side: Assignee Avatars */}
        {currentTask?.assignees && currentTask.assignees.length > 0 && (
          <div className="flex items-center -space-x-2">
            {currentTask.assignees.slice(0, 3).map((assigneeId, index) => {
              const person = people.find((p) => p.id === assigneeId);
              if (!person) return null;
              return (
                <div
                  key={person.id}
                  className="relative group/avatar"
                  style={{ zIndex: 3 - index }}
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold border-2 border-white dark:border-background-darkCard shadow-sm transition-transform hover:scale-110 hover:z-10 cursor-pointer"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.initials}
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all duration-200 pointer-events-none z-50">
                    {person.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                  </div>
                </div>
              );
            })}
            {currentTask.assignees.length > 3 && (
              <div className="relative group/avatar">
                <div className="w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-[10px] font-semibold border-2 border-white dark:border-background-darkCard shadow-sm cursor-pointer">
                  +{currentTask.assignees.length - 3}
                </div>
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 dark:bg-gray-800 text-white text-[10px] font-medium rounded whitespace-nowrap opacity-0 invisible group-hover/avatar:opacity-100 group-hover/avatar:visible transition-all duration-200 pointer-events-none z-50">
                  {currentTask.assignees.length - 3} more people
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

// Add display name for debugging
TaskCard.displayName = "TaskCard";

export default TaskCard;
