// src/components/Analytics.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setActiveBoard } from "../store/boardsSlice";
import {
  HiClipboardList,
  HiCheckCircle,
  HiChartPie,
  HiCollection,
  HiTrendingUp,
  HiClock,
  HiLightningBolt,
  HiExclamation,
  HiViewBoards,
  HiCalendar,
} from "react-icons/hi";

const Analytics = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const boards = useSelector((state) => state.boards.boards);

  // Basic metrics
  const totalBoards = boards.length;
  const totalTasks = boards.reduce(
    (acc, board) =>
      acc + board.columns.reduce((colAcc, col) => colAcc + col.tasks.length, 0),
    0
  );
  const completedTasks = boards.reduce(
    (acc, board) =>
      acc +
      board.columns.reduce(
        (colAcc, col) =>
          colAcc +
          col.tasks.filter((task) =>
            task.subtasks.every((st) => st.isCompleted)
          ).length,
        0
      ),
    0
  );

  // Board summaries with task counts and completion rates
  const boardSummaries = boards.map((board) => {
    const tasks = board.columns.reduce((acc, col) => acc.concat(col.tasks), []);
    const completed = tasks.filter((task) =>
      task.subtasks.every((st) => st.isCompleted)
    );
    const highPriority = tasks.filter(
      (task) => task.priority === "high"
    ).length;
    const overdueTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date();
    }).length;

    return {
      id: board.id,
      name: board.name,
      totalTasks: tasks.length,
      completedTasks: completed.length,
      completionRate: tasks.length
        ? Math.round((completed.length / tasks.length) * 100)
        : 0,
      highPriorityTasks: highPriority,
      overdueTasks: overdueTasks,
      columns: board.columns.length,
    };
  });

  const handleBoardClick = (boardId) => {
    dispatch(setActiveBoard(boardId));
    navigate("/");
  };

  return (
    <div className="p-6 bg-background dark:bg-background-dark min-h-screen flex-1 overflow-y-auto">
      <div className="mb-6">
        <p className="text-text-secondary text-sm">
          Project overview and board summaries
        </p>
      </div>

      {/* Compact Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-background-darkCard p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HiViewBoards className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text dark:text-white">
                {totalBoards}
              </p>
              <p className="text-xs text-text-secondary">Boards</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-darkCard p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <HiClipboardList className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text dark:text-white">
                {totalTasks}
              </p>
              <p className="text-xs text-text-secondary">Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-darkCard p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <HiCheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text dark:text-white">
                {completedTasks}
              </p>
              <p className="text-xs text-text-secondary">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-background-darkCard p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <HiChartPie className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text dark:text-white">
                {totalTasks
                  ? Math.round((completedTasks / totalTasks) * 100)
                  : 0}
                %
              </p>
              <p className="text-xs text-text-secondary">Completion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Boards Table */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-text dark:text-white mb-4 flex items-center gap-2">
          <HiCollection className="w-5 h-5" />
          All Boards
        </h2>

        {boards.length === 0 ? (
          <div className="bg-white dark:bg-background-darkCard p-8 rounded-lg shadow-sm text-center">
            <HiViewBoards className="w-12 h-12 text-text-secondary mx-auto mb-4" />
            <p className="text-text-secondary">
              No boards yet. Create your first board to get started!
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-background-darkCard rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-lines dark:border-lines-dark bg-gray-50 dark:bg-background-dark">
                  <th className="text-left py-3 px-4 font-medium text-text-secondary text-sm">
                    Board Name
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">
                    Columns
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">
                    Total Tasks
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">
                    Completed
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">
                    Progress
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">
                    Priority
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-text-secondary text-sm">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {boardSummaries.map((board, index) => (
                  <tr
                    key={board.id}
                    className={`border-b border-lines dark:border-lines-dark hover:bg-gray-50 dark:hover:bg-background-dark transition-colors ${
                      index === boardSummaries.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-6 bg-primary rounded-sm"></div>
                        <div>
                          <h3 className="font-medium text-text dark:text-white">
                            {board.name}
                          </h3>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <HiViewBoards className="w-4 h-4 text-text-secondary" />
                        <span className="text-text dark:text-white font-medium">
                          {board.columns}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-text dark:text-white font-medium text-lg">
                        {board.totalTasks}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="text-green-600 font-medium">
                        {board.completedTasks}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${board.completionRate}%` }}
                          />
                        </div>
                        <span className="text-text dark:text-white font-medium text-sm min-w-[40px]">
                          {board.completionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-3">
                        {board.highPriorityTasks > 0 && (
                          <div className="flex items-center gap-1 text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full">
                            <HiExclamation className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              {board.highPriorityTasks}
                            </span>
                          </div>
                        )}
                        {board.overdueTasks > 0 && (
                          <div className="flex items-center gap-1 text-orange-600 bg-orange-50 dark:bg-orange-900/20 px-2 py-1 rounded-full">
                            <HiClock className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              {board.overdueTasks}
                            </span>
                          </div>
                        )}
                        {board.highPriorityTasks === 0 &&
                          board.overdueTasks === 0 && (
                            <span className="text-text-secondary text-xs">
                              -
                            </span>
                          )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleBoardClick(board.id)}
                        className="bg-primary text-white px-3 py-1.5 rounded-md text-xs font-medium hover:bg-primary-hover transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
