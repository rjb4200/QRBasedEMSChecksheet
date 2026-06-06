## ADDED Requirements

### Requirement: List container cards use border-2 border-slate-200

All admin list container cards that wrap repeating item cards SHALL use `border-2 border-slate-200` as part of their wrapper classes.

#### Scenario: List container has border-2

- **WHEN** a list container card renders on any admin page (Units, Kits, Archives, Issues)
- **THEN** the card wrapper SHALL include `border-2 border-slate-200`

### Requirement: List item cards use border-2 border-slate-200

All admin list item cards displayed inside a list container SHALL use `border-2 border-slate-200` as part of their wrapper classes.

#### Scenario: List item has border-2

- **WHEN** a repeating list item card renders on any admin page (Unit rows, Kit articles, Archive records, Equipment catalog rows, Fleet Matrix unit cards)
- **THEN** the card wrapper SHALL include `border-2 border-slate-200`

### Requirement: Content cards remain borderless

Content cards used for standalone sections, forms, and info panels SHALL remain borderless — using `rounded-3xl bg-white p-4 shadow-sm` without a border class.

#### Scenario: Content card is borderless

- **WHEN** a content card renders (filter forms, create forms, section panels, detail info cards)
- **THEN** the card wrapper SHALL NOT include any `border` class
