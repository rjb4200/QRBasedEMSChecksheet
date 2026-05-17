## ADDED Requirements

### Requirement: Crews can manually add restock items
The Restocking List SHALL provide an Add control that allows crew members to enter restock items not generated from checkoff exceptions.

#### Scenario: Crew opens Add form
- **WHEN** a crew member clicks the Add button in the expanded Restocking List header
- **THEN** an inline form SHALL appear below the header bar with an item name field and an optional note field
- **AND** the form SHALL include a submit action and a cancel action

#### Scenario: Crew adds a manual item
- **WHEN** a crew member fills in an item name and submits the form
- **THEN** the item SHALL be saved to the `daily_manual_restock_items` table
- **AND** the item SHALL appear immediately in the Restocking List under a "Manual" grouping
- **AND** the form SHALL close and clear

#### Scenario: Crew cancels Add form
- **WHEN** a crew member clicks cancel on the inline Add form
- **THEN** the form SHALL close without saving any data

#### Scenario: Empty item name rejected
- **WHEN** a crew member submits the Add form with a blank or whitespace-only item name
- **THEN** the system SHALL reject the submission
- **AND** the form SHALL remain open

### Requirement: Manual restock items persist across page loads
Manual restock items SHALL be stored in the `daily_manual_restock_items` database table and SHALL be fetched on page load for the current shift.

#### Scenario: Page loads with existing manual items
- **WHEN** a crew member opens the unit page for a shift where manual items were previously added
- **THEN** those manual items SHALL appear in the Restocking List

#### Scenario: Page loads with no manual items
- **WHEN** a crew member opens the unit page for a shift where no manual items exist
- **THEN** no manual grouping SHALL appear in the Restocking List

### Requirement: Manual restock items support addressed checkboxes
Manual restock items SHALL include an interactive addressed checkbox with the same optimistic toggle behavior as generated exception entries.

#### Scenario: Crew marks a manual item as addressed
- **WHEN** a crew member checks the checkbox next to a manual restock item
- **THEN** the checkbox SHALL immediately appear checked
- **AND** the addressed state SHALL be saved to `daily_manual_restock_items`
- **AND** if the save fails, the checkbox SHALL revert to its previous state

#### Scenario: Crew unmarks a manual item as addressed
- **WHEN** a crew member unchecks a previously addressed manual item
- **THEN** the checkbox SHALL immediately appear unchecked
- **AND** the addressed state SHALL be cleared in `daily_manual_restock_items`

### Requirement: Manual restock items can be removed
Manual restock items SHALL provide a delete action so crews can remove items entered by mistake.

#### Scenario: Crew deletes a manual item
- **WHEN** a crew member activates delete on a manual restock item
- **THEN** the item SHALL be removed from the database
- **AND** the item SHALL disappear from the Restocking List

#### Scenario: Generated exception rows cannot be deleted
- **WHEN** a crew member views a generated exception entry
- **THEN** no delete action SHALL be present for that entry

### Requirement: Manual items appear in Copy output
Manual restock items SHALL be included when the crew copies the Restocking List to the clipboard.

#### Scenario: Copy includes manual items
- **WHEN** a crew member clicks Copy and manual items exist
- **THEN** the copied text SHALL include a "Manual" section with all manual items and their addressed status

### Requirement: Manual items appear in Print output
Manual restock items SHALL be included when the crew prints the Restocking List.

#### Scenario: Print includes manual items
- **WHEN** a crew member clicks Print and manual items exist
- **THEN** the printed output SHALL include a "Manual" section with all manual items

### Requirement: Manual item addressed state is shared across devices
The system SHALL synchronize manual item addressed state across devices using the same polling mechanism as generated exception entries.

#### Scenario: Polling fetches manual item state
- **WHEN** the Restocking List is expanded and polling runs
- **THEN** the system SHALL fetch manual item addressed state alongside generated exception addressed state
- **AND** manual item checkboxes SHALL update within 15 seconds without page reload

### Requirement: Manual items use a separate database table
The system SHALL store manual restock items in a `daily_manual_restock_items` table with columns for unit, shift, item name, note, source name, and addressed state.

#### Scenario: Manual item row structure
- **WHEN** a manual restock item is saved
- **THEN** the row SHALL include a non-null item name of at most 200 characters
- **AND** the row SHALL include an optional note of at most 1000 characters
- **AND** the row SHALL include a source name defaulting to "Manual"
- **AND** the row SHALL include an addressed boolean defaulting to false
