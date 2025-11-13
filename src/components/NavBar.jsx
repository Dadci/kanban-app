import React from "react";
import { useTheme } from "../context/ThemeContext";
import logo_dark from "../assets/logo-dark.svg";
import logo_light from "../assets/logo-light.svg";
import dots from "../assets/icon-vertical-ellipsis.svg";
import { useState, useEffect, useRef } from "react";
import Options from "./Options";
import { useSelector, useDispatch } from "react-redux";
import { openTaskDialog, openPeopleList } from "../store/modalSlice";
import { setActiveBoard, setViewMode } from "../store/boardsSlice";
import chevron_down from "../assets/icon-chevron-down.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { HiViewBoards, HiCalendar, HiViewList } from "react-icons/hi";
import { UserGroupIcon } from "@heroicons/react/24/outline";

const NavBar = () => {
  const [openOptions, setOpenOptions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const optionsRef = useRef(null);
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const viewMode = useSelector((state) => state.boards.viewMode);
  const currentBoard = boards.find((board) => board.id === activeBoard);

  // Get display name based on location
  const getDisplayName = () => {
    if (location.pathname === "/analytics") {
      return "Analytics Dashboard";
    }
    return currentBoard?.name || "Welcome!";
  };

  // Search functionality
  const searchResults = React.useMemo(() => {
    if (!searchTerm.trim()) return [];

    const results = [];
    boards.forEach((board) => {
      board.columns.forEach((column) => {
        column.tasks.forEach((task) => {
          if (
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.subtasks.some((st) =>
              st.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
          ) {
            results.push({
              ...task,
              boardName: board.name,
              columnName: column.name,
              boardId: board.id,
              columnId: column.id,
            });
          }
        });
      });
    });
    return results;
  }, [searchTerm, boards]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setOpenOptions(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAddTask = () => {
    dispatch(openTaskDialog());
  };

  const handlePeopleList = () => {
    dispatch(openPeopleList());
  };

  const handleOptions = () => {
    setOpenOptions(!openOptions);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSearchResults(e.target.value.trim().length > 0);
  };

  const handleSearchFocus = () => {
    if (searchTerm.trim().length > 0) {
      setShowSearchResults(true);
    }
  };

  const handleTaskClick = (task) => {
    // Navigate to the board containing this task
    if (task.boardId !== activeBoard) {
      dispatch(setActiveBoard(task.boardId));
    }
    // Navigate to home page if not already there
    if (location.pathname !== "/") {
      navigate("/");
    }
    setShowSearchResults(false);
    setSearchTerm("");
  };

  const { darkMode } = useTheme();
  const isAnalyticsPage = location.pathname === "/analytics";

  return (
    <div>
      <nav className="flex flex-row items-center w-full h-24 bg-white border-b border-b-lines dark:border-lines-dark flex-shrink-0 justify-between dark:bg-background-darkCard">
        <div className="p-8 w-[300px] md:border-r md:border-r-lines dark:border-lines-dark h-full flex items-center gap-4">
          {darkMode ? (
            <img src={logo_light} alt="logo" className="md:w-36 w-32" />
          ) : (
            <img src={logo_dark} alt="logo" className="md:w-36 w-32" />
          )}
          <img
            src={chevron_down}
            alt="down"
            className="cursor-pointer w-4 md:hidden inline"
          />
        </div>

        <div className="flex items-center md:justify-between flex-1 p-8 gap-4">
          <h1 className="text-text dark:text-white text-2xl font-bold md:inline hidden">
            {getDisplayName()}
          </h1>

          {/* Search Input */}
          {!isAnalyticsPage && boards.length > 0 && (
            <div className="relative flex-1 max-w-md mx-4" ref={searchRef}>
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                className="w-full px-4 py-2 text-sm border border-lines dark:border-lines-dark rounded-lg bg-white dark:bg-background-darkCard text-text dark:text-white placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50"
              />

              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-background-darkCard border border-lines dark:border-lines-dark rounded-lg shadow-lg max-h-80 overflow-y-auto z-50">
                  {searchResults.map((task, index) => (
                    <div
                      key={`${task.id}-${index}`}
                      onClick={() => handleTaskClick(task)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-background-dark cursor-pointer border-b border-lines dark:border-lines-dark last:border-b-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-text dark:text-white text-sm truncate">
                            {task.title}
                          </h3>
                          <p className="text-xs text-text-secondary mt-1">
                            {task.boardName} • {task.columnName}
                          </p>
                          {task.description && (
                            <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          {task.priority === "high" && (
                            <span className="text-[8px] px-2 py-1 bg-red-100 text-red-700 rounded">
                              High
                            </span>
                          )}
                          {task.priority === "medium" && (
                            <span className="text-[8px] px-2 py-1 bg-orange-100 text-orange-700 rounded">
                              Med
                            </span>
                          )}
                          {task.priority === "low" && (
                            <span className="text-[8px] px-2 py-1 bg-green-100 text-green-700 rounded">
                              Low
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No Results Message */}
              {showSearchResults &&
                searchTerm.trim() &&
                searchResults.length === 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-background-darkCard border border-lines dark:border-lines-dark rounded-lg shadow-lg p-4 z-50">
                    <p className="text-text-secondary text-sm text-center">
                      No tasks found for "{searchTerm}"
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* View Toggle - Only show on boards page when a board is selected */}
          {!isAnalyticsPage && currentBoard && (
            <div className="flex items-center bg-gray-100 dark:bg-background-dark rounded-lg p-1">
              <button
                onClick={() => dispatch(setViewMode("kanban"))}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "kanban"
                    ? "bg-white dark:bg-background-darkCard text-primary shadow-sm"
                    : "text-text-secondary hover:text-text dark:hover:text-white"
                }`}
              >
                <HiViewBoards className="w-3 h-3" />
                <span className="hidden lg:inline">Board</span>
              </button>
              <button
                onClick={() => dispatch(setViewMode("list"))}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white dark:bg-background-darkCard text-primary shadow-sm"
                    : "text-text-secondary hover:text-text dark:hover:text-white"
                }`}
              >
                <HiViewList className="w-3 h-3" />
                <span className="hidden lg:inline">List</span>
              </button>
              <button
                onClick={() => dispatch(setViewMode("timeline"))}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewMode === "timeline"
                    ? "bg-white dark:bg-background-darkCard text-primary shadow-sm"
                    : "text-text-secondary hover:text-text dark:hover:text-white"
                }`}
              >
                <HiCalendar className="w-3 h-3" />
                <span className="hidden lg:inline">Timeline</span>
              </button>
            </div>
          )}

          <div
            className="flex items-center gap-3 relative flex-shrink-0"
            ref={optionsRef}
          >
            {!isAnalyticsPage && (
              <button
                className="bg-white dark:bg-background-dark border border-lines dark:border-lines-dark text-sm font-semibold text-primary px-4 py-2.5 rounded-full hover:bg-gray-50 dark:hover:bg-background-darkCard flex items-center gap-2"
                onClick={handlePeopleList}
                title="Manage Team"
              >
                <UserGroupIcon className="w-5 h-5" />
                <span className="hidden md:inline">Team</span>
              </button>
            )}
            {!isAnalyticsPage && (
              <button
                disabled={boards.length === 0}
                className="bg-primary text-sm disabled:bg-primary-hover font-semibold text-white px-6 py-3 rounded-full hover:bg-primary-hover"
                onClick={handleAddTask}
              >
                <span className="hidden md:inline">+ Add New Task</span>
                <span className="md:hidden">+</span>
              </button>
            )}
            {!isAnalyticsPage && (
              <>
                <img
                  src={dots}
                  alt="dots"
                  className="cursor-pointer p-2"
                  onClick={handleOptions}
                />
                {openOptions && <Options handleOptions={handleOptions} />}
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
