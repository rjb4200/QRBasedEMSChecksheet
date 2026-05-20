import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/server-admin";

const querySchema = z.object({
  shiftDate: z.string().min(1),
  shiftPeriod: z.string().min(1),
});

function targetStatus(status?: string | null) {
  if (status === "completed") return "completed";
  if (status === "in_progress") return "in_progress";
  if (status === "incomplete") return "incomplete";
  if (status === "exception") return "exception";
  return "not_started";
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = querySchema.safeParse({
    shiftDate: request.nextUrl.searchParams.get("shiftDate"),
    shiftPeriod: request.nextUrl.searchParams.get("shiftPeriod"),
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "shiftDate and shiftPeriod are required" }, { status: 400 });
  }

  const supabase = createAdminClient();
  const [{ data: unit }, { data: checks }] = await Promise.all([
    supabase
      .from("units")
      .select("id, name, unit_compartments(id, name, sort_order), unit_kits(id, sort_order, kits(name))")
      .eq("id", id)
      .is("deleted_at", null)
      .single(),
    supabase
      .from("compartment_checks")
      .select("compartment_id, unit_kit_id, status")
      .eq("unit_id", id)
      .eq("shift_date", parsed.data.shiftDate)
      .eq("shift_period", parsed.data.shiftPeriod),
  ]);

  if (!unit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const checkMap = new Map((checks ?? []).map((check: any) => [check.compartment_id ?? check.unit_kit_id, targetStatus(check.status)]));
  const compartments = (unit.unit_compartments ?? []).map((compartment: any) => ({
    id: compartment.id,
    name: compartment.name,
    type: "compartment" as const,
    sortOrder: compartment.sort_order ?? 0,
  }));
  const kits = (unit.unit_kits ?? []).map((assignment: any) => {
    const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
    return {
      id: assignment.id,
      name: kit?.name ?? "Shared kit",
      type: "kit" as const,
      sortOrder: assignment.sort_order ?? 0,
    };
  });
  const targetStatuses = [...compartments, ...kits]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((target) => ({
      id: target.id,
      name: target.name,
      type: target.type,
      status: checkMap.get(target.id) ?? "not_started",
    }));

  return NextResponse.json({
    unitId: unit.id,
    unitName: unit.name,
    shiftDate: parsed.data.shiftDate,
    shiftPeriod: parsed.data.shiftPeriod,
    completedCount: targetStatuses.filter((target) => target.status === "completed").length,
    totalCount: targetStatuses.length + 1,
    targetStatuses,
  });
}
