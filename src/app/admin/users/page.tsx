import { updateUserRole } from "./actions";
import { createClient } from "@/lib/supabase/server";

const roles = ["user", "supervisor", "admin"] as const;

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users")
    .select("id, email, full_name, user_roles(role)")
    .order("email");

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-8 text-slate-950">
      <section className="mx-auto max-w-5xl space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700">Admin</p>
          <h1 className="mt-2 text-4xl font-black">User Roles</h1>
          <p className="mt-2 text-slate-600">Assign User, Supervisor, or Admin access to authenticated personnel.</p>
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-white">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {(users ?? []).map((user) => {
                const userRoles = user.user_roles as any;
                const currentRole = Array.isArray(userRoles) ? userRoles[0]?.role : userRoles?.role;

                return (
                  <tr key={user.id} className="border-t border-slate-200">
                    <td className="p-4 font-semibold">{user.full_name ?? "Unassigned"}</td>
                    <td className="p-4 text-slate-600">{user.email}</td>
                    <td className="p-4 capitalize">{currentRole ?? "user"}</td>
                    <td className="p-4">
                      <form action={updateUserRole} className="flex gap-2">
                        <input name="userId" type="hidden" value={user.id} />
                        <select className="rounded-xl border border-slate-300 px-3 py-2" defaultValue={currentRole ?? "user"} name="role">
                          {roles.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                        <button className="rounded-xl bg-red-700 px-4 py-2 font-bold text-white" type="submit">
                          Save
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
