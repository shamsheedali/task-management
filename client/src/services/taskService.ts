import api from "../api";
import type { ApiResponse, ITask } from "../types";

const taskService = {
  getTasks: async (taskListId: string): Promise<ApiResponse<ITask[]>> => {
    const response = await api.get(`/tasklist/${taskListId}/tasks`);
    return response.data;
  },

  createTask: async (
    taskListId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.post(`/tasklist/${taskListId}/tasks`, task);
    return response.data;
  },

  updateTask: async (
    taskListId: string,
    taskId: string,
    task: Partial<ITask>
  ): Promise<ApiResponse<ITask>> => {
    const response = await api.patch(
      `/tasklist/${taskListId}/tasks/${taskId}`,
      task
    );
    return response.data;
  },

  deleteTask: async (
    taskListId: string,
    taskId: string
  ): Promise<ApiResponse<null>> => {
    const response = await api.delete(
      `/tasklist/${taskListId}/tasks/${taskId}`
    );
    return response.data;
  },
};

export default taskService;
