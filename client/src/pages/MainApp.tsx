import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import TaskListView from "../components/TaskListView";
import useTaskStore from "../store/taskStore";
import TaskMutations from "../mutations/TaskMutations";

const MainApp = () => {
  const {
    taskLists,
    selectedListId,
    setSelectedListId,
    addTaskList,
    updateTaskList,
    deleteTaskList,
    toggleStar,
    starredTasks,
  } = useTaskStore();

  const { addTask, updateTask, deleteTask } = TaskMutations({
    selectedListId,
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 text-text-primary flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">
        <Sidebar
          taskLists={taskLists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onAddList={addTaskList}
          onUpdateList={updateTaskList}
          onDeleteList={deleteTaskList}
        />
        <main className="flex-1 p-0 md:p-8 overflow-auto min-h-[calc(100vh-5rem)] transition-all">
          {selectedListId && (
            <TaskListView
              list={
                taskLists.find((list) => list.id === selectedListId) || null
              }
              onAddTask={(title, description, parentTaskId) => {
                addTask({
                  taskListId: selectedListId,
                  task: { title, description, status: "todo", parentTaskId },
                });
              }}
              onToggleTask={(taskId, status) => {
                updateTask({
                  taskListId: selectedListId,
                  taskId,
                  task: { status: status === "done" ? "todo" : "done" },
                });
              }}
              onDeleteTask={(taskId) => {
                deleteTask({ taskListId: selectedListId, taskId });
              }}
              onStarTask={toggleStar}
              starredTasks={starredTasks}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default MainApp;
