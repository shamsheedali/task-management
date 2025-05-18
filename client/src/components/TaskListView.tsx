import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Card from "./Card";
import { Plus } from "lucide-react";
import taskService from "../services/taskService";
import type { ITask, ITaskList, ApiResponse } from "../types";

type TaskListViewProps = {
  list: ITaskList | null;
  onAddTask: (
    title: string,
    description?: string,
    parentTaskId?: string
  ) => void;
  onToggleTask: (taskId: string, status: ITask["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onStarTask: (taskId: string) => void;
  starredTasks: string[];
};

const TaskListView: React.FC<TaskListViewProps> = ({
  list,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onStarTask,
  starredTasks,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  const { data: tasksResponse, isLoading } = useQuery<
    ApiResponse<ITask[]>,
    Error
  >({
    queryKey: ["tasks", list?.id],
    queryFn: () => taskService.getTasks(list!.id),
    enabled: !!list?.id,
  });

  const handleAddTask = () => {
    if (taskTitle.trim()) {
      onAddTask(taskTitle.trim(), taskDesc.trim() || undefined);
      setTaskTitle("");
      setTaskDesc("");
      setShowInput(false);
    }
  };

  if (!list) {
    return <div className="text-center text-gray-400">No List Selected</div>;
  }

  const topLevelTasks = (tasksResponse?.data || []).filter(
    (task: ITask) => !task.parentTaskId
  );

  console.log("first", list);
  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">{list.title}</h2>
      </div>
      {showInput && (
        <div className="mb-4 bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-2 animate-fade-in">
          <input
            type="text"
            className="input input-bordered w-full text-lg"
            placeholder="Task title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            autoFocus
          />
          <textarea
            className="textarea textarea-bordered w-full text-base"
            placeholder="Description (optional)"
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            rows={2}
          />
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleAddTask}>
              Add
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="space-y-5 pb-24">
        {isLoading ? (
          <div className="text-center text-gray-400">Loading tasks...</div>
        ) : topLevelTasks.length === 0 ? (
          <div className="text-center text-gray-400">No tasks found.</div>
        ) : (
          topLevelTasks.map((task: ITask) => (
            <Card
              key={task.id}
              task={task}
              allTasks={tasksResponse?.data || []}
              onToggle={() => onToggleTask(task.id, task.status)}
              onDelete={() => onDeleteTask(task.id)}
              onStar={() => onStarTask(task.id)}
              onCreateSubtask={(title) => onAddTask(title, undefined, task.id)}
              starred={starredTasks.includes(task.id)}
            />
          ))
        )}
      </div>
      {!showInput && (
        <button
          className="btn btn-primary btn-circle fixed bottom-10 right-10 md:bottom-16 md:right-24 shadow-xl animate-bounce"
          onClick={() => setShowInput(true)}
          aria-label="Add Task"
        >
          <Plus size={28} />
        </button>
      )}
    </div>
  );
};

export default TaskListView;
