import React, { useState } from "react";
import {
  ChartBar,
  CircleCheckBig,
  CirclePlus,
  List,
  Star,
} from "lucide-react";

type SidebarProps = {
  taskLists: { id: number; name: string }[];
  selectedListId: number;
  onSelectList: (id: number) => void;
  onAddList: (name: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({
  taskLists,
  selectedListId,
  onSelectList,
  onAddList,
}) => {
  const [showInput, setShowInput] = useState(false);
  const [listName, setListName] = useState("");

  const handleAddList = () => {
    if (listName.trim()) {
      onAddList(listName.trim());
      setListName("");
      setShowInput(false);
    }
  };

  return (
    <aside className="hidden md:flex flex-col gap-8 h-[calc(100vh-5rem)] w-[20rem] bg-sidebar/70 backdrop-blur-lg text-text-primary p-8 border-r border-gray-200 fixed top-20 left-0 z-40 shadow-xl rounded-tr-3xl rounded-br-3xl">
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
          {taskLists.map((list) => (
            <button
              key={list.id}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold transition ${
                selectedListId === list.id
                  ? "bg-primary-100 text-primary-700 shadow"
                  : "text-text-secondary hover:bg-primary-50 hover:text-primary-700"
              }`}
              onClick={() => onSelectList(list.id)}
            >
              <List />
              {list.name}
            </button>
          ))}
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
            <button
              className="btn btn-primary btn-sm"
              onClick={handleAddList}
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
