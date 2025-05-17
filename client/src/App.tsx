import { useState } from "react";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import TaskListView from "./components/TaskListView";

export type Task = {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
};

export type TaskList = {
  id: number;
  name: string;
  tasks: Task[];
};

const initialTaskLists: TaskList[] = [
  {
    id: 1,
    name: "Personal",
    tasks: [
      {
        id: 1,
        title: "Buy groceries",
        description: "Milk, Bread, Eggs",
        completed: false,
      },
      { id: 2, title: "Read a book", completed: false },
    ],
  },
  {
    id: 2,
    name: "Work",
    tasks: [
      {
        id: 3,
        title: "Finish project",
        description: "Due by Monday",
        completed: true,
      },
      { id: 4, title: "Email client", completed: false },
    ],
  },
];

const App = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>(initialTaskLists);
  const [selectedListId, setSelectedListId] = useState<number>(taskLists[0].id);

  // Add a new list
  const addTaskList = (name: string) => {
    setTaskLists((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        tasks: [],
      },
    ]);
  };

  // Add a new task to the selected list
  const addTask = (title: string, description?: string) => {
    setTaskLists((prev) =>
      prev.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: [
                ...list.tasks,
                {
                  id: Date.now(),
                  title,
                  description,
                  completed: false,
                },
              ],
            }
          : list
      )
    );
  };

  // Toggle task completion
  const toggleTask = (taskId: number) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : list
      )
    );
  };

  // Delete a task
  const deleteTask = (taskId: number) => {
    setTaskLists((prevLists) =>
      prevLists.map((list) =>
        list.id === selectedListId
          ? {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== taskId),
            }
          : list
      )
    );
  };

  // Find selected list
  const selectedList = taskLists.find((list) => list.id === selectedListId);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 text-text-primary flex flex-col">
      <Navbar />
      <div className="flex flex-1 pt-20">
        <Sidebar
          taskLists={taskLists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onAddList={addTaskList}
        />
        <main className="flex-1 p-0 md:p-8 overflow-auto min-h-[calc(100vh-5rem)] transition-all">
          <TaskListView
            list={selectedList}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </main>
      </div>
    </div>
  );
};

export default App;
