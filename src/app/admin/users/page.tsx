"use client";

import { useState, useEffect } from "react";

interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  receives_daily_report: boolean;
  created_at: string;
  updated_at?: string;
}

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  if (!password) return { score: 0, label: "", color: "bg-slate-200" };

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Medium", color: "bg-yellow-500" };
  return { score, label: "Strong", color: "bg-green-500" };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newReceivesDailyReport, setNewReceivesDailyReport] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [newPasswordForEdit, setNewPasswordForEdit] = useState("");
  const [emailForEdit, setEmailForEdit] = useState("");
  const [receivesDailyReportForEdit, setReceivesDailyReportForEdit] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin-users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsAddingUser(true);

    try {
      const res = await fetch("/api/admin-users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          email: newEmail,
          receivesDailyReport: newReceivesDailyReport,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess("User created successfully");
      setNewUsername("");
      setNewPassword("");
      setNewEmail("");
      setNewReceivesDailyReport(true);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally {
      setIsAddingUser(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsChangingPassword(true);

    try {
      const res = await fetch(`/api/admin-users/${editingUserId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: newPasswordForEdit || undefined,
          email: emailForEdit,
          receivesDailyReport: receivesDailyReportForEdit,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess("User updated successfully");
      setEditingUserId(null);
      setNewPasswordForEdit("");
      setEmailForEdit("");
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  }

  async function handleDeleteUser() {
    if (!deleteUserId) return;
    setError("");
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin-users/${deleteUserId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setSuccess("User deleted successfully");
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-3xl font-black tracking-tight text-slate-950">Admin Users</h1>
      <p className="mt-2 text-slate-600">Manage admin user accounts</p>

      {error && (
        <div className="mt-4 rounded-2xl border border-red-400/40 bg-red-950/60 p-4 text-sm text-red-100">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 rounded-2xl border border-green-400/40 bg-green-950/60 p-4 text-sm text-green-100">
          {success}
        </div>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="text-lg font-bold text-slate-950">Add New User</h2>
          <form onSubmit={handleAddUser} className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Username
              <input
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none ring-red-500 focus:ring-4"
                placeholder="Enter username"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                required
                minLength={3}
                maxLength={50}
                pattern="^[a-zA-Z0-9_]+$"
              />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Password
              <input
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none ring-red-500 focus:ring-4"
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-slate-200">
                    <div
                      className={`h-2 rounded-full ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{passwordStrength.label}</span>
                </div>
              )}
              <span className="text-xs font-medium text-slate-500">
                Min 8 chars, uppercase, lowercase, number, special char
              </span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Email for Daily Reports
              <input
                className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-950 outline-none ring-red-500 focus:ring-4"
                type="email"
                placeholder="name@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
              <input
                className="h-4 w-4 accent-red-700"
                type="checkbox"
                checked={newReceivesDailyReport}
                onChange={(e) => setNewReceivesDailyReport(e.target.checked)}
              />
              Receives daily report
            </label>
            <button
              className="w-full rounded-xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50"
              type="submit"
              disabled={isAddingUser || !newUsername || !newPassword}
            >
              {isAddingUser ? "Adding..." : "Add User"}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">Existing Users</h2>
          <div className="mt-4 space-y-3">
            {users.length === 0 ? (
              <p className="text-slate-500">No admin users found</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <p className="font-bold text-slate-950">{user.username}</p>
                    <p className="text-sm text-slate-600">{user.email || "No report email"}</p>
                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                      {user.receives_daily_report ? "Daily report enabled" : "Daily report disabled"}
                    </p>
                    <p className="text-sm text-slate-500">Created {formatDate(user.created_at)}</p>
                  </div>
                  <div className="flex gap-2">
                    {editingUserId === user.id ? (
                      <form onSubmit={handleChangePassword} className="grid gap-2 sm:min-w-64">
                        <input
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          type="password"
                          placeholder="New password (optional)"
                          value={newPasswordForEdit}
                          onChange={(e) => setNewPasswordForEdit(e.target.value)}
                        />
                        <input
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
                          type="email"
                          placeholder="Report email"
                          value={emailForEdit}
                          onChange={(e) => setEmailForEdit(e.target.value)}
                        />
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <input
                            className="h-4 w-4 accent-red-700"
                            type="checkbox"
                            checked={receivesDailyReportForEdit}
                            onChange={(e) => setReceivesDailyReportForEdit(e.target.checked)}
                          />
                          Receives daily report
                        </label>
                        <div className="flex gap-2">
                          <button
                            className="rounded-xl bg-red-700 px-3 py-2 text-sm font-bold text-white"
                            type="submit"
                            disabled={isChangingPassword}
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
                            onClick={() => {
                              setEditingUserId(null);
                              setNewPasswordForEdit("");
                              setEmailForEdit("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <button
                          className="rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                          onClick={() => {
                            setEditingUserId(user.id);
                            setNewPasswordForEdit("");
                            setEmailForEdit(user.email ?? "");
                            setReceivesDailyReportForEdit(user.receives_daily_report);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-xl border border-red-300 px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
                          onClick={() => setDeleteUserId(user.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="mx-4 rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold text-slate-950">Delete User?</h3>
            <p className="mt-2 text-slate-600">Are you sure you want to delete this user? This action cannot be undone.</p>
            {users.length <= 1 && (
              <p className="mt-2 text-sm font-bold text-red-600">Warning: You cannot delete the last admin user.</p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button
                className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700"
                onClick={() => setDeleteUserId(null)}
              >
                Cancel
              </button>
              <button
                className="rounded-xl bg-red-700 px-4 py-2 font-bold text-white disabled:opacity-50"
                onClick={handleDeleteUser}
                disabled={isDeleting || users.length <= 1}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
