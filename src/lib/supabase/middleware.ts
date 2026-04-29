import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { hasRole, type AppRole } from "@/lib/auth/roles";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/auth/callback");
  const protectedRoute = pathname.startsWith("/units") || pathname.startsWith("/checkoff") || pathname.startsWith("/admin") || pathname.startsWith("/supervisor");

  if (!user && protectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/units", request.url));
  }

  if (user && (pathname.startsWith("/admin") || pathname.startsWith("/supervisor"))) {
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    const role = roleRow?.role as AppRole | undefined;
    const requiredRole: AppRole = pathname.startsWith("/admin") ? "admin" : "supervisor";

    if (!hasRole(role, requiredRole)) {
      return NextResponse.redirect(new URL("/denied", request.url));
    }
  }

  return response;
}
