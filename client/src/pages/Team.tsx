import React, { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, Mail, LogOut } from "lucide-react";
import { toast } from "react-toastify";
import useTeamStore from "../store/teamStore";
import MemberCard from "../components/MemberCard";
import Card from "../components/Card";
import InputField from "../components/InputField";
import Navbar from "../components/Navbar";
import type { ITask, User } from "../types";

const Team: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const {
    teams,
    users,
    teamTasks,
    addTeamTask,
    updateTeamTask,
    deleteTeamTask,
    addInvite,
    addNotification,
    leaveTeam,
  } = useTeamStore();
  const [activeTab, setActiveTab] = useState<"tasks" | "members">("tasks");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskStatus, setTaskStatus] = useState<"todo" | "done">("todo");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showLeaveConfirm, setShowLeaveConfirm] = useState(false);
  const taskModalRef = useRef<HTMLDialogElement>(null);
  const inviteModalRef = useRef<HTMLDialogElement>(null);
  const leaveModalRef = useRef<HTMLDialogElement>(null);
  const currentUserId = "user1"; // Dummy current user

  const team = teams.find((t) => t.id === teamId);
  const tasks = teamTasks.filter((t) => t.teamId === teamId);
  const todoTasks = tasks.filter((t) => t.status === "todo");
  const completedTasks = tasks.filter((t) => t.status === "done");
  const isCreator = team?.creatorId === currentUserId;

  const handleCreateTask = () => {
    if (!taskTitle.trim()) {
      toast.error("Task title is required", { toastId: "task-title-error" });
      return;
    }
    const newTask: ITask = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      description: taskDesc || "",
      status: taskStatus,
      dueDate: taskDueDate ? taskDueDate : undefined,
      teamId: teamId!,
      assigneeId,
      creatorId: currentUserId,
      userId: currentUserId,
      isStarred: false,
      taskListId: "",
    };
    addTeamTask(newTask);
    addNotification({
      id: `notif-${Date.now()}`,
      message: `${
        currentUserId === "user1" ? "You" : "User"
      } created task: ${taskTitle}`,
      teamId: teamId!,
      timestamp: new Date().toISOString(),
    });
    toast.success("Task created");
    resetTaskModal();
  };

  const handleEditTask = (task: ITask) => {
    setTaskTitle(task.title);
    setTaskDesc(task.description || "");
    setTaskStatus(task.status);
    setTaskDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
    );
    setAssigneeId(task.assigneeId ?? null);
    taskModalRef.current?.showModal();
  };

  const handleUpdateTask = (taskId: string, updatedTask: ITask) => {
    updateTeamTask(taskId, updatedTask);
    addNotification({
      id: `notif-${Date.now()}`,
      message: `${currentUserId === "user1" ? "You" : "User"} updated task: ${
        updatedTask.title
      }`,
      teamId: teamId!,
      timestamp: new Date().toISOString(),
    });
    toast.success("Task updated");
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTeamTask(taskId);
  };

  const handleInvite = () => {
    if (
      !inviteEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)
    ) {
      toast.error("Valid email is required", { toastId: "invite-email-error" });
      return;
    }
    const invite = {
      code: `inv-${Date.now()}`,
      email: inviteEmail,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
    addInvite(teamId!, invite);
    addNotification({
      id: `notif-${Date.now()}`,
      message: `${
        currentUserId === "user1" ? "You" : "User"
      } invited ${inviteEmail} to the team`,
      teamId: teamId!,
      timestamp: new Date().toISOString(),
    });
    toast.success("Invite sent");
    setInviteEmail("");
    inviteModalRef.current?.close();
  };

  const handleLeaveTeam = () => {
    leaveTeam(teamId!, currentUserId);
    addNotification({
      id: `notif-${Date.now()}`,
      message: `${
        currentUserId === "user1" ? "You" : "User"
      } left the team`,
      teamId: teamId!,
      timestamp: new Date().toISOString(),
    });
    toast.success("You have left the team");
    setShowLeaveConfirm(false);
    leaveModalRef.current?.close();
    navigate("/teams");
  };

  const resetTaskModal = () => {
    setTaskTitle("");
    setTaskDesc("");
    setTaskStatus("todo");
    setTaskDueDate("");
    setAssigneeId(null);
    taskModalRef.current?.close();
  };

  if (!team || !team.members.includes(currentUserId)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
        <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="pt-28 p-8 text-center flex-1">
          <h1 className="text-2xl font-bold text-text-primary">
            {team ? "You are not a member of this team" : "Team not found"}
          </h1>
          <Link to="/teams" className="btn btn-primary mt-4">
            Back to Teams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-primary-50 to-secondary-500/10 flex flex-col">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="pt-28 p-8 flex-1">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link to="/teams" className="text-primary-500 hover:underline">
                Teams
              </Link>
              <span className="mx-2">/</span>
              <h1 className="inline text-3xl font-extrabold tracking-tight text-text-primary">
                {team.name}
              </h1>
            </div>
            <button
              className="btn btn-primary flex items-center gap-2"
              onClick={() => taskModalRef.current?.showModal()}
            >
              <Plus size={20} />
              Add Task
            </button>
          </div>

          <div className="tabs mb-6">
            <button
              className={`tab tab-lifted ${
                activeTab === "tasks" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </button>
            <button
              className={`tab tab-lifted ${
                activeTab === "members" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("members")}
            >
              Members
            </button>
          </div>

          {activeTab === "tasks" && (
            <div className="space-y-5 pb-24">
              {tasks.length === 0 ? (
                <div className="text-center text-gray-400">No tasks found.</div>
              ) : (
                <>
                  {todoTasks.length > 0 && (
                    <div className="space-y-5">
                      {todoTasks.map((task) => (
                        <Card
                          key={task.id}
                          task={task}
                          allTasks={tasks}
                          starred={task.isStarred}
                          setTasks={() => {}} // Empty function, updates handled by useTeamStore
                          onUpdateTask={(updatedTask) =>
                            handleUpdateTask(task.id, updatedTask)
                          }
                          onEditTask={handleEditTask}
                          onDeleteTask={handleDeleteTask}
                        />
                      ))}
                    </div>
                  )}
                  {completedTasks.length > 0 && (
                    <div className="mt-8">
                      <h3 className="text-lg font-bold text-text-primary mb-4">
                        Completed Tasks
                      </h3>
                      <div className="space-y-5">
                        {completedTasks.map((task) => (
                          <Card
                            key={task.id}
                            task={task}
                            allTasks={tasks}
                            starred={task.isStarred}
                            setTasks={() => {}} // Empty function, updates handled by useTeamStore
                            onUpdateTask={(updatedTask) =>
                              handleUpdateTask(task.id, updatedTask)
                            }
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
          )}

          {activeTab === "members" && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button
                  className="btn btn-primary flex items-center gap-2"
                  onClick={() => inviteModalRef.current?.showModal()}
                >
                  <Mail size={20} />
                  Invite Member
                </button>
                {!isCreator && (
                  <button
                    className="btn btn-danger flex items-center gap-2"
                    onClick={() => {
                      setShowLeaveConfirm(true);
                      leaveModalRef.current?.showModal();
                    }}
                  >
                    <LogOut size={20} />
                    Leave Team
                  </button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {team.members.map((memberId) => {
                  const user = users.find((u) => u.id === memberId);
                  return user ? (
                    <MemberCard
                      key={user.id}
                      user={user}
                      isCreator={user.id === team.creatorId}
                    />
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        <dialog ref={taskModalRef} className="modal">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
            <h3 className="font-bold text-lg">Create Task</h3>
            <InputField
              type="text"
              placeholder="Task title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              autoFocus
            />
            <textarea
              className="textarea textarea-bordered w-full text-base"
              placeholder="Description"
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              rows={2}
            />
            <select
              className="select select-bordered w-full"
              value={taskStatus}
              onChange={(e) => setTaskStatus(e.target.value as "todo" | "done")}
            >
              <option value="todo">To Do</option>
              <option value="done">Done</option>
            </select>
            <InputField
              type="date"
              placeholder="Due date"
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <select
              className="select select-bordered w-full"
              value={assigneeId ?? ""}
              onChange={(e) => setAssigneeId(e.target.value || null)}
            >
              <option value="">Team</option>
              {team.members
                .map((memberId) => users.find((u) => u.id === memberId))
                .filter((user): user is User => !!user)
                .map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
            </select>
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCreateTask}
              >
                Create
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={resetTaskModal}
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog ref={inviteModalRef} className="modal">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
            <h3 className="font-bold text-lg">Invite Member</h3>
            <InputField
              type="email"
              placeholder="Enter email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                className="btn btn-primary btn-sm"
                onClick={handleInvite}
              >
                Send Invite
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => inviteModalRef.current?.close()}
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>

        <dialog ref={leaveModalRef} className="modal">
          <div className="modal-box bg-card dark:bg-neutral-800 p-6 rounded-2xl shadow-xl flex flex-col gap-4 animate-fade-in">
            <h3 className="font-bold text-lg">Leave Team</h3>
            <p className="py-4">
              Are you sure you want to leave "{team.name}"? Your assigned tasks
              will be unassigned.
            </p>
            <div className="flex gap-2">
              <button
                className="btn btn-danger btn-sm"
                onClick={handleLeaveTeam}
              >
                Leave
              </button>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setShowLeaveConfirm(false);
                  leaveModalRef.current?.close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
};

export default Team;