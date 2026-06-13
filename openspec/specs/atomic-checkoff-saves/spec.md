## ADDED Requirements

### Requirement: Checkoff saves use atomic upsert with onConflict

All writes to the `compartment_checks` table SHALL use atomic save semantics targeting the normalized unique identity `(unit_id, target_type, target_id, shift_date, shift_period)`, instead of a separate SELECT followed by INSERT or UPDATE. Implementations MAY use Supabase `.upsert()` with the normalized `onConflict` option or a database RPC/function when required to preserve completed-status semantics atomically.

#### Scenario: Compartment target upsert uses normalized conflict columns

- **WHEN** saving a checkoff for a compartment target
- **THEN** the write SHALL identify the row with `target_type = compartment` and `target_id = compartment_id`
- **AND** the atomic conflict target SHALL be `unit_id,target_type,target_id,shift_date,shift_period`

#### Scenario: Kit target upsert uses normalized conflict columns

- **WHEN** saving a checkoff for a kit target
- **THEN** the write SHALL identify the row with `target_type = kit` and `target_id = unit_kit_id`
- **AND** the atomic conflict target SHALL be `unit_id,target_type,target_id,shift_date,shift_period`

#### Scenario: No duplicate rows from concurrent saves

- **WHEN** two concurrent save requests target the same (unit, target_type, target_id, shift_date, shift_period)
- **THEN** exactly one row SHALL exist in `compartment_checks` after both requests complete

#### Scenario: Completed status is not downgraded atomically

- **WHEN** an existing row is already completed
- **AND** a later in-progress autosave targets the same normalized check identity
- **THEN** the atomic save SHALL NOT change the row status from completed back to in_progress

### Requirement: Page-load auto-create uses atomic upsert

The server component page-load logic that creates an in-progress checkoff row SHALL use atomic save semantics targeting the normalized unique identity `(unit_id, target_type, target_id, shift_date, shift_period)` instead of a SELECT-then-INSERT pattern.

#### Scenario: Page-load creates in-progress row atomically

- **WHEN** a user navigates to a checkoff page for a target with no existing check
- **THEN** the system SHALL upsert an in_progress row atomically without a separate SELECT-then-INSERT write path

#### Scenario: Concurrent page loads produce one row

- **WHEN** two browser tabs load the same checkoff page simultaneously
- **THEN** exactly one compartment_checks row SHALL exist for that normalized target identity

### Requirement: Auto-save timer is cancelled on manual submit

The 700ms auto-save debounce timer SHALL be cleared when the user clicks the Submit button, and auto-saves SHALL be suppressed while a submission is in-flight.

#### Scenario: Submit clears auto-save timer

- **WHEN** user clicks "Submit Compartment" (or kit equivalent)
- **THEN** any pending auto-save timer SHALL be cancelled

#### Scenario: Auto-save suppressed during submission

- **WHEN** a submission is in-flight (isSubmitting is true)
- **THEN** the auto-save callback SHALL return without making a network request

#### Scenario: Completed check is not overwritten

- **WHEN** a checkoff has been submitted as "completed"
- **THEN** no subsequent auto-save SHALL change its status back to "in_progress"
