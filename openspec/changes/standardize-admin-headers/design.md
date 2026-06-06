## Context

The admin panel has 14 distinct pages built incrementally over many changes. Visual conventions drifted as patterns weren't formally codified. The Fleet dashboard (`/admin`) is the most-used and most-polished page and serves as the reference standard.

Current inconsistencies:
- Two competing section label styles (Pattern A: `text-sm font-bold tracking-[0.25em]` vs Pattern B: `text-xs font-black tracking-[0.2em]`)
- Stray `mt-2` on H1 elements where no section label precedes them (Archives, Analytics)
- Hybrid `font-black` instead of `font-bold` on section labels (Users, Issues)
- Four pages missing intro subtitles (Dashboard, Units, Users, Issues)

All styling is inline Tailwind CSS v4 utility classes. No CSS modules exist. No admin headless components exist.

## Goals / Non-Goals

**Goals:**
- Standardize every admin list page's header to match the Fleet dashboard structure
- Unify section labels on list pages to one pattern: `text-sm font-bold uppercase tracking-[0.25em] text-red-700`
- Add missing intro subtitles to Dashboard, Units, Users, and Issues
- Fix stray `mt-2` on H1 where no section label precedes it

**Non-Goals:**
- Detail/builder pages (Units/[id], Kits/[id], QR) — already structurally correct with label-above-H1 pattern
- Print pages (checksheets/print, archives/print) — different context, already use Pattern A
- Extracting a shared `<PageHeader>` component — unnecessary abstraction for 10 pages
- Changing the Admin Layout or AdminNav component
- The Issue Detail page's `max-w-4xl` width — outside scope

## Decisions

### Decision 1: Fleet dashboard as the reference standard

The Fleet dashboard is the landing page and the most-polished admin page. Its header pattern is the natural reference point:
- H1: `text-4xl font-black` (no `mt-2` when no label precedes it)
- Section label: `text-sm font-bold uppercase tracking-[0.25em] text-red-700`
- Intro: `mt-2 max-w-3xl text-slate-600` (to be added)

**Alternatives considered**: Creating a new standard from scratch. Rejected — the Fleet page already exists and is proven. Changing it would be unnecessary churn.

### Decision 2: Inline Tailwind edits only — no component extraction

Each page directly edits its Tailwind class strings. No shared component or CSS module is created.

**Alternatives considered**: Extracting a `<PageHeader>` component or a Tailwind `@apply` utility class. Rejected — the overhead of a shared component for 10 pages (some server, some client, varying content) outweighs the benefit. The edits are simple find-and-replace on class strings.

### Decision 3: Keep the label-above-H1 pattern on detail/builder pages

Detail pages (Units/[id], Kits/[id], QR) have a section label above a dynamic H1. This is a different structural pattern from list pages and is already consistent. No changes needed.

### Decision 4: Intro text content

Each intro should be a single sentence explaining the page's purpose, matching the tone of existing intros (System Log, Equipment, Kits, Archives):

| Page | Intro |
|---|---|
| Dashboard | Fleet-wide readiness overview showing daily check status across all active units. |
| Unit Management | Create and manage apparatus units with compartments, equipment, and QR codes. |
| Admin Users | Manage admin accounts, report subscriptions, and Pushover alert settings. |
| Issues | Track maintenance issues, equipment problems, and action items across the fleet. |

## Risks / Trade-offs

- **Risk**: Intro text changes may need content review from the user → **Mitigation**: Use clear, functional descriptions; these are admin-facing not public-facing
- **Risk**: Pattern A labels (`text-sm`) may look large on form-heavy pages (Equipment, System Log) → **Mitigation**: Pattern A is only slightly larger than Pattern B (14px vs 12px); still matches Fleet dashboard which also uses it in form-like cards
- **Trade-off**: Pure inline edits mean future drift is still possible → **Mitigation**: The spec defines the standard; future changes should reference it
