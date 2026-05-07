import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/auth/admin-session";

const WFD_LOGO_SRC = "/images/WFD_Logo_1848.jpg";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminSession = await verifyAdminSession((await cookies()).get(ADMIN_COOKIE_NAME)?.value);

  if (!adminSession) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <header className="border-b border-slate-200 bg-white px-5 py-4 print:hidden">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3 text-slate-950" href="/admin">
            <img alt="Winchester Fire Department logo" className="h-10 w-10 rounded-xl object-contain" src={WFD_LOGO_SRC} />
            <span>
              <span className="block text-sm font-black uppercase tracking-[0.2em] text-red-700">qrCheckoff</span>
              <span className="block text-xs font-bold text-slate-500">Winchester Fire Department</span>
            </span>
          </Link>
          <nav className="flex flex-wrap gap-2">
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin">Fleet</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/units">Units</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/kits">Kits</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/equipment">Equipment</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/archives">Records</Link>
            <Link className="rounded-2xl border border-slate-300 bg-white px-4 py-3 font-bold text-slate-950 shadow-sm" href="/admin/users">Users</Link>
            <Link className="rounded-2xl bg-red-700 px-4 py-3 font-bold text-white shadow-sm" href="/admin/units">QR Codes</Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
