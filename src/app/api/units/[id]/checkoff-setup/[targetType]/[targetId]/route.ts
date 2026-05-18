import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server-admin";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string; targetType: string; targetId: string }> },
) {
  const { id, targetType, targetId } = await params;
  const supabase = createAdminClient();

  if (targetType === "compartment") {
    const { data: compartment } = await supabase
      .from("unit_compartments")
      .select("id, name, unit_compartment_item_groups(id, name, sort_order), unit_compartment_items(id, group_id, sort_order, par_level, input_type, equipment_catalog(name))")
      .eq("id", targetId)
      .eq("unit_id", id)
      .single();

    if (!compartment) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const items = (compartment.unit_compartment_items ?? []).map((item: any) => ({
      id: item.id,
      name: item.name ?? (Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0]?.name : item.equipment_catalog?.name) ?? "Unknown item",
      parLevel: item.par_level,
      inputType: item.input_type,
      sortOrder: item.sort_order ?? 0,
      groupId: item.group_id,
    }));

    const groups = (compartment.unit_compartment_item_groups ?? []).map((g: any) => ({
      id: g.id,
      name: g.name,
      sortOrder: g.sort_order ?? 0,
    }));

    return NextResponse.json({
      targetType: "compartment" as const,
      sourceName: compartment.name,
      items,
      groups,
    });
  }

  if (targetType === "kit") {
    const { data: unitKit } = await supabase
      .from("unit_kits")
      .select("id, kits(id, name, kit_item_groups(id, name, sort_order), kit_items(id, group_id, sort_order, par_level, input_type, equipment_catalog(name)))")
      .eq("id", targetId)
      .eq("unit_id", id)
      .single();

    if (!unitKit) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const kit = Array.isArray(unitKit.kits) ? unitKit.kits[0] : unitKit.kits;

    const items = (kit?.kit_items ?? []).map((item: any) => ({
      id: item.id,
      name: item.name ?? (Array.isArray(item.equipment_catalog) ? item.equipment_catalog[0]?.name : item.equipment_catalog?.name) ?? "Unknown item",
      parLevel: item.par_level,
      inputType: item.input_type,
      sortOrder: item.sort_order ?? 0,
      groupId: item.group_id,
    }));

    const groups = (kit?.kit_item_groups ?? []).map((g: any) => ({
      id: g.id,
      name: g.name,
      sortOrder: g.sort_order ?? 0,
    }));

    return NextResponse.json({
      targetType: "kit" as const,
      sourceName: kit.name,
      items,
      groups,
    });
  }

  return NextResponse.json({ error: "Invalid target type" }, { status: 400 });
}
