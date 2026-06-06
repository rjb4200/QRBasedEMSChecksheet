## ADDED Requirements

### Requirement: Admin list page headers match Fleet dashboard convention

Every admin list page SHALL have a header structure that matches the Fleet dashboard (`/admin`) convention:
- An H1 heading with classes `text-4xl font-black` and no `mt-2` margin
- An intro subtitle paragraph with classes `mt-2 max-w-3xl text-slate-600` immediately following the H1

#### Scenario: List page without a section label above H1

- **WHEN** a list page has no section label element preceding the H1
- **THEN** the H1 SHALL use `text-4xl font-black` without `mt-2`

#### Scenario: List page intro subtitle is present

- **WHEN** any admin list page renders
- **THEN** an intro subtitle paragraph SHALL appear below the H1 with classes `mt-2 max-w-3xl text-slate-600`

### Requirement: Admin section labels use unified style

All section labels on admin list pages SHALL use the same Tailwind classes as the Fleet dashboard's "Fleet Matrix" and "Exceptions" labels:
`text-sm font-bold uppercase tracking-[0.25em] text-red-700`

This applies to form section labels (Filter, Add, Create, etc.) and content section labels (User Management, Existing Users, Create Issue, etc.).

#### Scenario: Form section labels use standard style

- **WHEN** a form section label appears (e.g., "Filter", "Add", "Create Kit")
- **THEN** it SHALL use `text-sm font-bold uppercase tracking-[0.25em] text-red-700`

#### Scenario: Content section labels use standard style

- **WHEN** a content section label appears (e.g., "User Management", "Create Issue")
- **THEN** it SHALL use `text-sm font-bold uppercase tracking-[0.25em] text-red-700`

### Requirement: Detail page labels match Fleet dashboard section label style

Detail/builder pages (Unit Builder, Kit Builder, QR Codes) that use a section label above the H1 SHALL continue using `text-sm font-bold uppercase tracking-[0.25em] text-red-700` and SHALL use `mt-2` on the H1.

#### Scenario: Detail page label above H1

- **WHEN** a detail/builder page renders with a section label element above the H1
- **THEN** the label SHALL use `text-sm font-bold uppercase tracking-[0.25em] text-red-700`
- **AND** the H1 SHALL include `mt-2` for spacing from the label above it
