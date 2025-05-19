import React from "react";
import Card from "./Card";
import useTaskListStore from "../store/taskListStore";
import useTaskStore from "../store/taskStore";
import type { ITask } from "../types";
import taskService from "../services/taskService";

const StarredTasksView: React.FC = () => {
  const { taskLists } = useTaskListStore();
  const { starredTasks, removeCompletedTask } = useTaskStore();

  const tasks = taskLists
    .flatMap((list) => list.tasks || [])
    .filter((task) => starredTasks.includes(task.id));

  const handleEditTask = (task: ITask) => {
    // Editing handled in Card, triggers TaskListView modal
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        await taskService.deleteTask(task.taskListId, taskId);
        removeCompletedTask(taskId);
        // TaskListView updates tasks via onDeleteTask
      }
    } catch (err: unknown) {
      console.error("Failed to delete task:", err);
    }
  };

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const completedTasksList = tasks.filter((task) => task.status === "done");

  return (
    <div className="max-w-2xl mx-auto relative">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-extrabold tracking-tight">
          Starred Tasks
        </h2>
      </div>
      <div className="space-y-5 pb-24">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-400">
            No starred tasks found.
          </div>
        ) : (
          <>
            {todoTasks.length > 0 && (
              <div className="space-y-5">
                {todoTasks.map((task: ITask) => (
                  <Card
                    key={task.id}
                    task={task}
                    allTasks={tasks}
                    starred={starredTasks.includes(task.id)}
                    setTasks={() => {}} // No setTasks needed, handled by TaskListView
                    onUpdateTask={() => {}} // Handled by Card
                    onEditTask={handleEditTask}
                    onDeleteTask={handleDeleteTask}
                  />
                ))}
              </div>
            )}
            {completedTasksList.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  Completed Tasks
                </h3>
                <div className="space-y-5">
                  {completedTasksList.map((task: ITask) => (
                    <Card
                      key={task.id}
                      task={task}
                      allTasks={tasks}
                      starred={starredTasks.includes(task.id)}
                      setTasks={() => {}} // No setTasks needed, handled by TaskListView
                      onUpdateTask={() => {}} // Handled by Card
                      onEditTask={handleEditTask}
                      onDeleteTask={handleDeleteTask}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StarredTasksView;
