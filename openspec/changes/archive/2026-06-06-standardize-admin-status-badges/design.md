## Context

The admin UI uses status badges and state indicators across 10+ files for four recurring semantic categories: positive/good (Complete, Active, Closed), negative/bad (Not Started, Open, Missing), warning/in-progress (In Progress, Incomplete), and neutral/informational (OOS, Crew names, Unit labels, Exceptions). Each page implemented these independently, resulting in 12 distinct inconsistencies spanning shape, fill style, outline technique, color family, font weight, and padding.

## Goals / Non-Goals

**Goals:**
- Unify all status badges to a single visual style: pill shape, light fill + border
- Use amber (not yellow) for the warning category everywhere
- Apply a consistent padding + font weight token set
- Replace the Fleet Matrix `StatusBadge` component's solid-fill implementation

**Non-Goals:**
- Changing the completion trend chart or password strength bar — these use distinct bar/bar-fill patterns, not pill badges
- Storage warning banner — already uses a large box, not a pill badge
- The checkoff crew form — outside the admin UI
- Extracting a shared `@apply` CSS class — inline Tailwind edits only

## Decisions

### Decision 1: Unified pill badge token

All status badges use the same base classes with a color variant:

```
Base:    rounded-full px-2.5 py-0.5 text-xs font-bold border
Green:   bg-green-100 text-green-800 border-green-200
Red:     bg-red-100 text-red-800 border-red-200
Amber:   bg-amber-100 text-amber-800 border-amber-200
Slate:   bg-slate-100 text-slate-700 border-slate-300
```

**Alternatives considered**: Keeping Fleet Matrix's solid fill as a "primary" tier and light fill as "secondary." Rejected — user prefers one consistent style everywhere.

### Decision 2: Amber over yellow

Archives currently uses `yellow-100/200/900` for Incomplete badges. Everything else uses `amber-*`. Amber is used across Issues, Fleet Matrix, and the Fleet progress bar. Standardizing to amber means one color family to maintain.

### Decision 3: Border over ring-1

Archives uses `ring-1` for outline. Issues and Kits use `border`. `border` is more commonly used across the codebase and produces an identical visual effect at this scale. Standardize to `border`.

### Decision 4: Rewrite StatusBadge component in place

The Fleet Matrix `StatusBadge` component is the primary driver of inconsistency — it uses solid fills. Rather than extracting a new shared component, edit its existing class mappings in place. This minimizes file churn.

## Risks / Trade-offs

- **Risk**: Changing Fleet Matrix solid-fill to light-fill may reduce visual urgency on the dashboard → **Mitigation**: The red border provides sufficient distinction; the card-based layout already provides hierarchy
- **Risk**: Users page daily report status currently has no color distinction → **Mitigation**: Enable should show green badge, disable should show slate badge
- **Trade-off**: Losing the `ring-1` style on Archives — ring and border look slightly different → Acceptable per user preference for unified border
