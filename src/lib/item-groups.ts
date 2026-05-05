export type ItemGroup = {
  id: string;
  name: string;
  sort_order: number | null;
  created_at?: string | null;
};

export type GroupableItem = {
  id: string;
  group_id?: string | null;
  sort_order?: number | null;
  created_at?: string | null;
};

export type GroupedItems<TItem extends GroupableItem, TGroup extends ItemGroup = ItemGroup> = {
  group: TGroup | null;
  items: TItem[];
};

function compareStable(a: { sort_order?: number | null; created_at?: string | null; id: string }, b: { sort_order?: number | null; created_at?: string | null; id: string }) {
  const sortDiff = (a.sort_order ?? 0) - (b.sort_order ?? 0);
  if (sortDiff !== 0) return sortDiff;
  const createdDiff = String(a.created_at ?? "").localeCompare(String(b.created_at ?? ""));
  if (createdDiff !== 0) return createdDiff;
  return a.id.localeCompare(b.id);
}

export function groupItems<TItem extends GroupableItem, TGroup extends ItemGroup = ItemGroup>(items: TItem[] = [], groups: TGroup[] = [], options: { hideEmptyGroups?: boolean } = {}) {
  const sortedItems = [...items].sort(compareStable);
  const sortedGroups = [...groups].sort(compareStable);
  const itemsByGroup = new Map<string, TItem[]>();
  const ungrouped: TItem[] = [];

  for (const item of sortedItems) {
    if (item.group_id && sortedGroups.some((group) => group.id === item.group_id)) {
      itemsByGroup.set(item.group_id, [...(itemsByGroup.get(item.group_id) ?? []), item]);
    } else {
      ungrouped.push(item);
    }
  }

  const sections: GroupedItems<TItem, TGroup>[] = sortedGroups
    .map((group) => ({ group, items: itemsByGroup.get(group.id) ?? [] }))
    .filter((section) => !options.hideEmptyGroups || section.items.length > 0);

  if (ungrouped.length > 0) sections.push({ group: null, items: ungrouped });

  return sections;
}
