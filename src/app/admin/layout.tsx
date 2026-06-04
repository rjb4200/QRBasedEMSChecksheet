import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/auth/admin-session";
import { AdminNav } from "@/components/admin-nav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const adminSession = await verifyAdminSession((await cookies()).get(ADMIN_COOKIE_NAME)?.value);

  if (!adminSession) {
    redirect("/login?next=/admin");
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <AdminNav />
      {children}
    </div>
  );
}
