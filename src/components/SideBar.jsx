import React from "react";
import SideBoardItem from "./SideBoardItem";
import CreateBoardBtn from "./CreateBoardBtn";
import ThemeToggle from "./ThemeToggle";
import SidebarToggle from "./SidebarToggle";
import { useDispatch, useSelector } from "react-redux";
import { HiChartBar, HiViewBoards } from "react-icons/hi";
import { useNavigate, useLocation } from "react-router-dom";

const SideBar = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const boards = useSelector((state) => state.boards.boards);
  const isAnalyticsPage = location.pathname === "/analytics";

  return (
    <div
      className={`${
        open
          ? "w-0 translate-x-[-260px] opacity-0"
          : "w-[300px] translate-x-0 opacity-100"
      } 
            bg-white pt-6 border-r border-r-lines flex flex-col flex-shrink-0 justify-between h-full 
            transition-all duration-700 ease-in-out dark:bg-background-darkCard dark:border-lines-dark`}
    >
      <div>
        {/* Main Navigation Section */}
        <div className="pl-8 mb-6">
          <h2 className="text-[12px] font-semibold tracking-wider text-text-secondary">
            NAVIGATION
          </h2>
        </div>

        {/* Analytics Button */}
        <div
          onClick={() => navigate("/analytics")}
          className={`flex items-center gap-3 px-8 py-3 cursor-pointer mb-2
                        ${
                          isAnalyticsPage
                            ? "bg-primary text-white"
                            : "hover:bg-primary/10 text-text-secondary hover:text-primary"
                        }`}
        >
          <HiChartBar size={20} />
          <span className="font-semibold">Analytics</span>
        </div>

        {/* Back to Boards - Show on analytics page */}
        {isAnalyticsPage && (
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-8 py-3 cursor-pointer hover:bg-primary/10 mb-4"
          >
            <HiViewBoards className="text-text-secondary" size={20} />
            <span className="text-text-secondary">Back to Boards</span>
          </div>
        )}

        {/* Boards Section */}
        <div className="pl-8 mb-4">
          <h2 className="text-[12px] font-semibold tracking-wider text-text-secondary">
            ALL BOARDS ({boards.length})
          </h2>
        </div>

        <div className="flex flex-col mr-6 mb-2 gap-[2px]">
          <SideBoardItem />
        </div>

        <div className="px-8 py-2">
          <CreateBoardBtn />
        </div>
      </div>

      {/* Settings Section */}
      <div className="flex flex-col items-start gap-5 mb-8">
        <ThemeToggle />
        <SidebarToggle open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

export default SideBar;
