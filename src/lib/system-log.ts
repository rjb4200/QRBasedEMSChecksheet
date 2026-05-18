import { cookies } from "next/headers";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "@/lib/auth/admin-session";
import { createAdminClient } from "@/lib/supabase/server-admin";

export type SystemLogActorType = "admin" | "crew" | "system";
export type SystemLogResult = "success" | "failure" | "warning";

type JsonRecord = Record<string, unknown>;

export type SystemLogEvent = {
  actorType: SystemLogActorType;
  actorId?: string | null;
  actorName?: string | null;
  action: string;
  area: string;
  targetType?: string | null;
  targetId?: string | null;
  targetName?: string | null;
  result?: SystemLogResult;
  message?: string | null;
  beforeData?: JsonRecord | null;
  afterData?: JsonRecord | null;
  metadata?: JsonRecord | null;
};

export async function logSystemEvent(event: SystemLogEvent) {
  try {
    const supabase = createAdminClient();
    await supabase.from("system_logs").insert({
      actor_type: event.actorType,
      actor_id: event.actorId ?? null,
      actor_name: event.actorName ?? null,
      action: event.action,
      area: event.area,
      target_type: event.targetType ?? null,
      target_id: event.targetId ?? null,
      target_name: event.targetName ?? null,
      result: event.result ?? "success",
      message: event.message ?? null,
      before_data: event.beforeData ?? null,
      after_data: event.afterData ?? null,
      metadata: event.metadata ?? null,
    });
  } catch {
    // Logging must never break the action it is observing.
  }
}

export async function getCurrentAdminLogActor() {
  try {
    const sessionValue = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
    const isValid = await verifyAdminSession(sessionValue);
    const username = sessionValue?.split(".")[0];

    return {
      actorId: null,
      actorName: isValid && username ? username : "Admin",
    };
  } catch {
    return { actorId: null, actorName: "Admin" };
  }
}
