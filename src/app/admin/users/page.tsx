"use client";

import { useState, useEffect } from "react";
import { IconCancel, IconEdit, IconSave, IconTrash } from "@/components/icons";

interface AdminUser {
  id: string;
  username: string;
  email: string | null;
  receives_daily_report: boolean;
  pushover_user_key: string | null;
  pushover_alert_enabled: boolean;
  pushover_missed_checkoff: boolean;
  pushover_missed_checkoff_fup: boolean;
  pushover_shift_1: boolean;
  pushover_shift_2: boolean;
  pushover_shift_3: boolean;
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
  const [pushoverUserKeyForEdit, setPushoverUserKeyForEdit] = useState("");
  const [pushoverAlertEnabledForEdit, setPushoverAlertEnabledForEdit] = useState(false);
  const [pushoverMissedCheckoffForEdit, setPushoverMissedCheckoffForEdit] = useState(false);
  const [pushoverMissedCheckoffFupForEdit, setPushoverMissedCheckoffFupForEdit] = useState(false);
  const [pushoverShift1ForEdit, setPushoverShift1ForEdit] = useState(false);
  const [pushoverShift2ForEdit, setPushoverShift2ForEdit] = useState(false);
  const [pushoverShift3ForEdit, setPushoverShift3ForEdit] = useState(false);
  const [isSavingAll, setIsSavingAll] = useState(false);

  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [destroyEnabled, setDestroyEnabled] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState<string | null>(null);
  const [testEmailRecipient, setTestEmailRecipient] = useState("");
  const [sendingTestEmail, setSendingTestEmail] = useState(false);
  const [testEmailFeedback, setTestEmailFeedback] = useState("");
  const [newPushoverUserKey, setNewPushoverUserKey] = useState("");
  const [newPushoverAlertEnabled, setNewPushoverAlertEnabled] = useState(false);
  const [newPushoverMissedCheckoff, setNewPushoverMissedCheckoff] = useState(false);
  const [newPushoverMissedCheckoffFup, setNewPushoverMissedCheckoffFup] = useState(false);
  const [testPushoverUserId, setTestPushoverUserId] = useState("");
  const [sendingTestPushover, setSendingTestPushover] = useState(false);
  const [testPushoverFeedback, setTestPushoverFeedback] = useState("");
  const [userManagementExpanded, setUserManagementExpanded] = useState(false);
  const [newPushoverShift1, setNewPushoverShift1] = useState(false);
  const [newPushoverShift2, setNewPushoverShift2] = useState(false);
  const [newPushoverShift3, setNewPushoverShift3] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    try {
      const res = await fetch("/api/admin-users");
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally { setLoading(false); }
  }

  async function handleAddUser(e: React.FormEvent) {
    e.preventDefault(); setError(""); setIsAddingUser(true);
    try {
      const res = await fetch("/api/admin-users", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: newUsername, password: newPassword, email: newEmail, receivesDailyReport: newReceivesDailyReport, pushoverUserKey: newPushoverUserKey, pushoverAlertEnabled: newPushoverAlertEnabled, pushoverMissedCheckoff: newPushoverMissedCheckoff, pushoverMissedCheckoffFup: newPushoverMissedCheckoffFup, pushoverShift1: newPushoverShift1, pushoverShift2: newPushoverShift2, pushoverShift3: newPushoverShift3 }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("User created successfully");
      setNewUsername(""); setNewPassword(""); setNewEmail(""); setNewReceivesDailyReport(true);
      setNewPushoverUserKey(""); setNewPushoverAlertEnabled(false); setNewPushoverMissedCheckoff(false); setNewPushoverMissedCheckoffFup(false);
      setNewPushoverShift1(false); setNewPushoverShift2(false); setNewPushoverShift3(false);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create user");
    } finally { setIsAddingUser(false); }
  }

