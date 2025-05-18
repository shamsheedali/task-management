import api from '../api';
import type { ApiResponse, ITaskList } from '../types';

const taskListService = {
  getTaskLists: async (): Promise<ApiResponse<ITaskList[]>> => {
    const response = await api.get('/tasklist');
    return response.data;
  },

  createTaskList: async (title: string): Promise<ApiResponse<ITaskList>> => {
    const response = await api.post('/tasklist', { title });
    return response.data;
  },

  updateTaskList: async (
    id: string,
    title: string
  ): Promise<ApiResponse<ITaskList>> => {
    const response = await api.patch(`/tasklist/${id}`, { title });
    return response.data;
  },

  deleteTaskList: async (id: string): Promise<ApiResponse<null>> => {
    const response = await api.delete(`/tasklist/${id}`);
    return response.data;
  },
};

export default taskListService;