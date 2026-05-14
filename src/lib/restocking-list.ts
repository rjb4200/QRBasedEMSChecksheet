export type RestockingInputType = "quantity" | "checkbox" | "condition";

export type RestockingItem = {
  id: string;
  par_level: number | null;
  input_type: RestockingInputType;
  equipment_catalog?: { name: string } | { name: string }[] | null;
  name?: string | null;
};

export type RestockingTarget = {
  id: string;
  name: string;
  items?: RestockingItem[] | null;
  itemData?: Record<string, unknown> | null;
};

export type RestockingEntry = {
  itemId: string;
  itemName: string;
  issue: "Missing" | "Below par" | "Condition issue";
  detail: string;
  actual: string;
  expected: string;
};

export type RestockingGroup = {
  sourceId: string;
  sourceName: string;
  entries: RestockingEntry[];
};

function single<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function restockingItemName(item: RestockingItem) {
  return item.name ?? single(item.equipment_catalog)?.name ?? "Unknown item";
}

export function formatRestockingValue(value: unknown) {
  if (value === true) return "Yes";
  if (value === false) return "No";
  if (value === undefined || value === null || value === "") return "-";
  if (typeof value === "object") {
    const condition = value as { status?: string; value?: string };
    return condition.value ? `${condition.status ?? "Unknown"}: ${condition.value}` : condition.status ?? "Unknown";
  }
  return String(value);
}

export function getRestockingEntry(item: RestockingItem, value: unknown): RestockingEntry | null {
  const itemName = restockingItemName(item);

  if (item.input_type === "checkbox" && value === false) {
    return { itemId: item.id, itemName, issue: "Missing", detail: "Missing", actual: "No", expected: "Yes" };
  }

  if (item.input_type === "quantity" && item.par_level !== null && value !== undefined && value !== null && value !== "" && Number(value) < item.par_level) {
    const actual = String(value);
    const expected = String(item.par_level);
    return { itemId: item.id, itemName, issue: "Below par", detail: `Below par: ${actual} of ${expected}`, actual, expected };
  }

  if (item.input_type === "condition" && typeof value === "object" && value !== null) {
    const status = (value as { status?: string }).status ?? "Unknown";
    if (status !== "OK") {
      return { itemId: item.id, itemName, issue: "Condition issue", detail: "Condition issue", actual: status, expected: "OK" };
    }
  }

  return null;
}

export function buildRestockingList(targets: RestockingTarget[]) {
  return targets.flatMap((target) => {
    if (!target.itemData) return [];
    const entries = (target.items ?? []).flatMap((item) => {
      const entry = getRestockingEntry(item, target.itemData?.[item.id]);
      return entry ? [entry] : [];
    });
    return entries.length > 0 ? [{ sourceId: target.id, sourceName: target.name, entries }] : [];
  });
}

export function restockingListText(groups: RestockingGroup[]) {
  return groups.map((group) => `${group.sourceName}: ${group.entries.map((entry) => `${entry.itemName} - ${entry.detail}`).join("; ")}`).join(" | ");
}
