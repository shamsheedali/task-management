import React, { useState } from "react";
import { Trash2, CheckCircle, Star, PlusCircle, Edit } from "lucide-react";
import taskService from "../services/taskService";
import useTaskStore from "../store/taskStore";
import type { ITask, ApiResponse } from "../types";

interface TaskCardProps {
  task: ITask;
  allTasks: ITask[];
  starred: boolean;
  setTasks: React.Dispatch<React.SetStateAction<ITask[]>>;
  onUpdateTask: (updatedTask: ITask) => void;
  onEditTask: (task: ITask) => void;
  onDeleteTask: (taskId: string) => void;
}

const Card: React.FC<TaskCardProps> = ({
  task,
  allTasks,
  starred,
  setTasks,
  onUpdateTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const {
    addCompletedTask,
    removeCompletedTask,
    addStarredTask,
    removeStarredTask,
  } = useTaskStore();

  const subtasks = allTasks.filter((t) => t.parentTaskId === task.id);
  const completed = task.status === "done";

  const handleToggleTask = async () => {
    try {
      const newStatus: "todo" | "done" = completed ? "todo" : "done";
      const updatedTask: Partial<ITask> = { status: newStatus };
      const res: ApiResponse<ITask> = await taskService.updateTask(
        task.taskListId,
        task.id,
        updatedTask
      );
      if (res.data.status === "done") {
        addCompletedTask(task.id);
      } else {
        removeCompletedTask(task.id);
      }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
      onUpdateTask(res.data);
      console.log(`Task marked as ${newStatus}:`, res.data);
    } catch (err: unknown) {
      console.error("Failed to toggle task status:", err);
    }
  };

  const handleToggleStar = async () => {
    try {
      const newStarred = !starred;
      const updatedTask: Partial<ITask> = { isStarred: newStarred };
      const res: ApiResponse<ITask> = await taskService.updateTask(
        task.taskListId,
        task.id,
        updatedTask
      );
      if (newStarred) {
        addStarredTask(task.id);
      } else {
        removeStarredTask(task.id);
      }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
      onUpdateTask(res.data);
      console.log(`Task starred: ${newStarred}`, res.data);
    } catch (err: unknown) {
      console.error("Failed to toggle star:", err);
    }
  };

  const handleAddSubtask = async () => {
    if (!subtaskTitle.trim()) return;

    try {
      const subtaskData: Partial<ITask> = {
        title: subtaskTitle,
        status: "todo",
        isStarred: false,
        parentTaskId: task.id,
      };
      const res: ApiResponse<ITask> = await taskService.createTask(
        task.taskListId,
        subtaskData
      );
      setTasks((prev) => [...prev, res.data]);
      setSubtaskTitle("");
      setShowSubtaskInput(false);
      console.log(`Subtask created: ${res.data.id}`);
    } catch (err: unknown) {
      console.error("Failed to create subtask:", err);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await taskService.deleteTask(task.taskListId, task.id);
      onDeleteTask(task.id);
      console.log(`Task deleted: ${task.id}`);
    } catch (err: unknown) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div className="bg-card dark:bg-neutral-800 rounded-xl shadow-lg flex flex-col gap-2 w-full p-6 border border-gray-200 dark:border-neutral-700 group transition hover:shadow-2xl">
      <div className="flex items-start gap-4">
        <button
          className={`h-7 w-7 flex items-center justify-center border-2 rounded-full transition-all mt-1 ${
            completed
              ? "border-primary-500 bg-primary-500"
              : "border-gray-300 bg-white group-hover:border-primary-400"
          }`}
          onClick={handleToggleTask}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed ? (
            <CheckCircle className="text-white" size={22} />
          ) : (
            <div className="w-4 h-4 rounded-full bg-white" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-lg truncate ${
              completed ? "line-through text-gray-400" : "text-text-primary"
            }`}
          >
            {task.title}
          </div>
          {task.description && (
            <div
              className={`text-base mt-1 ${
                completed ? "line-through text-gray-300" : "text-text-secondary"
              }`}
            >
              {task.description}
            </div>
          )}
          {task.dueDate && (
            <div className="text-sm text-gray-500 mt-1">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>

        <button
          className="ml-2 text-yellow-400 hover:text-yellow-500 transition-colors cursor-pointer"
          onClick={handleToggleStar}
          aria-label={starred ? "Unstar task" : "Star task"}
        >
          <Star size={22} fill={starred ? "currentColor" : "none"} />
        </button>
        <button
          className="ml-2 text-blue-500 hover:bg-blue-100 rounded-full p-1 transition cursor-pointer"
          onClick={() => onEditTask(task)}
          aria-label="Edit task"
        >
          <Edit size={22} />
        </button>
        <button
          className="ml-2 text-danger-500 hover:bg-danger-100 rounded-full p-1 transition cursor-pointer"
          onClick={handleDeleteTask}
          aria-label="Delete task"
        >
          <Trash2 size={22} />
        </button>
      </div>

      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => setShowSubtaskInput((v) => !v)}
          className="btn btn-xs btn-ghost text-primary-500 hover:bg-primary-100"
          aria-label="Create subtask"
        >
          <PlusCircle size={18} className="mr-1" />
          Subtask
        </button>
        {showSubtaskInput && (
          <div className="flex gap-2 items-center ml-2">
            <input
              type="text"
              className="input input-xs input-bordered"
              placeholder="Subtask title"
              value={subtaskTitle}
              onChange={(e) => setSubtaskTitle(e.target.value)}
              autoFocus
            />
            <button
              className="btn btn-xs btn-primary"
              onClick={handleAddSubtask}
            >
              Add
            </button>
          </div>
        )}
      </div>
      {subtasks.length > 0 && (
        <ul className="ml-8 mt-2 space-y-1">
          {subtasks.map((sub) => (
            <li
              key={sub.id}
              className={`text-sm flex items-center gap-2 ${
                sub.status === "done" ? "line-through text-gray-400" : ""
              }`}
            >
              <CheckCircle
                size={16}
                className={
                  sub.status === "done" ? "text-primary-500" : "text-gray-300"
                }
              />
              {sub.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Card;
