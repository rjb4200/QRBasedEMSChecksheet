## Context

Admin pages use card containers for two distinct roles:
- **Content cards** (forms, sections, info panels): no border, just `rounded-3xl bg-white shadow-sm`
- **List containers and list items**: bordered cards that group and separate list-type content

The bordered card pattern diverges. Archives and Kits use `border-2 border-slate-200`, while Units, Equipment, and Issues use single `border border-slate-200` (or no border at all on the Units container). This change unifies everything to `border-2`.

## Goals / Non-Goals

**Goals:**
- Every list container and list item card uses `border-2 border-slate-200`
- Issues list container gains `p-5` padding to match other list containers

**Non-Goals:**
- Content/form cards — already borderless and consistent
- Special/alarm cards (red borders, colored backgrounds) — intentionally distinct
- Detail/builder page cards — mixed use, not list-type content
- Creating React components — inline class string fixes only

## Decisions

### Decision 1: `border-2` as the standard

Archives and Kits already use `border-2`. It provides clearer visual separation between cards than single `border` and matches the existing stronger patterns.

**Alternatives considered**: `border` (single pixel) — lighter, used on more pages. Rejected because the heavier weight is more consistent with the prominent `rounded-3xl` card aesthetic.

### Decision 2: Inline fixes only

Same approach as the previous two standardization issues. Pure Tailwind class string edits on each page. No new components or utilities.

## Risks / Trade-offs

- **Risk**: Fleet Matrix unit cards live in a shared component (`fleet-matrix.tsx`) — any change affects the Fleet dashboard only, which is the intended scope
- **Trade-off**: `border-2` is visually heavier — may feel slightly more prominent on pages where single `border` was previously used → Acceptable; the card aesthetic is intentional
