import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/auth/admin-session";
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
  const adminSession = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE_NAME)?.value);

  if (pathname.startsWith("/admin")) {
    if (!adminSession) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return response;
  }

  if (adminSession && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  const protectedRoute = pathname.startsWith("/supervisor");

  if (!user && protectedRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL("/units", request.url));
  }

  if (user && pathname.startsWith("/supervisor")) {
    const { data: roleRow } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
    const role = roleRow?.role as AppRole | undefined;

    if (!hasRole(role, "supervisor")) {
      return NextResponse.redirect(new URL("/denied", request.url));
    }
  }

  return response;
}
