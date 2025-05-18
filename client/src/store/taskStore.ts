import { create } from "zustand";

interface TaskStore {
  selectedListId: string | null;
  starredTasks: string[];
  setSelectedListId: (id: string | null) => void;
  toggleStar: (taskId: string) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  selectedListId: null,
  starredTasks: [],
  setSelectedListId: (id) => set({ selectedListId: id }),
  toggleStar: (taskId) =>
    set((state) => ({
      starredTasks: state.starredTasks.includes(taskId)
        ? state.starredTasks.filter((id) => id !== taskId)
        : [...state.starredTasks, taskId],
    })),
}));

export default useTaskStore;