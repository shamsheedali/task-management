import { create } from "zustand";
import type { ITask } from "../types";

interface TeamTaskStore {
  tasks: ITask[];
  setTasks: (tasks: ITask[]) => void;
  addTask: (task: ITask) => void;
  updateTask: (task: ITask) => void;
  removeTask: (taskId: string) => void;
}

const useTeamTaskStore = create<TeamTaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({
      tasks: state.tasks.some((t) => t.id === task.id)
        ? state.tasks
        : [...state.tasks, task],
    })),
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
    })),
  removeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),
}));

export default useTeamTaskStore;
