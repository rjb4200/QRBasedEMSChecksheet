import { NextResponse, type NextRequest } from "next/server";
import { getCurrentShift } from "@/lib/shifts";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { sendPushoverNotification } from "@/lib/pushover";
import { logSystemEvent } from "@/lib/system-log";

export const runtime = "nodejs";

function isAuthorized(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) throw new Error("CRON_SECRET is not configured");
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

function currentLocalHour() {
  const hour = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    hour12: false,
    hourCycle: "h23",
    timeZone: "America/New_York",
  }).format(new Date());
  return Number(hour);
}

function determineAlertType(): { type: "missed_checkoff" | "missed_checkoff_fup"; title: string; prefix: string } | null {
  const hour = currentLocalHour();
  if (hour === 9 || hour === 10 || hour === 11) {
    return { type: "missed_checkoff", title: "Incomplete Checkoff Alert", prefix: "" };
  }
  if (hour >= 12 && hour <= 14) {
    return { type: "missed_checkoff_fup", title: "STILL INCOMPLETE", prefix: "STILL INCOMPLETE — " };
  }
  return null;
}

async function getIncompleteUnits(shiftDate: string, shiftPeriod: string) {
  const supabase = createAdminClient();

  const { data: units, error } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id), unit_kits(id), shift_archives(completed_compartments, total_compartments, completion_percentage)")
    .eq("status", "in_service")
    .is("deleted_at", null)
    .eq("shift_archives.shift_date", shiftDate)
    .eq("shift_archives.shift_period", shiftPeriod)
    .order("name");

  if (error) throw new Error(error.message);

  const { data: crews } = await supabase
    .from("daily_unit_crews")
    .select("unit_id, provider_names, locked")
    .eq("shift_date", shiftDate)
    .eq("shift_period", shiftPeriod);

  const crewMap = new Map((crews ?? []).map((crew) => [crew.unit_id, Boolean(crew.locked && crew.provider_names?.trim())]));

  return (units ?? []).map((unit) => {
    const archive = Array.isArray(unit.shift_archives) ? unit.shift_archives[0] : unit.shift_archives;
    const total = (archive?.total_compartments ?? ((unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0))) + 1;
    const completed = (archive?.completed_compartments ?? 0) + (crewMap.get(unit.id) ? 1 : 0);
    const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { unitId: unit.id, unitName: unit.name, total, completed, pct };
  }).filter((unit) => unit.total > 0 && unit.pct < 100);
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const alertInfo = determineAlertType();
    if (!alertInfo) {
      return NextResponse.json({ status: "skipped", reason: "outside_alert_windows" });
    }

    const { shiftDate, shiftPeriod } = getCurrentShift();
    const incompleteUnits = await getIncompleteUnits(shiftDate, shiftPeriod);

    if (incompleteUnits.length === 0) {
      await logSystemEvent({
        actorType: "system",
        actorName: "Pushover cron",
        area: "pushover",
        action: `missed_checkoff.${alertInfo.type}.skipped`,
        targetType: "pushover_alert",
        result: "success",
        message: "All units complete — no alert sent",
        metadata: { shiftDate, incompleteCount: 0 },
      });
      return NextResponse.json({ status: "skipped", reason: "all_units_complete" });
    }

    const pushoverToggle = alertInfo.type === "missed_checkoff" ? "pushover_missed_checkoff" : "pushover_missed_checkoff_fup";

    const supabase = createAdminClient();
    const { data: recipients, error: recipientError } = await supabase
      .from("admin_users")
      .select("username, pushover_user_key")
      .eq("pushover_alert_enabled", true)
      .eq(pushoverToggle, true)
      .not("pushover_user_key", "is", null)
      .neq("pushover_user_key", "");

    if (recipientError) throw new Error(recipientError.message);

    if (!recipients || recipients.length === 0) {
      await logSystemEvent({
        actorType: "system",
        actorName: "Pushover cron",
        area: "pushover",
        action: `missed_checkoff.${alertInfo.type}.skipped`,
        targetType: "pushover_alert",
        result: "warning",
        message: "No Pushover recipients configured",
        metadata: { shiftDate, incompleteCount: incompleteUnits.length },
      });
      return NextResponse.json({ status: "skipped", reason: "no_pushover_recipients" });
    }

    const topUnits = [...incompleteUnits].sort((a, b) => a.pct - b.pct).slice(0, 3);
    const unitLines = topUnits.map((u) => `${u.unitName}: ${u.completed}/${u.total} (${u.pct}%)`).join(" | ");
    const message = `${alertInfo.prefix}${incompleteUnits.length} unit${incompleteUnits.length === 1 ? "" : "s"} with missed checkoff${incompleteUnits.length === 1 ? "" : "s"}\n\n${unitLines}`;

    const recipientUsernames: string[] = [];
    let successCount = 0;
    let failCount = 0;

    for (const recipient of recipients) {
      if (!recipient.pushover_user_key) continue;

      const result = await sendPushoverNotification({
        userKey: recipient.pushover_user_key,
        title: alertInfo.title,
        message,
      });

      recipientUsernames.push(recipient.username);
      if (result.success) {
        successCount++;
      } else {
        failCount++;
        console.error(`Pushover send failed for ${recipient.username}:`, result.error);
      }
    }

    await logSystemEvent({
      actorType: "system",
      actorName: "Pushover cron",
      area: "pushover",
      action: `missed_checkoff.${alertInfo.type}.sent`,
      targetType: "pushover_alert",
      result: successCount > 0 ? "success" : "failure",
      afterData: {
        shiftDate,
        incompleteCount: incompleteUnits.length,
        recipientCount: recipientUsernames.length,
        successCount,
        failCount,
        recipients: recipientUsernames,
      },
    });

    return NextResponse.json({
      status: "sent",
      shiftDate,
      incompleteCount: incompleteUnits.length,
      recipientCount: recipientUsernames.length,
      successCount,
      failCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pushover miss-checkoff alert failed";
    console.error("Pushover missed-checkoff alert failed:", error);
    await logSystemEvent({
      actorType: "system",
      actorName: "Pushover cron",
      area: "pushover",
      action: "missed_checkoff.failed",
      targetType: "pushover_alert",
      result: "failure",
      message,
    }).catch(() => {});
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
