import { getCurrentShift } from "@/lib/shifts";
type SupabaseClient = any;

type UnitRow = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  oos_at: string | null;
  oos_by_name: string | null;
  unit_compartments?: { id: string }[] | null;
  unit_kits?: { id: string }[] | null;
};

type LedgerRow = {
  unit_id: string;
  unit_name: string;
  unit_status: string;
  total_compartments: number;
  archived: boolean | null;
  status_note: string | null;
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

type UnitCheckGroup = {
  all: CheckRow[];
  completed: CheckRow[];
  inProgress: CheckRow[];
  exceptionCount: number;
};

export type FleetUnit = {
  id: string;
  name: string;
  unit_kind: string;
  status: string;
  oosAt?: string | null;
  oosByName?: string | null;
  total: number;
  completed: number;
  inProgress: number;
  percentage: number;
  completedAt?: string | null;
  exceptionCount: number;
  hasComments: boolean;
  crewComplete: boolean;
  archived?: boolean;
  statusNote?: string | null;
};

let fleetStatusCache: { data: FleetUnit[]; shiftKey: string; expiresAt: number } | null = null;
const unitNameCollator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

export function invalidateFleetStatusCache() {
  fleetStatusCache = null;
}

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

function isFleetPanelVisibleUnit(unit: { archived: boolean; status: string }) {
  return !unit.archived && (unit.status === "in_service" || unit.status === "out_of_service");
}

export async function getFleetStatus(supabase: SupabaseClient) {
  const shift = getCurrentShift();
  const shiftKey = `${shift.shiftDate}:${shift.shiftPeriod}`;

  if (fleetStatusCache && fleetStatusCache.shiftKey === shiftKey && Date.now() < fleetStatusCache.expiresAt) {
    return fleetStatusCache.data;
  }

  const [{ data: units }, { data: ledgers }, { data: checks }, { data: crews }, { data: comments }, { data: compartmentItems }, { data: kitItems }, { data: unitKits }] = await Promise.all([
    supabase.from("units").select("id, name, unit_kind, status, oos_at, oos_by_name, unit_compartments(id), unit_kits(id)").is("deleted_at", null).order("name"),
    supabase.from("daily_unit_ledgers").select("unit_id, unit_name, unit_status, total_compartments, archived, status_note").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod).order("unit_name"),
    supabase.from("compartment_checks").select("unit_id, compartment_id, unit_kit_id, status, completed_at, updated_at, item_data").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("daily_unit_crews").select("unit_id, provider_names, locked, updated_at").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("daily_unit_comments").select("unit_id, comment").eq("shift_date", shift.shiftDate).eq("shift_period", shift.shiftPeriod),
    supabase.from("unit_compartment_items").select("id, compartment_id, par_level, input_type"),
    supabase.from("kit_items").select("id, kit_id, par_level, input_type"),
    supabase.from("unit_kits").select("id, kit_id"),
  ]);

  const unitRows = (units ?? []) as UnitRow[];
  const ledgerRows = (ledgers ?? []) as LedgerRow[];
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

  const unitCheckMap = new Map<string, UnitCheckGroup>();

  for (const check of checkRows) {
    let group = unitCheckMap.get(check.unit_id);
    if (!group) {
      group = { all: [], completed: [], inProgress: [], exceptionCount: 0 };
      unitCheckMap.set(check.unit_id, group);
    }
    group.all.push(check);
    if (check.status === "completed") {
      group.completed.push(check);
      const expectedItems = check.compartment_id
        ? compartmentItemMap.get(check.compartment_id) ?? []
        : kitItemMap.get(unitKitMap.get(check.unit_kit_id ?? "") ?? "") ?? [];
      group.exceptionCount += countTargetExceptions(check.item_data, expectedItems);
    } else if (check.status === "in_progress") {
      group.inProgress.push(check);
    }
  }

  const liveUnitMap = new Map(unitRows.map((unit) => [unit.id, unit]));
  const ledgerUnitIds = new Set(ledgerRows.map((ledger) => ledger.unit_id));
  const unitSources = ledgerRows.length > 0
    ? [
      ...ledgerRows.map((ledger) => {
        const liveUnit = liveUnitMap.get(ledger.unit_id);
        return {
          id: ledger.unit_id,
          name: ledger.unit_name,
          unit_kind: liveUnit?.unit_kind ?? "Archived",
          status: ledger.unit_status,
          archived: Boolean(ledger.archived),
          statusNote: ledger.status_note,
          oosAt: liveUnit?.oos_at ?? null,
          oosByName: liveUnit?.oos_by_name ?? null,
          unit_compartments: liveUnit?.unit_compartments ?? [],
          unit_kits: liveUnit?.unit_kits ?? [],
          ledgerTotalCompartments: ledger.total_compartments,
        };
      }),
      ...unitRows.filter((unit) => !ledgerUnitIds.has(unit.id)).map((unit) => ({ ...unit, oosAt: unit.oos_at, oosByName: unit.oos_by_name, archived: false, statusNote: null, ledgerTotalCompartments: null })),
    ]
    : unitRows.map((unit) => ({ ...unit, oosAt: unit.oos_at, oosByName: unit.oos_by_name, archived: false, statusNote: null, ledgerTotalCompartments: null }));

  const result = unitSources.filter(isFleetPanelVisibleUnit).map((unit) => {
    const group = unitCheckMap.get(unit.id) ?? { all: [] as CheckRow[], completed: [] as CheckRow[], inProgress: [] as CheckRow[], exceptionCount: 0 };
    const crew = crewMap.get(unit.id);
    const crewComplete = Boolean(crew?.locked && isNonBlank(crew.provider_names));
    const targetCount = unit.ledgerTotalCompartments ?? (unit.unit_compartments?.length ?? 0) + (unit.unit_kits?.length ?? 0);
    const total = targetCount + 1;
    const completed = group.completed.length + (crewComplete ? 1 : 0);
    const hasStarted = group.all.length > 0 || isNonBlank(crew?.provider_names);
    const inProgress = completed >= total ? 0 : hasStarted ? Math.max(group.inProgress.length, 1) : 0;
    const completedAt = completed >= total
      ? latestIso([...group.completed.map((check: CheckRow) => check.completed_at ?? check.updated_at), crewComplete ? crew?.updated_at : null])
      : null;

    return {
      ...unit,
      total,
      completed,
      inProgress,
      completedAt,
      exceptionCount: group.exceptionCount,
      hasComments: commentUnitIds.has(unit.id),
      crewComplete,
      archived: unit.archived,
      oosAt: unit.oosAt,
      oosByName: unit.oosByName,
      statusNote: unit.statusNote,
      percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
    };
  });

  result.sort((a, b) => {
    const nameOrder = unitNameCollator.compare(a.name, b.name);
    if (nameOrder !== 0) return nameOrder;

    return a.id.localeCompare(b.id);
  });

  fleetStatusCache = { data: result, shiftKey, expiresAt: Date.now() + 60_000 };

  return result;
}
