## Purpose
Define the shared Restocking List addressed-state workflow with interactive checkboxes and cross-device polling sync.

## Requirements

### Requirement: Restocking List entries have interactive checkboxes
Each Restocking List entry SHALL include a checkbox that the crew can toggle to mark the item as addressed or unaddressed.

#### Scenario: Crew checks an item
- **WHEN** a crew member clicks the checkbox next to a Restocking List entry
- **THEN** the checkbox SHALL immediately appear checked
- **AND** the addressed state SHALL be saved to `daily_restock_items`
- **AND** if the save fails, the checkbox SHALL revert to its previous state

#### Scenario: Crew unchecks an item
- **WHEN** a crew member unchecks a previously addressed item
- **THEN** the checkbox SHALL immediately appear unchecked
- **AND** the addressed state SHALL be cleared in `daily_restock_items`

### Requirement: Addressed state is shared across devices
The system SHALL synchronize addressed state across devices viewing the same unit using 15-second background polling when the Restocking List is expanded and the browser tab is visible.

#### Scenario: Polling runs
- **WHEN** the Restocking List is expanded, the browser tab is visible, and no save operation is in progress
- **THEN** the system SHALL silently fetch updated addressed state every 15 seconds
- **AND** the system SHALL patch only changed checkboxes without reloading the page

#### Scenario: Polling pauses
- **WHEN** the Restocking List collapses, the tab becomes hidden, or a save begins
- **THEN** the polling interval SHALL pause immediately

#### Scenario: Polling resumes
- **WHEN** the Restocking List is re-expanded and the tab is visible
- **THEN** the polling interval SHALL resume with a fresh fetch

#### Scenario: Another device updates an item
- **WHEN** the polling fetch detects that another device marked an item as addressed
- **THEN** the checkbox SHALL update within 15 seconds without page reload, flicker, or scroll position change

### Requirement: Addressed state does not modify original checkoff data
The system SHALL store addressed state in a separate `daily_restock_items` table and SHALL NOT alter `compartment_checks.item_data` or `DailyUnitException` entries.

#### Scenario: Item is addressed
- **WHEN** a crew member marks a Restocking List entry as addressed
- **THEN** the original exception data SHALL remain unchanged
- **AND** the item SHALL still appear in exceptions and records views according to existing rules
