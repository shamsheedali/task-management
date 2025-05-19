import React, { useEffect, useState } from "react";
import {
  ChartBar,
  CircleCheckBig,
  CirclePlus,
  List,
  Star,
  Edit,
  Trash2,
} from "lucide-react";
import taskListService from "../services/taskListService";
import useTaskListStore from "../store/taskListStore";
import type { ITaskList, ApiResponse } from "../types";

const Sidebar: React.FC = () => {
  const {
    taskLists,
    selectedListId,
    showAllTasks,
    showStarredTasks,
    setTaskLists,
    setSelectedListId,
    setShowAllTasks,
    setShowStarredTasks,
    updateTaskList,
    deleteTaskList,
  } = useTaskListStore();
  const [showInput, setShowInput] = useState(false);
  const [listName, setListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskLists = async () => {
      try {
        const res: ApiResponse<ITaskList[]> =
          await taskListService.getTaskLists();
        setTaskLists(res.data);
      } catch (err: unknown) {
        console.error("Failed to fetch task lists:", err);
        setTaskLists([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskLists();
  }, []); // Empty dependency array to run only on mount

  const handleCreateTaskList = async () => {
    if (listName.trim()) {
      try {
        const res: ApiResponse<ITaskList> =
          await taskListService.createTaskList(listName);
        setTaskLists([...taskLists, res.data]);
        setListName("");
        setShowInput(false);
      } catch (err: unknown) {
        console.error("Failed to create task list:", err);
      }
    }
  };

  const handleUpdateTaskList = async (listId: string) => {
    if (editName.trim()) {
      try {
        const res: ApiResponse<ITaskList> =
          await taskListService.updateTaskList(listId, editName);
        updateTaskList(listId, res.data);
        setEditingListId(null);
        setEditName("");
      } catch (err: unknown) {
        console.error("Failed to update task list:", err);
      }
    }
  };

  const handleDeleteTaskList = async (listId: string) => {
    try {
      await taskListService.deleteTaskList(listId);
      deleteTaskList(listId);
    } catch (err: unknown) {
      console.error("Failed to delete task list:", err);
    }
  };

  return (
    <aside className="hidden md:flex flex-col gap-8 h-[calc(100vh-5rem)] w-[20rem] bg-sidebar/80 backdrop-blur-lg text-text-primary p-8 border-r border-gray-200 fixed top-20 left-0 z-40 shadow-xl rounded-tr-3xl rounded-br-3xl">
      <button
        className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-semibold transition shadow-lg"
        onClick={() => setShowInput(true)}
      >
        <CirclePlus />
        New List
      </button>
      <div>
        <div className="space-y-2 mb-6">
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${
              showAllTasks && !showStarredTasks
                ? "bg-primary-100 text-primary-700 shadow"
                : "text-text-secondary hover:bg-primary-50 hover:text-primary-500"
            }`}
            onClick={() => {
              setShowAllTasks(true);
              setShowStarredTasks(false);
              setSelectedListId(null);
            }}
          >
            <CircleCheckBig />
            All tasks
          </button>
          <button
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition font-medium ${
              showStarredTasks
                ? "bg-primary-100 text-primary-700 shadow"
                : "text-text-secondary hover:bg-primary-50 hover:text-primary-500"
            }`}
            onClick={() => {
              setShowAllTasks(false);
              setShowStarredTasks(true);
              setSelectedListId(null);
            }}
          >
            <Star />
            Starred
          </button>
        </div>
        <div className="uppercase text-xs text-text-secondary font-bold mb-2 tracking-widest">
          My Lists
        </div>
        <div className="flex flex-col gap-1">
          {loading ? (
            <h1>Loading...</h1>
          ) : taskLists.length === 0 ? (
            <div className="text-center text-gray-400">No lists found.</div>
          ) : (
            taskLists.map((list: ITaskList) => (
              <div key={list.id} className="flex items-center gap-2 group">
                {editingListId === list.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleUpdateTaskList(list.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleUpdateTaskList(list.id)
                    }
                    className="flex-1 p-2 border rounded"
                    autoFocus
                  />
                ) : (
                  <button
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold transition ${
                      selectedListId === list.id && !showStarredTasks
                        ? "bg-primary-100 text-primary-700 shadow"
                        : "text-text-secondary hover:bg-primary-50 hover:text-primary-700"
                    }`}
                    onClick={() => {
                      setSelectedListId(list.id);
                      setShowAllTasks(false);
                      setShowStarredTasks(false);
                    }}
                  >
                    <List />
                    {list.title}
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingListId(list.id);
                    setEditName(list.title);
                  }}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteTaskList(list.id)}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {showInput && (
        <div className="mt-4 flex flex-col gap-2 animate-fade-in">
          <input
            type="text"
            className="input input-bordered w-full text-base"
            placeholder="List name"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              className="btn btn-primary btn-sm"
              onClick={handleCreateTaskList}
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
      <div className="mt-auto pt-8 border-t border-gray-200">
        <button className="flex items-center gap-2 text-text-secondary hover:text-primary-500 transition font-medium">
          <ChartBar />
          Stats
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
