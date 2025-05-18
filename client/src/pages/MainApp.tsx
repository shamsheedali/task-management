import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskListView from "../components/TaskListView";
import useTaskListStore from "../store/taskListStore";

const MainApp = () => {
  const { taskLists, selectedListId } = useTaskListStore();
  const selectedList =
    taskLists.find((list) => list.id === selectedListId) || null;
  const starredTasks = selectedList?.tasks
    ? selectedList.tasks
        .filter((task) => task.priority === "high")
        .map((task) => task.id)
    : [];

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 text-text-primary flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">
        <Sidebar />
        <main className="flex-1 p-0 md:p-8 overflow-auto min-h-[calc(100vh-5rem)] transition-all">
          <TaskListView list={selectedList} starredTasks={starredTasks} />
        </main>
      </div>
    </div>
  );
};

export default MainApp;
