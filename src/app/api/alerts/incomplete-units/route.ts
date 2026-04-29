import { NextResponse } from "next/server";
import { buildMissedCheckoffEmail } from "@/lib/email/missed-checkoff";
import { createAdminClient } from "@/lib/supabase/admin";

function getAlertShift(now = new Date()) {
  const local = new Date(now.toLocaleString("en-US", { timeZone: "America/New_York" }));
  const hour = local.getHours();
  const shiftDate = new Date(local);

  if (hour < 18) {
    shiftDate.setDate(shiftDate.getDate() - 1);
    return { shiftDate: shiftDate.toISOString().slice(0, 10), shiftPeriod: "night" };
  }

  return { shiftDate: shiftDate.toISOString().slice(0, 10), shiftPeriod: "day" };
}

export async function GET() {
  const supabase = createAdminClient();
  const { shiftDate, shiftPeriod } = getAlertShift();
  const { data: units, error } = await supabase
    .from("units")
    .select("id, name, unit_compartments(id), shift_archives(completed_compartments, total_compartments, completion_percentage)")
    .eq("status", "in_service")
    .eq("shift_archives.shift_date", shiftDate)
    .eq("shift_archives.shift_period", shiftPeriod)
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const incompleteUnits = (units ?? []).map((unit) => {
    const archive = Array.isArray(unit.shift_archives) ? unit.shift_archives[0] : unit.shift_archives;
    const total = archive?.total_compartments ?? unit.unit_compartments?.length ?? 0;
    const completed = archive?.completed_compartments ?? 0;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 10000) / 100;
    return {
      unitName: unit.name,
      completedCompartments: completed,
      totalCompartments: total,
      completionPercentage: archive?.completion_percentage ?? percentage,
    };
  }).filter((unit) => unit.totalCompartments > 0 && unit.completionPercentage < 100);

  return NextResponse.json({
    shiftDate,
    shiftPeriod,
    shouldSend: incompleteUnits.length > 0,
    incompleteUnits,
    email: incompleteUnits.length > 0 ? buildMissedCheckoffEmail(incompleteUnits) : null,
  });
}
