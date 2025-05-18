import { create } from "zustand";
import type { ITaskList, ITask } from "../types";

interface TaskListStore {
  taskLists: ITaskList[];
  selectedListId: string | null;
  showAllTasks: boolean;
  setTaskLists: (taskLists: ITaskList[]) => void;
  setSelectedListId: (listId: string | null) => void;
  setShowAllTasks: (show: boolean) => void;
  addTask: (taskListId: string, task: ITask) => void;
  updateTaskList: (listId: string, updatedList: ITaskList) => void;
  deleteTaskList: (listId: string) => void;
}

const useTaskListStore = create<TaskListStore>((set) => ({
  taskLists: [],
  selectedListId: null,
  showAllTasks: false,
  setTaskLists: (taskLists) => set({ taskLists }),
  setSelectedListId: (listId) =>
    set({ selectedListId: listId, showAllTasks: false }),
  setShowAllTasks: (show) =>
    set((state) => ({
      showAllTasks: show,
      selectedListId: show ? null : state.selectedListId,
    })),
  addTask: (taskListId, task) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === taskListId
          ? { ...list, tasks: [...(list.tasks || []), task] }
          : list
      ),
    })),
  updateTaskList: (listId, updatedList) =>
    set((state) => ({
      taskLists: state.taskLists.map((list) =>
        list.id === listId ? { ...list, ...updatedList } : list
      ),
    })),
  deleteTaskList: (listId) =>
    set((state) => ({
      taskLists: state.taskLists.filter((list) => list.id !== listId),
      selectedListId:
        state.selectedListId === listId ? null : state.selectedListId,
    })),
}));

export default useTaskListStore;
