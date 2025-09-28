import React from "react";
import { useSelector } from "react-redux";
import { getColumnColor } from "../constants/columns";

const ColumnStatus = ({ name, columnId }) => {
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const currentBoard = boards.find((board) => board.id === activeBoard);

  const column = currentBoard?.columns.find((col) => col.id === columnId);
  const tasks = column?.tasks || [];

  // Get the predefined color for this column
  const colorClass = getColumnColor(name);

  return (
    <div>
      <div className="flex flex-row items-center p-2 gap-2">
        <span className={`p-1 w-3 h-3 ${colorClass} rounded-full`}></span>
        <h2 className="text-[12px] font-semibold tracking-wider text-text-secondary">
          {name} ({tasks.length})
        </h2>
      </div>
    </div>
  );
};

export default ColumnStatus;
