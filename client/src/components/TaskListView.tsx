import React, { useState } from "react";
import Card from "./Card";
import { Plus } from "lucide-react";
import type { Task } from "../App";

type TaskListViewProps = {
  list?: {
    id: number;
    name: string;
    tasks: Task[];
  };
  onAddTask: (title: string, description?: string) => void;
  onToggleTask: (taskId: number) => void;
  onDeleteTask: (taskId: number) => void;
};

const TaskListView: React.FC<TaskListViewProps> = ({
  list,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

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

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">{list.name}</h2>
      </div>
      {showInput && (
        <div className="mb-4 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl flex flex-col gap-2 animate-fade-in">
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
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddTask}
            >
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
        {list.tasks.length === 0 ? (
          <div className="text-center text-gray-400">No tasks found.</div>
        ) : (
          list.tasks.map((task) => (
            <Card
              key={task.id}
              title={task.title}
              description={task.description}
              completed={task.completed}
              onToggle={() => onToggleTask(task.id)}
              onDelete={() => onDeleteTask(task.id)}
            />
          ))
        )}
      </div>
      {/* Floating Add Task Button */}
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
