## ADDED Requirements

### Requirement: All status badges use unified pill style with light fill and border

All admin status badges SHALL use the following unified style:
- Shape: `rounded-full` (pill)
- Fill: light background with matching text and border
- Base classes: `rounded-full px-2.5 py-0.5 text-xs font-bold border`

#### Scenario: Green badge for positive states

- **WHEN** a badge represents a positive state (Complete, Checked, Closed, Active)
- **THEN** the badge SHALL use `bg-green-100 text-green-800 border-green-200`

#### Scenario: Red badge for negative states

- **WHEN** a badge represents a negative state (Not Started, Open, Missing)
- **THEN** the badge SHALL use `bg-red-100 text-red-800 border-red-200`

#### Scenario: Amber badge for in-progress states

- **WHEN** a badge represents an in-progress or warning state (In Progress, Incomplete)
- **THEN** the badge SHALL use `bg-amber-100 text-amber-800 border-amber-200`

#### Scenario: Slate badge for neutral states

- **WHEN** a badge represents a neutral or informational state (OOS, Crew names, Unit labels, Archived, Inactive, Exceptions count)
- **THEN** the badge SHALL use `bg-slate-100 text-slate-700 border-slate-300`

### Requirement: Status badges use amber color family, not yellow

All in-progress or warning state badges SHALL use the `amber` color family tokens. No badge SHALL use `yellow-*` tokens.

#### Scenario: Archives incomplete badge uses amber

- **WHEN** an archive record has a check status of "incomplete"
- **THEN** the status badge SHALL use `bg-amber-100 text-amber-800 border-amber-200`

### Requirement: Fleet Matrix StatusBadge component uses light fill style

The Fleet Matrix `StatusBadge` component SHALL replace its solid-fill color mappings with light-fill + border mappings matching the unified badge tokens.

#### Scenario: Fleet Matrix Not Started badge uses light style

- **WHEN** a fleet unit has a check status of "not_started"
- **THEN** the StatusBadge SHALL render with `bg-red-100 text-red-800 border-red-200`

#### Scenario: Fleet Matrix Complete badge uses light style

- **WHEN** a fleet unit has a check status of "complete"
- **THEN** the StatusBadge SHALL render with `bg-green-100 text-green-800 border-green-200`

### Requirement: Daily report status visually distinguishes enabled from disabled

The Users page SHALL visually distinguish whether daily report emails are enabled or disabled for a user.

#### Scenario: Daily report enabled shows green badge

- **WHEN** a user has `receives_daily_report` set to true
- **THEN** the status indicator SHALL use a green-colored badge or text

#### Scenario: Daily report disabled shows neutral indicator

- **WHEN** a user has `receives_daily_report` set to false
- **THEN** the status indicator SHALL use a slate-colored badge or text
