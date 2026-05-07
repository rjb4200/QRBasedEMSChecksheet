import { getCurrentShift } from "@/lib/shifts";
type SupabaseClient = any;

type UnitRow = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  unit_compartments?: { id: string }[] | null;
  unit_kits?: { id: string }[] | null;
};

type CheckRow = {
  unit_id: string;
  compartment_id: string | null;
  unit_kit_id: string | null;
  status: string;
  completed_at: string | null;
  updated_at: string | null;
  item_data: Record<string, unknown> | null;
};

type CrewRow = {
  unit_id: string;
  provider_names: string | null;
  locked: boolean | null;
  updated_at: string | null;
};

type CommentRow = {
  unit_id: string;
  comment: string | null;
};

type ItemRow = {
  id: string;
  par_level: number | null;
  input_type: "quantity" | "checkbox" | "condition";
};

type CompartmentItemRow = ItemRow & {
  compartment_id: string;
};

type KitItemRow = ItemRow & {
  kit_id: string;
};

type UnitKitRow = {
  id: string;
  kit_id: string;
};

function isNonBlank(value: string | null | undefined) {
  return Boolean(value?.trim());
}

function countTargetExceptions(itemData: Record<string, unknown> | null, expectedItems: ItemRow[]) {
  let count = 0;
  const data = itemData ?? {};

  for (const item of expectedItems) {
    const value = data[item.id];
    const missing = value === undefined || value === null || value === "";

    if (missing) {
      count += 1;
      continue;
    }

    if (item.input_type === "checkbox" && value === false) {
      count += 1;
    }

    if (item.input_type === "quantity" && item.par_level !== null && Number(value) < item.par_level) {
      count += 1;
    }

    if (item.input_type === "condition" && typeof value === "object" && value !== null && (value as { status?: string }).status !== "OK") {
      count += 1;
    }
  }

  return count;
}

function latestIso(values: Array<string | null | undefined>) {
  const timestamps = values.filter(Boolean).map((value) => new Date(value as string).getTime()).filter(Number.isFinite);
  if (timestamps.length === 0) return null;
  return new Date(Math.max(...timestamps)).toISOString();
}

export async function getFleetStatus(supabase: SupabaseClient) {
  const shift = getCurrentShift();

  const [{ data: units }, { data: checks }, { data: crews }, { data: comments }, { data: compartmentItems }, { data: kitItems }, { data: unitKits }] = await Promise.all([
    supabase.from("units").select("id, name, unit_kind, status, unit_compartments(id), unit_kits(id)").is("deleted_at", null).order("name"),
    supabase.from("compartment_checks").select("unit_id, compartment_id, unit_kit_id, status, completed_at, updated_at, item_data").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("daily_unit_crews").select("unit_id, provider_names, locked, updated_at").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("daily_unit_comments").select("unit_id, comment").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("unit_compartment_items").select("id, compartment_id, par_level, input_type"),
    supabase.from("kit_items").select("id, kit_id, par_level, input_type"),
    supabase.from("unit_kits").select("id, kit_id"),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const checkRows = (checks ?? []) as CheckRow[];
  const crewRows = (crews ?? []) as CrewRow[];
  const crewMap = new Map(crewRows.map((crew) => [crew.unit_id, crew]));
  const commentUnitIds = new Set(((comments ?? []) as CommentRow[]).filter((comment) => isNonBlank(comment.comment)).map((comment) => comment.unit_id));
  const compartmentItemMap = new Map<string, ItemRow[]>();
  const kitItemMap = new Map<string, ItemRow[]>();
  const unitKitMap = new Map(((unitKits ?? []) as UnitKitRow[]).map((assignment) => [assignment.id, assignment.kit_id]));

  for (const item of (compartmentItems ?? []) as CompartmentItemRow[]) {
    compartmentItemMap.set(item.compartment_id, [...(compartmentItemMap.get(item.compartment_id) ?? []), item]);
  }

  for (const item of (kitItems ?? []) as KitItemRow[]) {
    kitItemMap.set(item.kit_id, [...(kitItemMap.get(item.kit_id) ?? []), item]);
  }

  return unitRows.map((unit) => {
    const unitChecks = checkRows.filter((check) => check.unit_id === unit.id);
    const crew = crewMap.get(unit.id);
    const crewComplete = Boolean(crew?.locked && isNonBlank(crew.provider_names));
    const total = (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0) + 1;
    const completedChecks = unitChecks.filter((check) => check.status === "completed");
    const completed = completedChecks.length + (crewComplete ? 1 : 0);
    const hasStarted = unitChecks.length > 0 || isNonBlank(crew?.provider_names);
    const inProgress = completed >= total ? 0 : hasStarted ? Math.max(unitChecks.filter((check) => check.status === "in_progress").length, 1) : 0;
    const completedAt = completed >= total
      ? latestIso([...completedChecks.map((check) => check.completed_at ?? check.updated_at), crewComplete ? crew?.updated_at : null])
      : null;
    const exceptionCount = completedChecks.reduce((count, check) => {
      const expectedItems = check.compartment_id
        ? compartmentItemMap.get(check.compartment_id) ?? []
        : kitItemMap.get(unitKitMap.get(check.unit_kit_id ?? "") ?? "") ?? [];
      return count + countTargetExceptions(check.item_data, expectedItems);
    }, 0);

    return {
      ...unit,
      total,
      completed,
      inProgress,
      completedAt,
      exceptionCount,
      hasComments: commentUnitIds.has(unit.id),
      crewComplete,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });
}
