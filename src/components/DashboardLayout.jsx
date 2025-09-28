import React, { useState, useEffect, Suspense, lazy } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DndContext,
  useSensors,
  useSensor,
  PointerSensor,
  MeasuringStrategy,
} from "@dnd-kit/core";
import { SortableContext } from "@dnd-kit/sortable";
import { editTask, setActiveBoard } from "../store/boardsSlice";
import { openTaskDialog, openBoardDialog } from "../store/modalSlice";
import toast from "react-hot-toast";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import BoardWarpper from "./BoardWarpper";
import Open_icon from "../assets/icon-show-sidebar.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { Outlet } from "react-router-dom";

// Lazy load heavy dialog components
const BoardDialog = lazy(() => import("./BoardDialog"));
const AlertDialog = lazy(() => import("./AlertDialog"));
const TaskDialog = lazy(() => import("./TaskDialog"));
const ViewTaskDialog = lazy(() => import("./ViewTaskDialog"));

// Simple loading component for dialogs
const DialogLoading = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
  </div>
);

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const boards = useSelector((state) => state.boards.boards);
  const activeBoard = useSelector((state) => state.boards.activeBoard);
  const [open, setOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const measuringConfig = {
    droppable: {
      strategy: MeasuringStrategy.Always,
    },
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || !active) return;

    const taskId = active.id;
    const newColumnId = over.id;

    const currentBoard = boards.find((board) => board.id === activeBoard);
    const oldColumn = currentBoard.columns.find((col) =>
      col.tasks.some((t) => t.id === taskId)
    );

    if (oldColumn.id !== newColumnId) {
      const task = oldColumn.tasks.find((t) => t.id === taskId);
      const newColumn = currentBoard.columns.find(
        (col) => col.id === newColumnId
      );

      dispatch(
        editTask({
          boardId: activeBoard,
          oldColumnId: oldColumn.id,
          newColumnId: newColumn.id,
          taskId: taskId,
          task: {
            ...task,
            status: newColumn.name,
          },
        })
      );

      toast.success("Task moved successfully to " + newColumn.name);
    }
  };

  const openModal = useSelector((state) => state.modal.isBoardDialogOpen); // Board Dialog state
  const openAlert = useSelector((state) => state.modal.isAlertDialogOpen); // Alert Dialog state

  const isTaskDialogOpen = useSelector((state) => state.modal.isTaskDialogOpen); // Task Dialog state

  const isViewTaskDialogOpen = useSelector(
    (state) => state.modal.isViewTaskDialogOpen
  );

  const viewTaskData = useSelector((state) => state.modal.viewTaskData);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or when dialogs are open
      if (
        e.target.tagName === "INPUT" ||
        e.target.tagName === "TEXTAREA" ||
        e.target.contentEditable === "true" ||
        openModal ||
        isTaskDialogOpen ||
        isViewTaskDialogOpen ||
        openAlert
      ) {
        return;
      }

      // Check for Ctrl/Cmd + key combinations
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            if (boards.length > 0) {
              dispatch(openTaskDialog());
              toast.success("Quick add task (Ctrl+N)");
            }
            break;

          case "b":
            e.preventDefault();
            dispatch(openBoardDialog());
            toast.success("Create new board (Ctrl+B)");
            break;

          case "k":
            e.preventDefault();
            // Focus search input if it exists
            const searchInput = document.querySelector(
              'input[placeholder="Search tasks..."]'
            );
            if (searchInput) {
              searchInput.focus();
              toast.success("Search focused (Ctrl+K)");
            }
            break;

          case "/":
            e.preventDefault();
            // Focus search input (alternative shortcut)
            const searchInput2 = document.querySelector(
              'input[placeholder="Search tasks..."]'
            );
            if (searchInput2) {
              searchInput2.focus();
              toast.success("Search focused (Ctrl+/)");
            }
            break;

          case "h":
            e.preventDefault();
            // Toggle sidebar
            setOpen((prev) => !prev);
            toast.success(`Sidebar ${open ? "hidden" : "shown"} (Ctrl+H)`);
            break;

          case "1":
          case "2":
          case "3":
          case "4":
          case "5":
          case "6":
          case "7":
          case "8":
          case "9":
            e.preventDefault();
            // Switch to board by number
            const boardIndex = parseInt(e.key) - 1;
            if (boards[boardIndex] && boards[boardIndex].id !== activeBoard) {
              const targetBoard = boards[boardIndex];
              dispatch(setActiveBoard(targetBoard.id));
              if (location.pathname !== "/") {
                navigate("/");
              }
              toast.success(
                `Switched to "${targetBoard.name}" (Ctrl+${e.key})`
              );
            }
            break;

          default:
            break;
        }
      }

      // Single key shortcuts (without Ctrl/Cmd)
      switch (e.key) {
        case "Escape":
          // Close any open modals
          if (
            openModal ||
            isTaskDialogOpen ||
            isViewTaskDialogOpen ||
            openAlert
          ) {
            // Let the components handle their own escape logic
            return;
          }
          break;

        case "?":
          e.preventDefault();
          // Show keyboard shortcuts help
          toast.success(
            "⌨️ Keyboard Shortcuts:\n" +
              "Ctrl+N: New Task\n" +
              "Ctrl+B: New Board\n" +
              "Ctrl+K: Search Tasks\n" +
              "Ctrl+H: Toggle Sidebar\n" +
              "Ctrl+1-9: Switch Boards\n" +
              "?: Show this help\n" +
              "Esc: Close dialogs",
            {
              duration: 5000,
              style: {
                whiteSpace: "pre-line",
                textAlign: "left",
              },
            }
          );
          break;

        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    dispatch,
    navigate,
    location.pathname,
    boards,
    activeBoard,
    openModal,
    isTaskDialogOpen,
    isViewTaskDialogOpen,
    openAlert,
    open,
  ]);

  return (
    <div className="h-screen flex">
      <div className="w-screen h-screen bg-background dark:bg-background-dark  flex flex-col relative">
        <NavBar />
        <div className="flex flex-1 flex-shrink-0 overflow-hidden relative">
          <div className="hidden md:block">
            <SideBar open={open} setOpen={setOpen} />
          </div>

          <div
            className={`p-5 bg-primary absolute w-14 h-14 rounded-r-full self-end mb-8 cursor-pointer flex items-center justify-center transition-all duration-500 ease-in-out z-50 
                ${
                  open
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-[-100px]"
                } 
                ${open ? "visible" : "invisible"}`}
          >
            <img
              src={Open_icon}
              alt="open"
              onClick={() => setOpen(!open)}
              className=" self-center"
            />
          </div>

          {/* Conditionally wrap with DndContext */}
          {location.pathname === "/" ? (
            <DndContext
              onDragEnd={handleDragEnd}
              sensors={sensors}
              measuring={measuringConfig}
            >
              <BoardWarpper />
            </DndContext>
          ) : (
            <Outlet />
          )}
        </div>
        <Suspense fallback={<DialogLoading />}>
          {openModal && <BoardDialog />}
          {openAlert && <AlertDialog />}
          {isTaskDialogOpen && <TaskDialog />}
          {isViewTaskDialogOpen && <ViewTaskDialog task={viewTaskData} />}
        </Suspense>
      </div>
    </div>
  );
};

export default DashboardLayout;
