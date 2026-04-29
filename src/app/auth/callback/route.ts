import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isWinchesterGoogleUser } from "@/lib/auth/roles";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/units";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
    const { data } = await supabase.auth.getUser();
    const provider = data.user?.app_metadata.provider;
    const email = data.user?.email;

    if (!isWinchesterGoogleUser(provider, email)) {
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL("/login?error=Google%20login%20requires%20a%20winchesterky.com%20account", request.url));
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
