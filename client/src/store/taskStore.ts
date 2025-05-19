import { create } from "zustand";

interface TaskStore {
  selectedListId: string | null;
  starredTasks: string[];
  completedTasks: string[];
  setSelectedListId: (id: string | null) => void;
  toggleStar: (taskId: string) => void;
  addCompletedTask: (taskId: string) => void;
  removeCompletedTask: (taskId: string) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  selectedListId: null,
  starredTasks: [],
  completedTasks: [],
  setSelectedListId: (id) => set({ selectedListId: id }),
  toggleStar: (taskId) =>
    set((state) => ({
      starredTasks: state.starredTasks.includes(taskId)
        ? state.starredTasks.filter((id) => id !== taskId)
        : [...state.starredTasks, taskId],
    })),
  addCompletedTask: (taskId) =>
    set((state) => ({
      completedTasks: state.completedTasks.includes(taskId)
        ? state.completedTasks
        : [...state.completedTasks, taskId],
    })),
  removeCompletedTask: (taskId) =>
    set((state) => ({
      completedTasks: state.completedTasks.filter((id) => id !== taskId),
    })),
}));

export default useTaskStore;
