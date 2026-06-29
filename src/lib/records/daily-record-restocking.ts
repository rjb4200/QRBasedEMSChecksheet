import { buildRestockingList, type RestockingTarget } from "@/lib/restocking-list";
import type { CheckRow, ItemRow } from "@/lib/records/types";
import { getSingleRow } from "@/lib/records/row-utils";

export function getCheckRestockingGroups(checks: CheckRow[], itemMap: Map<string, ItemRow>) {
  const targets: RestockingTarget[] = checks.map((check) => {
    const compartment = getSingleRow(check.unit_compartments);
    const unitKit = getSingleRow(check.unit_kits);
    const kit = getSingleRow(unitKit?.kits);
    const targetName = compartment?.name ?? (kit?.name ? `${kit.name} (Kit)` : "Unknown target");
    const itemIds = Object.keys(check.item_data ?? {});

    return {
      id: check.compartment_id ?? check.unit_kit_id ?? targetName,
      name: targetName,
      itemData: check.item_data ?? null,
      items: itemIds.flatMap((itemId) => {
        const item = itemMap.get(itemId);
        return item ? [{ ...item, id: itemId }] : [];
      }),
    };
  });

  return buildRestockingList(targets);
}