  async function handleSaveAll() {
    setError(""); setSuccess(""); setIsSavingAll(true);
    try {
      const res = await fetch(`/api/admin-users/${editingUserId}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPasswordForEdit || undefined, email: emailForEdit, receivesDailyReport: receivesDailyReportForEdit, pushoverUserKey: pushoverUserKeyForEdit, pushoverAlertEnabled: pushoverAlertEnabledForEdit, pushoverMissedCheckoff: pushoverMissedCheckoffForEdit, pushoverMissedCheckoffFup: pushoverMissedCheckoffFupForEdit, pushoverShift1: pushoverShift1ForEdit, pushoverShift2: pushoverShift2ForEdit, pushoverShift3: pushoverShift3ForEdit }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("Settings saved");
      fetchUsers();
      handleCloseEdit();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally { setIsSavingAll(false); }
  }

  function handleCloseEdit() {
    setEditingUserId(null);
    setNewPasswordForEdit(""); setEmailForEdit("");
  }

  async function handleDeleteUser() {
    if (!deleteUserId) return;
    setError(""); setIsDeleting(true);
    try {
      const res = await fetch(`/api/admin-users/${deleteUserId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setSuccess("User deleted successfully");
      setDeleteUserId(null);
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally { setIsDeleting(false); }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  }

  async function handleTestPushover() {
    if (!testPushoverUserId) return;
    setSendingTestPushover(true); setTestPushoverFeedback("");
    try {
      const res = await fetch("/api/admin/test-pushover", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: testPushoverUserId }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTestPushoverFeedback("Pushover test sent");
    } catch (err) {
      setTestPushoverFeedback(err instanceof Error ? err.message : "Failed");
    } finally { setSendingTestPushover(false); }
  }

  async function handleSendTestEmail() {
    if (!testEmailRecipient) return;
    setSendingTestEmail(true); setTestEmailFeedback("");
    try {
      const res = await fetch("/api/admin/test-daily-report", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: testEmailRecipient }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setTestEmailFeedback(`Sent to ${testEmailRecipient}`);
    } catch (err) {
      setTestEmailFeedback(err instanceof Error ? err.message : "Failed");
    } finally { setSendingTestEmail(false); }
  }

  if (loading) {
    return <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950"><div className="mx-auto max-w-7xl"><p className="text-slate-600">Loading...</p></div></main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-7xl space-y-6">
        <div><h1 className="text-4xl font-black">Admin Users</h1></div>

        {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-800">{error}</div>}
        {success && <div className="rounded-2xl border border-green-200 bg-green-50 p-4 text-sm font-bold text-green-800">{success}</div>}

        <div className="rounded-3xl bg-white p-5 shadow-sm">
          <button className="flex w-full items-center justify-between text-left" onClick={() => setUserManagementExpanded((v) => !v)} type="button">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-red-700">User Management</p>
            <span className={`inline-flex items-center gap-1 rounded-xl px-3 py-1 text-xs font-bold transition ${userManagementExpanded ? "bg-red-100 text-red-700" : "bg-red-700 text-white hover:bg-red-800"}`}>
              {userManagementExpanded ? "Collapse" : "Add User"}
              <svg className={`h-3 w-3 transition ${userManagementExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
          </button>
          {userManagementExpanded && (
            <div className="mt-4">
          <form onSubmit={handleAddUser} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-bold text-slate-700">Username
              <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Enter username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} required minLength={3} maxLength={50} pattern="^[a-zA-Z0-9_]+$" />
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Password
              <input className="rounded-xl border border-slate-300 px-4 py-3" type="password" placeholder="Enter password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              {newPassword && (
                <div className="mt-1 flex items-center gap-2"><div className="h-2 flex-1 rounded-full bg-slate-200"><div className={`h-2 rounded-full ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }} /></div><span className="text-xs font-bold text-slate-600">{passwordStrength.label}</span></div>
              )}
              <span className="text-xs text-slate-500">Min 8 chars, uppercase, lowercase, number, special char</span>
            </label>
            <label className="grid gap-2 text-sm font-bold text-slate-700">Email for Daily Reports
              <input className="rounded-xl border border-slate-300 px-4 py-3" type="email" placeholder="name@example.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
            </label>
                              <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
              <input className="h-4 w-4 accent-red-700" type="checkbox" checked={newReceivesDailyReport} onChange={(e) => setNewReceivesDailyReport(e.target.checked)} /> Receives daily report email
            </label>
            <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-3">Pushover</p>
              <div className="grid gap-3">
                <div className={!newPushoverAlertEnabled ? "opacity-40 pointer-events-none" : ""}>
                  <label className="grid gap-1 text-sm font-bold text-slate-700">User Key
                    <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm" type="password" placeholder="30-char Pushover user key" value={newPushoverUserKey} onChange={(e) => setNewPushoverUserKey(e.target.value)} minLength={0} maxLength={40} />
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={newPushoverAlertEnabled} onChange={(e) => setNewPushoverAlertEnabled(e.target.checked)} />Enable Pushover alerts</label>
                <div className={!newPushoverAlertEnabled ? "grid gap-2 sm:grid-cols-2 opacity-40 pointer-events-none" : "grid gap-2 sm:grid-cols-2"}>
                  <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={newPushoverMissedCheckoff} onChange={(e) => setNewPushoverMissedCheckoff(e.target.checked)} />Missed checkoff</label>
                  <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={newPushoverMissedCheckoffFup} onChange={(e) => setNewPushoverMissedCheckoffFup(e.target.checked)} />Follow-up</label>
                </div>
                <div className={!newPushoverAlertEnabled ? "border-t border-slate-100 pt-2 opacity-40 pointer-events-none" : "border-t border-slate-100 pt-2"}>
                  <p className="text-xs font-bold text-slate-500 mb-2">Receive alerts during:</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={newPushoverShift1} onChange={(e) => setNewPushoverShift1(e.target.checked)} />1st Shift</label>
                    <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={newPushoverShift2} onChange={(e) => setNewPushoverShift2(e.target.checked)} />2nd Shift</label>
                    <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={newPushoverShift3} onChange={(e) => setNewPushoverShift3(e.target.checked)} />3rd Shift</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-end md:col-span-2"><button className="rounded-xl bg-red-700 px-5 py-3 font-bold text-white disabled:opacity-50" type="submit" disabled={isAddingUser || !newUsername || !newPassword}>{isAddingUser ? "Adding..." : "Add User"}</button></div>
          </form>
            </div>
          )}
          <div className="mt-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Existing Users</p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-red-700">Destructive mode</span>
                <button aria-checked={destroyEnabled} className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full p-1 transition ${destroyEnabled ? "bg-red-700" : "bg-slate-300"}`} onClick={() => setDestroyEnabled((v) => !v)} role="switch" type="button">
                  <span className={`h-6 w-6 rounded-full bg-white shadow transition ${destroyEnabled ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {users.length === 0 ? <p className="text-slate-500">No admin users found</p> : (
                users.map((user) => (
                  <div key={user.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-bold text-slate-950">{user.username}</p>
                      <p className="text-sm text-slate-600">{user.email || "No report email"}</p>
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-500">{user.receives_daily_report ? "Daily report enabled" : "Daily report disabled"}</p>
                      {user.pushover_alert_enabled && user.pushover_user_key ? (
                        <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-600">
                          Pushover: {(user.pushover_missed_checkoff ? "M" : "")}{(user.pushover_missed_checkoff_fup ? "/F" : "") || "Enabled"}
                          {(user.pushover_shift_1 || user.pushover_shift_2 || user.pushover_shift_3) ? ` (${[user.pushover_shift_1 && "1st", user.pushover_shift_2 && "2nd", user.pushover_shift_3 && "3rd"].filter(Boolean).join(", ")})` : ""}
                        </p>
                      ) : null}
                      <p className="text-sm text-slate-500">Created {formatDate(user.created_at)}</p>
                    </div>
                      {editingUserId === user.id ? (
                        <div className="w-full space-y-4">
                          <div className="flex items-center justify-between">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700">Editing {user.username}</p>
                            <div className="flex items-center gap-2">
                              <button className="rounded-2xl bg-red-700 p-3 text-white disabled:opacity-50" onClick={handleSaveAll} disabled={isSavingAll} title="Save" type="button"><IconSave /></button>
                              <button type="button" className="rounded-2xl border border-slate-300 p-3 text-slate-600" onClick={handleCloseEdit} title="Cancel"><IconCancel /></button>
                            </div>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-4">Email &amp; Password</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <label className="grid gap-1 text-sm font-bold text-slate-700">New Password
                                <input className="rounded-xl border border-slate-300 px-3 py-2" type="password" placeholder="Leave blank to keep current" value={newPasswordForEdit} onChange={(e) => setNewPasswordForEdit(e.target.value)} />
                              </label>
                              <label className="grid gap-1 text-sm font-bold text-slate-700">Report Email
                                <input className="rounded-xl border border-slate-300 px-3 py-2" type="email" placeholder="name@example.com" value={emailForEdit} onChange={(e) => setEmailForEdit(e.target.value)} />
                              </label>
                            </div>
                            <label className="mt-4 flex items-center gap-3 text-sm font-bold text-slate-700">
                              <input className="h-4 w-4 accent-red-700" type="checkbox" checked={receivesDailyReportForEdit} onChange={(e) => setReceivesDailyReportForEdit(e.target.checked)} />Receives daily report email
                            </label>
                          </div>
                          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-red-700 mb-4">Pushover</p>
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className={!pushoverAlertEnabledForEdit ? "opacity-40 pointer-events-none" : ""}>
                                <label className="grid gap-1 text-sm font-bold text-slate-700">User Key
                                  <input className="rounded-xl border border-slate-300 px-3 py-2" type="password" placeholder="30-char Pushover user key" value={pushoverUserKeyForEdit} onChange={(e) => setPushoverUserKeyForEdit(e.target.value)} maxLength={40} />
                                </label>
                              </div>
                              <div className="flex flex-col gap-2 justify-end">
                                <label className="flex items-center gap-2 text-sm font-bold text-slate-700"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={pushoverAlertEnabledForEdit} onChange={(e) => setPushoverAlertEnabledForEdit(e.target.checked)} />Enable Pushover</label>
                                <div className={!pushoverAlertEnabledForEdit ? "opacity-40 pointer-events-none grid grid-cols-2 gap-1" : "grid grid-cols-2 gap-1"}>
                                  <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={pushoverMissedCheckoffForEdit} onChange={(e) => setPushoverMissedCheckoffForEdit(e.target.checked)} />Missed (0930)</label>
                                  <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={pushoverMissedCheckoffFupForEdit} onChange={(e) => setPushoverMissedCheckoffFupForEdit(e.target.checked)} />Follow-up (1300)</label>
                                </div>
                              </div>
                            </div>
                            <div className={!pushoverAlertEnabledForEdit ? "mt-3 border-t border-slate-200 pt-3 opacity-40 pointer-events-none" : "mt-3 border-t border-slate-200 pt-3"}>
                              <p className="text-xs font-bold text-slate-500 mb-2">Receive alerts during:</p>
                              <div className="flex gap-4">
                                <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={pushoverShift1ForEdit} onChange={(e) => setPushoverShift1ForEdit(e.target.checked)} />1st Shift</label>
                                <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={pushoverShift2ForEdit} onChange={(e) => setPushoverShift2ForEdit(e.target.checked)} />2nd Shift</label>
                                <label className="flex items-center gap-2 text-sm text-slate-600"><input className="h-4 w-4 accent-red-700" type="checkbox" checked={pushoverShift3ForEdit} onChange={(e) => setPushoverShift3ForEdit(e.target.checked)} />3rd Shift</label>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex shrink-0 gap-2">
                          <button className="rounded-2xl border border-slate-300 p-3 text-slate-600" onClick={() => { setEditingUserId(user.id); setNewPasswordForEdit(""); setEmailForEdit(user.email ?? ""); setReceivesDailyReportForEdit(user.receives_daily_report); setPushoverUserKeyForEdit(user.pushover_user_key ?? ""); setPushoverAlertEnabledForEdit(user.pushover_alert_enabled); setPushoverMissedCheckoffForEdit(user.pushover_missed_checkoff); setPushoverMissedCheckoffFupForEdit(user.pushover_missed_checkoff_fup); setPushoverShift1ForEdit(user.pushover_shift_1); setPushoverShift2ForEdit(user.pushover_shift_2); setPushoverShift3ForEdit(user.pushover_shift_3); }} title="Edit user" type="button"><IconEdit /></button>
                          {destroyEnabled ? (
                            confirmingDelete === user.id ? (
                              <>
                                <button aria-label="Cancel delete" className="rounded-2xl border border-slate-300 p-3 text-slate-600" onClick={() => setConfirmingDelete(null)} title="Cancel" type="button"><svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" /></svg></button>
                                <button className="rounded-xl border border-red-200 px-3 py-1 text-xs font-bold text-red-700" onClick={() => { setDeleteUserId(user.id); setConfirmingDelete(null); }} type="button">Delete?</button>
                              </>
                            ) : (
                              <button className="rounded-2xl border border-red-200 p-3 text-red-700" onClick={() => setConfirmingDelete(user.id)} title="Delete user" type="button"><IconTrash /></button>
                            )
                          ) : null}
                          </div>
                      )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 flex items-end gap-3 border-t border-slate-200 pt-6">
            <div className="grid gap-1">
              <label className="text-xs font-bold text-slate-700">Send Test Email</label>
              <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={testEmailRecipient} onChange={(e) => setTestEmailRecipient(e.target.value)}>
                <option value="">Select user...</option>
                {users.filter((u) => u.email && u.receives_daily_report).map((u) => (
                  <option key={u.id} value={u.email!}>{u.username} ({u.email})</option>
                ))}
              </select>
            </div>
            <button className="rounded-xl bg-red-700 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={!testEmailRecipient || sendingTestEmail} onClick={handleSendTestEmail} type="button">{sendingTestEmail ? "Sending..." : "Send"}</button>
            {testEmailFeedback && <span className={`text-sm font-semibold ${testEmailFeedback.startsWith("Sent") ? "text-green-700" : "text-red-700"}`}>{testEmailFeedback}</span>}
          </div>
          <div className="mt-4 flex items-end gap-3 border-t border-slate-200 pt-4">
            <div className="grid gap-1">
              <label className="text-xs font-bold text-slate-700">Test Pushover</label>
              <select className="rounded-xl border border-slate-300 px-3 py-2 text-sm" value={testPushoverUserId} onChange={(e) => setTestPushoverUserId(e.target.value)}>
                <option value="">Select user...</option>
                {users.filter((u) => u.pushover_alert_enabled && u.pushover_user_key).map((u) => (
                  <option key={u.id} value={u.id}>{u.username}</option>
                ))}
              </select>
            </div>
            <button className="rounded-xl bg-orange-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50" disabled={!testPushoverUserId || sendingTestPushover} onClick={handleTestPushover} type="button">{sendingTestPushover ? "Sending..." : "Send"}</button>
            {testPushoverFeedback && <span className={`text-sm font-semibold ${testPushoverFeedback === "Pushover test sent" ? "text-green-700" : "text-red-700"}`}>{testPushoverFeedback}</span>}
          </div>
        </div>
      </section>

      {deleteUserId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="mx-4 rounded-2xl bg-white p-6">
            <h3 className="text-lg font-bold text-slate-950">Delete User?</h3>
            <p className="mt-2 text-slate-600">Are you sure you want to delete this user? This action cannot be undone.</p>
            {users.length <= 1 && <p className="mt-2 text-sm font-bold text-red-600">Warning: You cannot delete the last admin user.</p>}
            <div className="mt-4 flex justify-end gap-3">
              <button className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700" onClick={() => setDeleteUserId(null)}>Cancel</button>
              <button className="rounded-xl bg-red-700 px-4 py-2 font-bold text-white disabled:opacity-50" onClick={handleDeleteUser} disabled={isDeleting || users.length <= 1}>{isDeleting ? "Deleting..." : "Delete"}</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
