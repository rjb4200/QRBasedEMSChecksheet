## ADDED Requirements

### Requirement: Always-visible form panels share consistent visual classes

All always-visible form panels (filter forms and create/add forms) SHALL use the following Tailwind class tokens on their wrapper, label, inputs, and submit button:

- Wrapper: `rounded-3xl bg-white p-4 shadow-sm`
- Section label: `text-sm font-bold uppercase tracking-[0.25em] text-red-700`
- Inputs and selects: `rounded-2xl border border-slate-300 px-4 py-3`
- Primary submit button: `rounded-2xl bg-red-700 px-5 py-3 font-bold text-white`
- Secondary button (reset, cancel): `rounded-2xl border border-slate-300 px-5 py-3 font-bold text-slate-950`

#### Scenario: Filter form uses standard classes

- **WHEN** a filter form renders on any admin page
- **THEN** the form wrapper SHALL use `rounded-3xl bg-white p-4 shadow-sm`
- **AND** a red section label SHALL appear inside the form using `text-sm font-bold uppercase tracking-[0.25em] text-red-700`
- **AND** all inputs and selects SHALL use `rounded-2xl border border-slate-300 px-4 py-3`

#### Scenario: Create form uses standard classes

- **WHEN** a create/add form renders on any admin page
- **THEN** the form wrapper SHALL use `rounded-3xl bg-white p-4 shadow-sm`
- **AND** the submit button SHALL use `rounded-2xl bg-red-700 px-5 py-3 font-bold text-white`

### Requirement: Expandable form panels share visual tokens with always-visible panels

Expandable toggle panels (Issues Create, Users Add) SHALL use the same border radius, padding, label, input, and button classes as always-visible panels. The structural difference — a card `<div>` wrapping a toggle `<button>` with a conditional `<form>` — is the only permitted divergence.

#### Scenario: Expandable panel card matches always-visible panel card

- **WHEN** an expandable create panel renders
- **THEN** the outer card SHALL use `rounded-3xl bg-white p-4 shadow-sm`
- **AND** the toggle badge SHALL use `rounded-2xl px-3 py-1 text-xs font-bold bg-red-700 text-white`

#### Scenario: Expandable panel form inputs match always-visible panel inputs

- **WHEN** the form inside an expandable panel is visible
- **THEN** all inputs and selects SHALL use `rounded-2xl border border-slate-300 px-4 py-3`
- **AND** the submit button SHALL use `rounded-2xl bg-red-700 px-5 py-3 font-bold text-white`

### Requirement: Filter panels have a red section label

Every filter panel on an admin page SHALL include a red section label element as the first child of the form or form wrapper.

#### Scenario: Filter panel label is present

- **WHEN** a filter form renders on any admin page (Archives, Analytics, System Log, Equipment)
- **THEN** a section label SHALL appear using `text-sm font-bold uppercase tracking-[0.25em] text-red-700` with text "Filter"

### Requirement: Form panel cards omit border and inner background containers

Form panel card wrappers SHALL NOT include a `border` class or an inner `bg-slate-50` or `bg-slate-100` container. The white card with `shadow-sm` provides sufficient visual separation.

#### Scenario: No border on form cards

- **WHEN** any always-visible form panel renders
- **THEN** the card wrapper SHALL NOT include a `border` class

#### Scenario: No inner background container on expandable panels

- **WHEN** the form inside an expandable panel is visible
- **THEN** the form SHALL NOT be wrapped in a `bg-slate-50` or `bg-slate-100` container
