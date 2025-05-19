import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskListView from "../components/TaskListView";
import StarredTasksView from "../components/StarredTasksView";
import useTaskListStore from "../store/taskListStore";
import useTaskStore from "../store/taskStore";

const MainApp: React.FC = () => {
  const { taskLists, selectedListId, showStarredTasks } = useTaskListStore();
  const starredTasks = useTaskStore((state) => state.starredTasks);
  const selectedList =
    taskLists.find((list) => list.id === selectedListId) || null;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 text-text-primary flex flex-col">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <div className="flex flex-1 pt-20">
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <main className="flex-1 p-8 ml-0 md:ml-[20rem] overflow-auto min-h-[calc(100vh-5rem)] transition-all">
          {showStarredTasks ? (
            <StarredTasksView />
          ) : (
            <TaskListView list={selectedList} starredTasks={starredTasks} />
          )}
        </main>
      </div>
    </div>
  );
};

export default MainApp;
