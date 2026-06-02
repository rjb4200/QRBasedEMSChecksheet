"use client";

import { useState, useEffect } from "react";
import { IconCancel, IconEdit, IconSave, IconTrash } from "@/components/icons";

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
  const [destroyEnabled, setDestroyEnabled] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);

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
      <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
        <div className="mx-auto max-w-6xl">
          <p className="text-slate-600">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-4xl font-black">Admin Dashboard</h1>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</div>
        )}
        {success && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">{success}</div>
        )}

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">User Management</p>

          <form onSubmit={handleAddUser} className="mt-4 grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Username
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
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
                className="rounded-xl border border-slate-300 px-4 py-3"
                type="password"
                placeholder="Enter password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              {newPassword && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-slate-200">
                    <div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{passwordStrength.label}</span>
                </div>
              )}
              <span className="text-xs text-slate-500">Min 8 chars, uppercase, lowercase, number, special char</span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">
              Email for Daily Reports
              <input
                className="rounded-xl border border-slate-300 px-4 py-3"
                type="email"
                placeholder="name@example.com"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
              <input className="h-4 w-4 accent-red-700" type="checkbox" checked={newReceivesDailyReport} onChange={(e) => setNewReceivesDailyReport(e.target.checked)} />
              Receives daily report
            </label>
            <div className="flex items-end md:col-span-2">
              <button className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50" type="submit" disabled={isAddingUser || !newUsername || !newPassword}>
                {isAddingUser ? "Adding..." : "Add User"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Existing Users</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-red-700">Destructive mode</span>
                <button
                  aria-checked={destroyEnabled}
                  className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition ${destroyEnabled ? "bg-red-700" : "bg-slate-300"}`}
                  onClick={() => setDestroyEnabled((v) => !v)}
                  role="switch"
                  type="button"
                >
                  <span className={`h-6 w-6 rounded-full bg-white shadow transition ${destroyEnabled ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {users.length === 0 ? (
                <p className="text-slate-500">No admin users found</p>
              ) : (
                users.map((user) => (
                  <div key={user.id} className={`flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between`}>
                    <div>
                      <p className="font-bold text-slate-950">{user.username}</p>
                      <p className="text-sm text-slate-600">{user.email || "No report email"}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">
                        {user.receives_daily_report ? "Daily report enabled" : "Daily report disabled"}
                      </p>
                      <p className="text-sm text-slate-500">Created {formatDate(user.created_at)}</p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      {editingUserId === user.id ? (
                        <form onSubmit={handleChangePassword} className="flex flex-wrap items-end gap-2">
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
                            <input className="h-4 w-4 accent-red-700" type="checkbox" checked={receivesDailyReportForEdit} onChange={(e) => setReceivesDailyReportForEdit(e.target.checked)} />
                            Daily report
                          </label>
                          <button className="rounded-2xl border border-slate-300 p-3 text-slate-600" type="submit" disabled={isChangingPassword} title="Save"><IconSave /></button>
                          <button type="button" className="rounded-2xl border border-slate-300 p-3 text-slate-600" onClick={() => { setEditingUserId(null); setNewPasswordForEdit(""); setEmailForEdit(""); }} title="Cancel"><IconCancel /></button>
                        </form>
                      ) : (
                        <>
                          <button className="rounded-2xl border border-slate-300 p-3 text-slate-600" onClick={() => { setEditingUserId(user.id); setNewPasswordForEdit(""); setEmailForEdit(user.email ?? ""); setReceivesDailyReportForEdit(user.receives_daily_report); }} title="Edit user" type="button">
                            <IconEdit />
                          </button>
                          {destroyEnabled ? (
                            confirmingDelete === user.id ? (
                              <>
                                <button aria-label="Cancel delete" className="rounded-2xl border border-slate-300 p-3 text-slate-600" onClick={() => setConfirmingDelete(null)} title="Cancel" type="button">
                                  <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg>
                                </button>
                                <button className="rounded-xl border border-red-200 px-3 py-1 text-xs font-bold text-red-700" onClick={() => { setDeleteUserId(user.id); setConfirmingDelete(null); }} type="button">Delete?</button>
                              </>
                            ) : (
                              <button className="rounded-2xl border border-red-200 p-3 text-red-700" onClick={() => setConfirmingDelete(user.id)} title="Delete user" type="button">
                                <IconTrash />
                              </button>
                            )
                          ) : null}
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="mx-4 rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold text-slate-950">Delete User?</h3>
            <p className="mt-2 text-slate-600">Are you sure you want to delete this user? This action cannot be undone.</p>
            {users.length <= 1 && (
              <p className="mt-2 text-sm font-bold text-red-600">Warning: You cannot delete the last admin user.</p>
            )}
            <div className="mt-4 flex justify-end gap-3">
              <button className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700" onClick={() => setDeleteUserId(null)}>Cancel</button>
              <button className="rounded-xl bg-red-700 px-4 py-2 font-bold text-white disabled:opacity-50" onClick={handleDeleteUser} disabled={isDeleting || users.length <= 1}>
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
