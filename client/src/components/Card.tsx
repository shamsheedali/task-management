import React, { useState } from "react";
import { Trash2, CheckCircle, Star, PlusCircle } from "lucide-react";

interface TaskCardProps {
  title: string;
  description?: string;
  completed: boolean;
  starred?: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onStar: () => void;
  onCreateSubtask: (subtaskTitle: string) => void;
  subtasks?: { id: number; title: string; completed: boolean }[];
}

const Card: React.FC<TaskCardProps> = ({
  title,
  description,
  completed,
  starred = false,
  onToggle,
  onDelete,
  onStar,
  onCreateSubtask,
  subtasks = [],
}) => {
  const [showSubtaskInput, setShowSubtaskInput] = useState(false);
  const [subtaskTitle, setSubtaskTitle] = useState("");

  const handleSubtask = () => {
    if (subtaskTitle.trim()) {
      onCreateSubtask(subtaskTitle.trim());
      setSubtaskTitle("");
      setShowSubtaskInput(false);
    }
  };

  return (
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl shadow-lg flex flex-col gap-2 w-full p-6 border border-gray-200 dark:border-neutral-700 group transition hover:shadow-2xl">
      <div className="flex items-start gap-4">
        {/* Complete/Incomplete */}
        <button
          onClick={onToggle}
          className={`h-7 w-7 flex items-center justify-center border-2 rounded-full transition-all mt-1 ${
            completed
              ? "border-primary-500 bg-primary-500"
              : "border-gray-300 bg-white group-hover:border-primary-400"
          }`}
          aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {completed ? (
            <CheckCircle className="text-white" size={22} />
          ) : (
            <div className="w-4 h-4 rounded-full bg-white" />
          )}
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <div
            className={`font-semibold text-lg truncate ${
              completed ? "line-through text-gray-400" : "text-text-primary"
            }`}
          >
            {title}
          </div>
          {description && (
            <div
              className={`text-base mt-1 ${
                completed ? "line-through text-gray-300" : "text-text-secondary"
              }`}
            >
              {description}
            </div>
          )}
        </div>

        {/* Star Button */}
        <button
          onClick={onStar}
          className="ml-2 text-yellow-400 hover:text-yellow-500 transition-colors"
          aria-label={starred ? "Unstar task" : "Star task"}
        >
          <Star size={22} fill={starred ? "currentColor" : "none"} />
        </button>
        {/* Delete Button */}
        <button
          onClick={onDelete}
          className="ml-2 text-danger-500 hover:bg-danger-100 rounded-full p-1 transition"
          aria-label="Delete task"
        >
          <Trash2 size={22} />
        </button>
      </div>

      {/* Subtask Button & Input */}
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
              onKeyDown={(e) => e.key === "Enter" && handleSubtask()}
              autoFocus
            />
            <button className="btn btn-xs btn-primary" onClick={handleSubtask}>
              Add
            </button>
          </div>
        )}
      </div>
      {/* Subtasks List */}
      {subtasks && subtasks.length > 0 && (
        <ul className="ml-8 mt-2 space-y-1">
          {subtasks.map((sub) => (
            <li
              key={sub.id}
              className={`text-sm flex items-center gap-2 ${
                sub.completed ? "line-through text-gray-400" : ""
              }`}
            >
              <CheckCircle
                size={16}
                className={sub.completed ? "text-primary-500" : "text-gray-300"}
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
