import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBoard, editBoard } from "../store/boardsSlice";
import { closeBoardDialog } from "../store/modalSlice";
import { v4 as uuidv4 } from "uuid";
import close_icon from "../assets/icon-cross.svg";
import toast from "react-hot-toast";

const BoardDialog = () => {
  const dispatch = useDispatch();
  const { dialogType, boardData } = useSelector((state) => state.modal);
  const [boardName, setBoardName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (dialogType === "edit" && boardData) {
      setBoardName(boardData.name);
    }
  }, [dialogType, boardData]);

  const handleClose = () => {
    dispatch(closeBoardDialog());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!boardName.trim()) {
      setError("Board name is required!");
      return;
    }

    if (dialogType === "edit") {
      dispatch(
        editBoard({
          id: boardData.id,
          name: boardName,
        })
      );
      toast.success("Board name updated successfully!");
    } else {
      const newBoard = {
        id: uuidv4(),
        name: boardName,
      };
      dispatch(addBoard(newBoard));
      toast.success("Board created with standard columns!");
    }
    dispatch(closeBoardDialog());
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-neutral-950/70 z-50">
      <div className="w-[480px] max-h-[90vh] flex flex-col p-8 bg-white dark:bg-background-darkCard rounded-lg shadow-sm">
        <div className="flex flex-row items-center justify-between w-full">
          <h1 className="text-text dark:text-white font-bold text-lg">
            {dialogType === "edit" ? "Edit Board" : "Add New Board"}
          </h1>
          <img
            src={close_icon}
            alt="close"
            type="button"
            className="cursor-pointer hover:bg-background p-2 rounded-lg"
            onClick={handleClose}
          />
        </div>

        {error && <p className="text-destructive text-sm mt-2 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col mt-6 w-full">
          <label
            htmlFor="name"
            className="text-text-secondary dark:text-white text-[12px] font-medium mb-2"
          >
            Board Name
          </label>
          <input
            type="text"
            className="border border-lines dark:border-lines-dark rounded-lg p-3 placeholder-text-secondary dark:text-white mb-6 dark:bg-background-darkCard"
            placeholder="e.g. Web Design Project"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
          />

          {dialogType !== "edit" && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-background-dark rounded-lg">
              <h3 className="text-text dark:text-white text-sm font-medium mb-3">
                Standard Columns
              </h3>
              <p className="text-text-secondary text-xs mb-3">
                Your board will be created with these standard columns:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                  <span className="text-text-secondary text-sm">TO DO</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                  <span className="text-text-secondary text-sm">
                    IN PROGRESS
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                  <span className="text-text-secondary text-sm">IN REVIEW</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-text-secondary text-sm">DONE</span>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="bg-primary text-sm font-semibold text-white px-4 py-3 rounded-full hover:bg-primary-hover"
          >
            {dialogType === "edit" ? "Save Changes" : "Create Board"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BoardDialog;
