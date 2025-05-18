import { create } from "zustand";
import type { ITaskList } from "../types";

interface TaskStore {
  taskLists: ITaskList[];
  selectedListId: string | null;
  starredTasks: string[];
  setTaskLists: (taskLists: ITaskList[]) => void;
  addTaskList: (taskList: ITaskList) => void;
  updateTaskList: (id: string, title: string) => void;
  deleteTaskList: (id: string) => void;
  setSelectedListId: (id: string | null) => void;
  toggleStar: (taskId: string) => void;
}

const useTaskStore = create<TaskStore>((set) => ({
  taskLists: [],
  selectedListId: null,
  starredTasks: [],
  setTaskLists: (taskLists) => set({ taskLists }),
  addTaskList: (taskList) =>
    set((state) => ({
      taskLists: [...state.taskLists, taskList],
      selectedListId: taskList.id,
    })),
  updateTaskList: (id, title) =>
    set((state) => ({
      taskLists: state.taskLists.map((tl) =>
        tl.id === id ? { ...tl, title } : tl
      ),
    })),
  deleteTaskList: (id) =>
    set((state) => ({
      taskLists: state.taskLists.filter((tl) => tl.id !== id),
      selectedListId:
        state.selectedListId === id
          ? state.taskLists[0]?.id || null
          : state.selectedListId,
    })),
  setSelectedListId: (id) => set({ selectedListId: id }),
  toggleStar: (taskId) =>
    set((state) => ({
      starredTasks: state.starredTasks.includes(taskId)
        ? state.starredTasks.filter((id) => id !== taskId)
        : [...state.starredTasks, taskId],
    })),
}));

export default useTaskStore;
