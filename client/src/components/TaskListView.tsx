import React, { useState, useEffect, useRef } from "react";
import Card from "./Card";
import { Plus } from "lucide-react";
import taskService from "../services/taskService";
import useTaskListStore from "../store/taskListStore";
import useTaskStore from "../store/taskStore";
import type { ITask, ITaskList, ApiResponse } from "../types";

type TaskListViewProps = {
  list: ITaskList | null;
  starredTasks: string[];
};

const TaskListView: React.FC<TaskListViewProps> = ({ list, starredTasks }) => {
  const { taskLists, showAllTasks } = useTaskListStore();
  const { completedTasks, addCompletedTask, removeCompletedTask } =
    useTaskStore();
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState<"todo" | "done">("todo");
  const [taskPriority, setTaskPriority] = useState<"low" | "medium" | "high">(
    "medium"
  );
  const [taskDueDate, setTaskDueDate] = useState<string>("");
  const [selectedTaskListId, setSelectedTaskListId] = useState<string>("");
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let fetchedTasks: ITask[] = [];
        if (showAllTasks) {
          const allTasks = await Promise.all(
            taskLists.map(async (list) => {
              const res: ApiResponse<ITask[]> = await taskService.getTasks(
                list.id
              );
              return res.data;
            })
          );
          fetchedTasks = allTasks.flat();
        } else if (list?.id) {
          const res: ApiResponse<ITask[]> = await taskService.getTasks(list.id);
          fetchedTasks = res.data;
        }
        setTasks(fetchedTasks);
        fetchedTasks.forEach((task) => {
          if (task.status === "done" && !completedTasks.includes(task.id)) {
            addCompletedTask(task.id);
          }
        });
      } catch (err: unknown) {
        console.error("Failed to fetch tasks:", err);
        setTasks([]);
      }
    };

    fetchTasks();
  }, [taskLists, showAllTasks, list, addCompletedTask, completedTasks]);

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !selectedTaskListId) return;

    try {
      const taskData: Partial<ITask> = {
        title: taskTitle,
        description: taskDesc || undefined,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
      };

      const res: ApiResponse<ITask> = await taskService.createTask(
        selectedTaskListId,
        taskData
      );
      setTasks((prev) => [...prev, res.data]);
      if (res.data.status === "done") {
        addCompletedTask(res.data.id);
      }

      resetModal();
    } catch (err: unknown) {
      console.error("Failed to create task:", err);
    }
  };

  const handleUpdateTask = async () => {
    if (!taskTitle.trim() || !selectedTaskListId || !editingTaskId) return;

    try {
      const taskData: Partial<ITask> = {
        title: taskTitle,
        description: taskDesc || undefined,
        status: taskStatus,
        priority: taskPriority,
        dueDate: taskDueDate ? new Date(taskDueDate) : undefined,
      };

      const res: ApiResponse<ITask> = await taskService.updateTask(
        selectedTaskListId,
        editingTaskId,
        taskData
      );
      setTasks((prev) =>
        prev.map((task) => (task.id === editingTaskId ? res.data : task))
      );
      if (res.data.status === "done") {
        addCompletedTask(res.data.id);
      } else {
        removeCompletedTask(res.data.id);
      }

      resetModal();
    } catch (err: unknown) {
      console.error("Failed to update task:", err);
    }
  };

  const handleEditTask = (task: ITask) => {
    setModalMode("edit");
    setEditingTaskId(task.id);
    setSelectedTaskListId(task.taskListId);
    setTaskTitle(task.title);
    setTaskDesc(task.description || "");
    setTaskStatus(task.status);
    setTaskPriority(task.priority);
    setTaskDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    modalRef.current?.showModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    removeCompletedTask(taskId);
  };

  const resetModal = () => {
    setTaskTitle("");
    setTaskDesc("");
    setTaskStatus("todo");
    setTaskPriority("medium");
    setTaskDueDate("");
    setSelectedTaskListId("");
    setEditingTaskId(null);
    setModalMode("create");
    modalRef.current?.close();
  };

  const handleSubmit = () => {
    if (modalMode === "create") {
      handleCreateTask();
    } else {
      handleUpdateTask();
    }
  };

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const completedTasksList = tasks.filter((task) => task.status === "done");

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">
          {showAllTasks ? "All Tasks" : list?.title || "No List Selected"}
        </h2>
      </div>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-2 animate-fade-in">
          <h3 className="font-bold text-lg">
            {modalMode === "create" ? "Create Task" : "Edit Task"}
          </h3>
          <select
            className="select select-bordered w-full"
            value={selectedTaskListId}
            onChange={(e) => setSelectedTaskListId(e.target.value)}
            required
          >
            <option value="" disabled>
              Select Task List
            </option>
            {taskLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.title}
              </option>
            ))}
          </select>
          <input
            type="text"
            className="input input-bordered w-full text-lg"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            autoFocus
            required
          />
          <textarea
            className="textarea textarea-bordered w-full text-base"
            placeholder="Description"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            rows={2}
          />
          <select
            className="select select-bordered w-full"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value as "todo" | "done")}
          >
            <option value="todo">To Do</option>
            <option value="done">Done</option>
          </select>
          <select
            className="select select-bordered w-full"
            value={taskPriority}
            onChange={(e) =>
              setTaskPriority(e.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            className="input input-bordered w-full text-base"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
          />
          <div className="flex gap-2 mt-2">
            <button className="btn btn-primary btn-sm" onClick={handleSubmit}>
              {modalMode === "create" ? "Add" : "Save"}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={resetModal}>
              Cancel
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div className="space-y-5 pb-24">
        {tasks.length === 0 && completedTasksList.length === 0 ? (
          <div className="text-center text-gray-400">No tasks found.</div>
        ) : (
          <>
            {todoTasks.length > 0 && (
              <div className="space-y-5">
                {todoTasks.map((task: ITask) => (
                  <Card
                    key={task.id}
                    task={task}
                    allTasks={tasks}
                    starred={starredTasks.includes(task.id)}
                    onUpdateTask={handleUpdateTask}
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            )}
            {completedTasksList.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Completed Tasks
                </h3>
                <div className="space-y-5">
                  {completedTasksList.map((task: ITask) => (
                    <Card
                      key={task.id}
                      task={task}
                      allTasks={tasks}
                      starred={starredTasks.includes(task.id)}
                      onUpdateTask={handleUpdateTask}
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <button
        className="btn btn-primary btn-circle fixed bottom-10 right-10 md:bottom-16 md:right-24 shadow-xl animate-bounce"
        onClick={() => {
          setModalMode("create");
          resetModal();
          modalRef.current?.showModal();
        }}
        aria-label="Add Task"
      >
        <Plus size={28} />
      </button>
    </div>
  );
};

export default TaskListView;
