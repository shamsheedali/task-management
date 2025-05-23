import React, { useState } from "react";
import { Trash2, CheckCircle, Star, PlusCircle, Edit } from "lucide-react";
import { toast } from "react-toastify";
import taskService from "../services/taskService";
import useTaskStore from "../store/taskStore";
import useTeamStore from "../store/teamStore";
import useAuthStore from "../store/authStore"; // Import useAuthStore
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    addCompletedTask,
    removeCompletedTask,
    addStarredTask,
    removeStarredTask,
  } = useTaskStore();
  const { users, addNotification } = useTeamStore();
  const { user } = useAuthStore(); // Get authenticated user

  const subtasks = allTasks.filter((t) => t.parentTaskId === task.id);
  const completed = task.status === "done";
  const assignee = task.teamId
    ? users.find((u) => u.id === task.assigneeId) || null
    : null;
  const creator = task.teamId
    ? users.find((u) => u.id === task.creatorId) || null
    : null;

  // Log for debugging
  console.log("Card task:", {
    taskId: task.id,
    title: task.title,
    creatorId: task.creatorId,
    currentUserId: user?.id,
  });

  const handleToggleTask = async () => {
    try {
      const newStatus: "todo" | "done" = completed ? "todo" : "done";
      const updatedTask: Partial<ITask> = { status: newStatus };
      let res: ApiResponse<ITask>;
      if (task.teamId) {
        res = {
          status: "success",
          message: "",
          data: { ...task, status: newStatus },
        };
        if (task.teamId) {
          addNotification({
            id: `notif-${Date.now()}`,
            message: `${
              user?.id ? "You" : "User"
            } marked task as ${newStatus}: ${task.title}`,
            teamId: task.teamId,
            timestamp: new Date().toISOString(),
          });
          toast.info(
            `${user?.id ? "You" : "User"} marked task as ${newStatus}`
          );
        }
      } else {
        res = await taskService.updateTask(
          task.taskListId,
          task.id,
          updatedTask
        );
      }
      if (res.data.status === "done") {
        addCompletedTask(task.id);
      } else {
        removeCompletedTask(task.id);
      }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
      onUpdateTask(res.data);
    } catch (err: unknown) {
      console.error("Failed to toggle task status:", err);
      toast.error("Failed to update task");
    }
  };

  const handleToggleStar = async () => {
    try {
      const newStarred = !starred;
      const updatedTask: Partial<ITask> = { isStarred: newStarred };
      let res: ApiResponse<ITask>;
      if (task.teamId) {
        res = {
          status: "success",
          message: "",
          data: { ...task, isStarred: newStarred },
        };
      } else {
        res = await taskService.updateTask(
          task.taskListId,
          task.id,
          updatedTask
        );
      }
      if (newStarred) {
        addStarredTask(task.id);
      } else {
        removeStarredTask(task.id);
      }
      setTasks((prev) => prev.map((t) => (t.id === task.id ? res.data : t)));
      onUpdateTask(res.data);
    } catch (err: unknown) {
      console.error("Failed to toggle star:", err);
      toast.error("Failed to star task");
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
        teamId: task.teamId,
        creatorId: user?.id,
        userId: user?.id, // Use authenticated user ID
      };
      let res: ApiResponse<ITask>;
      if (task.teamId) {
        res = {
          status: "success",
          message: "",
          data: {
            ...subtaskData,
            id: `task-${Date.now()}`,
            taskListId: task.taskListId,
            dueDate: undefined,
          } as ITask,
        };
        if (task.teamId) {
          addNotification({
            id: `notif-${Date.now()}`,
            message: `${
              user?.id ? "You" : "User"
            } created subtask: ${subtaskTitle}`,
            teamId: task.teamId,
            timestamp: new Date().toISOString(),
          });
          toast.success("Subtask created");
        }
      } else {
        res = await taskService.createTask(task.taskListId, subtaskData);
      }
      setTasks((prev) => [...prev, res.data]);
      setSubtaskTitle("");
      setShowSubtaskInput(false);
    } catch (err: unknown) {
      console.error("Failed to create subtask:", err);
      toast.error("Failed to create subtask");
    }
  };

  const handleDeleteTask = async () => {
    if (!user?.id) {
      toast.error("You must be logged in to delete a task");
      return;
    }
    // Optionally remove creator check if backend allows any team member to delete
    if (task.teamId && task.creatorId !== user.id) {
      toast.error("Only the task creator can delete this task");
      return;
    }
    try {
      console.log("Calling onDeleteTask for task:", task.id);
      onDeleteTask(task.id);
      if (task.teamId) {
        addNotification({
          id: `notif-${Date.now()}`,
          message: `${user?.id ? "You" : "User"} deleted task: ${task.title}`,
          teamId: task.teamId,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task");
    }
    setShowDeleteConfirm(false);
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
          {task.teamId && (
            <div className="text-sm text-gray-500 mt-1">
              {assignee
                ? `Assigned to: ${assignee.username}`
                : "Assigned to: Team"}
            </div>
          )}
          {task.teamId && creator && (
            <div className="text-sm text-gray-500 mt-1">
              Created by: {creator.username}
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
          onClick={() => setShowDeleteConfirm(true)}
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

      {showDeleteConfirm && (
        <div className="modal modal-open">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl">
            <h3 className="font-bold text-lg">Confirm Delete</h3>
            <p className="py-4">
              Are you sure you want to delete "{task.title}"?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleDeleteTask}
              >
                Delete
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
