import { useMutation, useQueryClient } from "@tanstack/react-query";
import useTaskStore from "../store/taskStore";
import taskService from "../services/taskService";
import type { ITask, ApiResponse } from "../types";

interface TaskMutationsProps {
  selectedListId: string | null;
}

const TaskMutations = ({ selectedListId }: TaskMutationsProps) => {
  const queryClient = useQueryClient();

  const addTaskMutation = useMutation({
    mutationFn: ({
      taskListId,
      task,
    }: {
      taskListId: string;
      task: Partial<ITask>;
    }) => taskService.createTask(taskListId, task),
    onSuccess: (response: ApiResponse<ITask>, { taskListId }) => {
      if (taskListId === selectedListId) {
        useTaskStore.setState((state) => ({
          taskLists: state.taskLists.map((tl) =>
            tl.id === taskListId
              ? { ...tl, tasks: [...(tl.tasks || []), response.data] }
              : tl
          ),
        }));
      }
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskListId],
      });
    },
    onError: (error) => {
      console.error("Failed to add task:", error);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({
      taskListId,
      taskId,
      task,
    }: {
      taskListId: string;
      taskId: string;
      task: Partial<ITask>;
    }) => taskService.updateTask(taskListId, taskId, task),
    onSuccess: (response: ApiResponse<ITask>, { taskListId }) => {
      if (taskListId === selectedListId) {
        useTaskStore.setState((state) => ({
          taskLists: state.taskLists.map((tl) =>
            tl.id === taskListId
              ? {
                  ...tl,
                  tasks: (tl.tasks || []).map((task) =>
                    task.id === response.data.id ? response.data : task
                  ),
                }
              : tl
          ),
        }));
      }
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskListId],
      });
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: ({
      taskListId,
      taskId,
    }: {
      taskListId: string;
      taskId: string;
    }) => taskService.deleteTask(taskListId, taskId),
    onSuccess: (_, { taskListId, taskId }) => {
      if (taskListId === selectedListId) {
        useTaskStore.setState((state) => ({
          taskLists: state.taskLists.map((tl) =>
            tl.id === taskListId
              ? {
                  ...tl,
                  tasks: (tl.tasks || []).filter((task) => task.id !== taskId),
                }
              : tl
          ),
        }));
      }
      queryClient.invalidateQueries({
        queryKey: ["tasks", taskListId],
      });
    },
    onError: (error) => {
      console.error("Failed to delete task:", error);
    },
  });

  return {
    addTask: addTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
  };
};

export default TaskMutations;
