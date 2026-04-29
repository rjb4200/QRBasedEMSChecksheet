import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { hasRole, type AppRole } from "@/lib/auth/roles";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  const role = roleRow?.role as AppRole | undefined;

  if (!hasRole(role, "admin")) {
    redirect("/denied");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-5 py-4 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link className="text-sm font-black uppercase tracking-[0.25em] text-red-700" href="/admin">
            Admin Dashboard
          </Link>
          <nav className="flex flex-wrap gap-2">
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/units">Units</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/equipment">Equipment</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/users">Users</Link>
            <Link className="rounded-2xl bg-red-700 px-4 py-3 font-bold text-white shadow-sm" href="/admin/units">QR Codes</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
