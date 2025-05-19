import { create } from "zustand";
import type { ITaskList, ITask } from "../types";

interface TaskListStore {
  taskLists: ITaskList[];
  selectedListId: string | null;
  showAllTasks: boolean;
  showStarredTasks: boolean;
  setTaskLists: (lists: ITaskList[]) => void;
  setSelectedListId: (id: string | null) => void;
  setShowAllTasks: (show: boolean) => void;
  setShowStarredTasks: (show: boolean) => void;
  updateTaskList: (id: string, updatedList: ITaskList) => void;
  deleteTaskList: (id: string) => void;
  updateTasksInList: (taskListId: string, tasks: ITask[]) => void;
}

const useTaskListStore = create<TaskListStore>((set) => ({
  taskLists: [],
  selectedListId: null,
  showAllTasks: false,
  showStarredTasks: false,
  setTaskLists: (lists) => set({ taskLists: lists }),
  setSelectedListId: (id) => set({ selectedListId: id }),
  setShowAllTasks: (show) => set({ showAllTasks: show }),
  setShowStarredTasks: (show) => set({ showStarredTasks: show }),
  updateTaskList: (id, updatedList) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === id ? updatedList : list
      ),
    })),
  deleteTaskList: (id) =>
    set((state) => ({
      taskLists: state.taskLists.filter((list) => list.id !== id),
    })),
  updateTasksInList: (taskListId, tasks) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === taskListId ? { ...list, tasks } : list
      ),
    })),
}));

export default useTaskListStore;
