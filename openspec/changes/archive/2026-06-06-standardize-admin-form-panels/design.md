## Context

Admin pages contain 13 distinct form panels across 9 pages. These accumulated visual drift over time — different border radius tokens, alternating padding values, missing labels, and ad-hoc layout patterns. The previous `standardize-admin-headers` change unified page headers, section labels, and intro subtitles. This extends that standardization to the form panels themselves.

The Equipment Catalog page has the cleanest patterns — a Filter form and an Add form side by side with consistent classes — and serves as the reference standard.

Two structural patterns emerge naturally:
- **Always-visible forms**: Standalone `<form>` elements acting as card wrappers (Filter panels, Create panels)
- **Expandable toggle panels**: A `<div>` card with a toggle button and a conditional `<form>` inside (Issues Create, Users Add)

These patterns are structurally different but should share identical visual class tokens.

## Goals / Non-Goals

**Goals:**
- Unify border radius on all form inputs, selects, buttons, and toggle badges to `rounded-2xl`
- Unify card padding on all form panel wrappers to `p-4`
- Add missing red section labels to filter panels
- Remove stray borders and inner containers that break the pattern
- Formalize two panel styles with shared class tokens

**Non-Goals:**
- Changing form behavior (GET vs POST, server action vs client fetch)
- Changing form structure (toggle vs always-visible — these are UX choices)
- The Issues client-side filter bar (not a `<form>`, different paradigm)
- Copy Kit inline sub-form inside kit cards (already a reduced-size variant, appropriate for context)
- Export Panel button colors (bg-slate-800 is intentionally distinct for the Full Package action)

## Decisions

### Decision 1: Two formalized panel styles, identical visual tokens

Always-visible (Style A) and Expandable (Style B) panels share every visual class. They differ only in structure — whether the form is always visible or toggled.

**Shared tokens:**
```
Label:    text-sm font-bold uppercase tracking-[0.25em] text-red-700
Input:    rounded-2xl border border-slate-300 px-4 py-3
Button:   rounded-2xl bg-red-700 px-5 py-3 font-bold text-white
Card:     rounded-3xl bg-white p-4 shadow-sm
Toggle:   rounded-2xl px-3 py-1 text-xs font-bold bg-red-700 text-white
```

**Alternatives considered**: A single always-visible pattern everywhere. Rejected — Issues and Users contain many fields and benefit from being collapsed by default.

### Decision 2: Equipment Catalog as reference

Both the Filter form and Add form on the Equipment page use the correct visual classes. The Add form's stray `border border-slate-200` is the one fix needed.

**Alternatives considered**: Creating a new reference. Rejected — Equipment already has both a filter and a create form on the same page.

### Decision 3: `rounded-2xl` as the standard radius

`rounded-2xl` (16px) is used on 80% of forms. `rounded-xl` (12px) appears only on Issues and Users pages — likely drift from when those were built.

### Decision 4: Export Panel gets structural fixes, not a full redesign

The Archives Export form currently uses `flex flex-wrap` and a non-standard label. It gets gridified and labeled consistently, but keeps its three-button layout and the intentionally distinct bg-slate-800 Full Package button.

## Risks / Trade-offs

- **Risk**: Changing `rounded-xl` to `rounded-2xl` on Users page is a large find-and-replace — 40+ occurrences → **Mitigation**: Use `replaceAll` edit; verify with build
- **Risk**: Dropping inner `bg-slate-50` container from Issues/Users may make forms feel less visually separated → **Mitigation**: The `p-4` white card wrapper already provides adequate separation; the slate background was the only page using it
- **Trade-off**: Kits Create From Compartment gets a red primary button, losing its visual distinction → Acceptable; it serves the same purpose as other create buttons
