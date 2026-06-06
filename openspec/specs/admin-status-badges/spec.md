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

- **WHEN** a badge represents a neutral or informational state (OOS, Crew names, Unit labels, Archived, Inactive, Exceptions count, Shift indicators)
- **THEN** the badge SHALL use `bg-slate-100 text-slate-700 border-slate-300`

### Requirement: Blue badges for Pushover notification system

The Pushover notification system SHALL use a blue color badge to match the Pushover brand identity.

#### Scenario: Pushover badge uses blue

- **WHEN** a badge represents the Pushover notification system (system indicator, not alert level)
- **THEN** the badge SHALL use `bg-blue-100 text-blue-800 border-blue-200`

### Requirement: Only enabled features display tag badges

Disabled or inactive features SHALL NOT display a tag badge. Only actively enabled settings SHALL be represented with a tag badge. This prevents visual clutter from inactive states.

#### Scenario: Disabled daily report shows no tag

- **WHEN** a user has `receives_daily_report` set to false
- **THEN** no "Daily Report" tag SHALL be displayed

#### Scenario: Disabled Pushover shows no tags

- **WHEN** a user has `pushover_alert_enabled` set to false or no `pushover_user_key`
- **THEN** no Pushover-related tags SHALL be displayed

#### Scenario: Enabled Pushover shows individual setting tags

- **WHEN** a user has Pushover enabled with missed checkoff and 1st shift checkboxes checked
- **THEN** the user card SHALL display a blue "Pushover" tag, an amber "Missed" tag, and a slate "1st Shift" tag

### Requirement: Pushover missed checkoff uses amber, follow-up uses red

Pushover alert settings SHALL use distinct badge colors based on severity:
- Missed checkoff alerts SHALL use amber (`bg-amber-100 text-amber-800 border-amber-200`)
- Follow-up alerts SHALL use red (`bg-red-100 text-red-800 border-red-200`)
- Shift indicators SHALL use slate (`bg-slate-100 text-slate-700 border-slate-300`)
