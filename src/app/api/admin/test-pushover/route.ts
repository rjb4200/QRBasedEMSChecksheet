import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, getAdminSessionPrincipal } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { sendPushoverNotification } from "@/lib/pushover";

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSessionPrincipal(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await request.json();
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("username, pushover_user_key")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.pushover_user_key) {
      return NextResponse.json({ error: "User has no Pushover User Key configured" }, { status: 400 });
    }

    const result = await sendPushoverNotification({
      userKey: user.pushover_user_key,
      title: "EMS Checkoff — Test Notification",
      message: `This is a test push notification for admin user "${user.username}". If you received this, Pushover is configured correctly.`,
      bypassQuietHours: true,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    return NextResponse.json({ success: true, requestId: result.requestId });
  } catch (error) {
    console.error("Test pushover failed:", error);
    return NextResponse.json({ error: "Failed to send test pushover" }, { status: 500 });
  }
}
