import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";
import { getPreviousShift } from "@/lib/shifts";

function computeExceptionsFromCheckData(checkData: unknown[]) {
  const items: { sourceName: string; itemName: string; issue: string }[] = [];
  if (!Array.isArray(checkData)) return items;

  for (const entry of checkData) {
    const sourceName = (entry as Record<string, unknown>)?.source_name as string ?? "Unknown";
    const itemsData = (entry as Record<string, unknown>)?.items as Record<string, unknown> ?? {};

    for (const [itemId, value] of Object.entries(itemsData)) {
      if (value === false) {
        items.push({ sourceName, itemName: itemId, issue: "Missing" });
      } else if (typeof value === "object" && value !== null) {
        const condition = value as { status?: string };
        if (condition.status && condition.status !== "OK") {
          items.push({ sourceName, itemName: itemId, issue: "Condition issue" });
        }
      } else if (typeof value === "number" || (typeof value === "string" && value.trim() !== "")) {
        // Quantity values from check_data are already evaluated — they appear as numeric
      }
    }
  }
  return items;
}

function computeParLevelExceptions(compartments: any[], kits: any[]) {
  const items: { sourceName: string; itemName: string; issue: string }[] = [];

  for (const comp of compartments) {
    for (const item of (comp.unit_compartment_items ?? []) as any[]) {
      const catalog = Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0] : item.equipment_catalog;
      const itemName = item.name ?? catalog?.name ?? "Unknown item";
      if (item.input_type === "checkbox") {
        items.push({ sourceName: comp.name, itemName, issue: "Potential missing" });
      } else if (item.input_type === "quantity" && item.par_level && item.par_level > 0) {
        items.push({ sourceName: comp.name, itemName, issue: `Check par: ${item.par_level}` });
      }
    }
  }

  for (const assignment of kits) {
    const kit = Array.isArray(assignment.kits) ? assignment.kits[0] : assignment.kits;
    for (const item of (kit?.kit_items ?? []) as any[]) {
      const catalog = Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0] : item.equipment_catalog;
      const itemName = item.name ?? catalog?.name ?? "Unknown item";
      if (item.input_type === "checkbox") {
        items.push({ sourceName: kit?.name ?? "Kit", itemName, issue: "Potential missing" });
      } else if (item.input_type === "quantity" && item.par_level && item.par_level > 0) {
        items.push({ sourceName: kit?.name ?? "Kit", itemName, issue: `Check par: ${item.par_level}` });
      }
    }
  }

  return items;
}

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = createAdminClient();
  const prev = getPreviousShift();

  // Try to get the most recent previous shift archive
  const { data: archive } = await supabase
    .from("shift_archives")
    .select("check_data")
    .eq("unit_id", id)
    .eq("shift_date", prev.shiftDate)
    .eq("shift_period", prev.shiftPeriod)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (archive?.check_data) {
    const items = computeExceptionsFromCheckData(archive.check_data as unknown[]);
    return NextResponse.json({ exceptionCount: items.length, items });
  }

  // Fallback: compute from unit equipment par levels
  const { data: unit } = await supabase
    .from("units")
    .select("unit_compartments(id, name, unit_compartment_items(id, name, par_level, input_type, equipment_catalog(name))), unit_kits(id, kits(id, name, kit_items(id, name, par_level, input_type, equipment_catalog(name))))")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (!unit) {
    return NextResponse.json({ exceptionCount: 0, items: [] });
  }

  const items = computeParLevelExceptions(
    (unit as any).unit_compartments ?? [],
    (unit as any).unit_kits ?? [],
  );

  return NextResponse.json({ exceptionCount: items.length, items });
}
