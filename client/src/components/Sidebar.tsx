import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
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
import useTaskStore from "../store/taskStore";
import type { ITaskList, ApiResponse } from "../types";

type SidebarProps = {
  taskLists: ITaskList[];
  selectedListId: string | null;
  onSelectList: (id: string) => void;
  onAddList: (taskList: ITaskList) => void;
  onUpdateList: (id: string, title: string) => void;
  onDeleteList: (id: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  taskLists,
  selectedListId,
  onSelectList,
  onAddList,
  onUpdateList,
  onDeleteList,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [listName, setListName] = useState("");
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const { data: taskListsResponse, isLoading } = useQuery<
    ApiResponse<ITaskList[]>,
    Error
  >({
    queryKey: ["taskLists"],
    queryFn: taskListService.getTaskLists,
  });

  useEffect(() => {
    if (taskListsResponse?.data) {
      useTaskStore.getState().setTaskLists(taskListsResponse.data);
    }
  }, [taskListsResponse]);

  const handleAddList = async () => {
    if (listName.trim()) {
      try {
        const response = await taskListService.createTaskList(listName.trim());
        console.log("create tasklist response", response);
        onAddList(response.data);
        setListName("");
        setShowInput(false);
      } catch (error) {
        console.error("Failed to add task list:", error);
      }
    }
  };

  const handleEditList = (id: string, currentName: string) => {
    setEditingListId(id);
    setEditName(currentName);
  };

  const handleUpdateList = async (id: string) => {
    if (editName.trim()) {
      try {
        await onUpdateList(id, editName.trim());
        setEditingListId(null);
        setEditName("");
      } catch (error) {
        console.error("Failed to update task list:", error);
      }
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
          <button className="flex items-center gap-2 text-text-secondary hover:text-primary-500 transition font-medium">
            <CircleCheckBig />
            All tasks
          </button>
          <button className="flex items-center gap-2 text-text-secondary hover:text-primary-500 transition font-medium">
            <Star />
            Starred
          </button>
        </div>
        <div className="uppercase text-xs text-text-secondary font-bold mb-2 tracking-widest">
          My Lists
        </div>
        <div className="flex flex-col gap-1">
          {isLoading ? (
            <div className="text-center text-gray-400">Loading lists...</div>
          ) : taskLists.length === 0 ? (
            <div className="text-center text-gray-400">No lists found.</div>
          ) : (
            taskLists.map((list) => (
              <div key={list.id} className="flex items-center gap-2 group">
                {editingListId === list.id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => handleUpdateList(list.id)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleUpdateList(list.id)
                    }
                    className="flex-1 p-2 border rounded"
                    autoFocus
                  />
                ) : (
                  <button
                    className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold transition ${
                      selectedListId === list.id
                        ? "bg-primary-100 text-primary-700 shadow"
                        : "text-text-secondary hover:bg-primary-50 hover:text-primary-700"
                    }`}
                    onClick={() => onSelectList(list.id)}
                  >
                    <List />
                    {list.title}
                  </button>
                )}
                <button
                  onClick={() => handleEditList(list.id, list.title)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => onDeleteList(list.id)}
                  className="text-red-500 hover:text-red-700"
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
            onKeyDown={(e) => e.key === "Enter" && handleAddList()}
            autoFocus
          />
          <div className="flex gap-2">
            <button className="btn btn-primary btn-sm" onClick={handleAddList}>
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
