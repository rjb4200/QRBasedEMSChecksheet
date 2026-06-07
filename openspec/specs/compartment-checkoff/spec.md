## ADDED Requirements

### Requirement: Checkoff forms display item list with par levels and previous shift data
Each compartment checkoff form SHALL display all items assigned to that compartment with their par levels and the previous shift's entered values for reference.

#### Scenario: Form loads with item list
- **WHEN** a crew member opens a compartment checkoff form
- **THEN** all items for that compartment are displayed with name, par level, and previous shift count

### Requirement: Checkoff forms do not require login
Routine compartment checkoff forms SHALL be accessible and submittable without a Supabase authentication session.

#### Scenario: Public QR checkoff opens
- **WHEN** an unauthenticated crew member scans a valid compartment QR code
- **THEN** the form opens without requiring email login

#### Scenario: Public QR checkoff submits
- **WHEN** an unauthenticated crew member completes and submits the form
- **THEN** the compartment is marked completed and data is saved without a user identity

#### Scenario: Previous shift data shown alongside par level
- **WHEN** user views an item with quantity input
- **THEN** the display shows "Par: X | Prev: Y" where X is par level and Y is previous shift value

### Requirement: Unit checkoff page collects crew names
The unit checkoff page SHALL allow providers checking the unit to enter crew names for the current daily checkoff.

#### Scenario: Provider names saved for current unit checkoff
- **WHEN** a crew member enters provider names below Current progress and taps the unlocked icon
- **THEN** the names are stored for that unit and daily checkoff date, the field turns green, and the icon changes to locked

#### Scenario: Provider names unlocked for editing
- **WHEN** a crew member taps the locked icon
- **THEN** the provider names field unlocks for editing, no longer counts toward completion, and can be saved again by tapping the unlocked icon

#### Scenario: Provider names field has stable size
- **WHEN** a crew member locks or unlocks provider names
- **THEN** no helper text appears or disappears below the field

#### Scenario: Crew lock counts toward completion
- **WHEN** provider names are locked for the current daily unit checkoff
- **THEN** the crew entry counts as one completed check toward the unit's current progress

#### Scenario: Crew lock updates progress immediately
- **WHEN** a crew member locks or unlocks provider names
- **THEN** the current progress count and percentage update immediately on the page

#### Scenario: Checkbox items omit par label
- **WHEN** a crew member views a checkbox yes/no item on a compartment checkoff form
- **THEN** the item does not display a par level label

### Requirement: Unit checkoff page shows past check exceptions before previous shift summary
The unit checkoff page SHALL show missing and below-par exceptions from the previous shift near the bottom of the page, followed by the previous shift completion summary.

#### Scenario: Past check exceptions displayed
- **WHEN** the previous shift has submitted missing or below-par items
- **THEN** the unit checkoff page lists those exceptions under "Exceptions for past check"

#### Scenario: Previous shift summary moved below exceptions
- **WHEN** the unit checkoff page renders
- **THEN** the Previous shift summary appears below the Exceptions for past check section

### Requirement: Quantity items use stepper input
Items with input type "quantity" SHALL use large [-] and [+] stepper components for adjusting counts.

#### Scenario: User adjusts quantity with stepper
- **WHEN** user taps [+] or [-] on a quantity item
- **THEN** the count increments or decrements by 1

#### Scenario: Quantity defaults to par level
- **WHEN** a quantity form first loads with no prior data
- **THEN** the quantity is pre-populated to the par level value

### Requirement: Checkbox items use toggle input
Items with input type "checkbox" SHALL display a toggle or checkbox for done/not-done status.

#### Scenario: User marks checkbox item as done
- **WHEN** user taps a checkbox item
- **THEN** the item is marked as completed

### Requirement: Condition items use status selector
Items with input type "condition" SHALL provide a status selector (OK/Low/Missing) with an optional numeric value field for items like PSI readings.

#### Scenario: User records O2 tank condition
- **WHEN** user selects a condition item for O2 tank
- **THEN** user can select OK/Low/Missing and optionally enter the PSI value

### Requirement: Forms auto-save in real-time
The checkoff form SHALL automatically save entered data to the database in real-time to prevent data loss.

#### Scenario: Data persists across form interactions
- **WHEN** user enters values and navigates away briefly
- **THEN** all entered data is preserved when returning to the form

### Requirement: Time-on-page is logged for each compartment
The system SHALL log the duration a user spends on each compartment checkoff form for analytics purposes.

#### Scenario: Time logged on form submission
- **WHEN** user submits a completed compartment form
- **THEN** the time-on-page duration is recorded with the submission data

### Requirement: Forms display compartment photo if available
If a compartment has an uploaded photo, the checkoff form SHALL display the photo at the top of the form.

#### Scenario: Photo displayed on form
- **WHEN** user opens a compartment form that has a photo
- **THEN** the photo is displayed above the item list

#### Scenario: No photo gracefully handled
- **WHEN** user opens a compartment form without a photo
- **THEN** the form displays without a photo section

### Requirement: Form submission marks compartment as completed
When the user submits a completed checkoff form, the compartment status SHALL change from Yellow to Green and the data SHALL be saved to the database.

#### Scenario: Successful form submission
- **WHEN** user taps the submit button on a checkoff form
- **THEN** compartment status becomes Green and data is archived for the shift

### Requirement: Checkoff item cards display live exception feedback
The checkoff form SHALL classify each item card from the current live form value and display visual feedback for missing, understocked, overstocked, and non-OK condition states while the crew member is checking the compartment or shared kit.

#### Scenario: Unchecked checkbox displays missing feedback
- **WHEN** a crew member leaves a checkbox item unchecked
- **THEN** the item card displays a `Missing` indicator with red visual treatment including a light red background and red border

#### Scenario: Quantity below par displays understocked feedback
- **WHEN** a crew member enters a quantity lower than the item's par level
- **THEN** the item card displays understocked feedback with red visual treatment including a light red background and red border

#### Scenario: Quantity at par is visually neutral
- **WHEN** a crew member enters a quantity exactly equal to the item's par level
- **THEN** the item card remains visually neutral and does not display par or helper text

#### Scenario: Quantity over par by one displays text-only feedback
- **WHEN** a crew member enters a quantity exactly one greater than the item's par level
- **THEN** the item card displays helper text in the format `Overstocked: +1` without applying amber background or amber border treatment

#### Scenario: Quantity over par by two or more displays amber feedback
- **WHEN** a crew member enters a quantity at least two greater than the item's par level
- **THEN** the item card displays helper text in the format `Overstocked: +X` and uses amber attention treatment with a pale amber background or border accent

#### Scenario: Non-OK condition displays amber feedback
- **WHEN** a crew member selects a condition status other than `OK`
- **THEN** the item card uses amber attention treatment rather than red failure treatment

#### Scenario: Feedback updates as values change
- **WHEN** a crew member changes a quantity, checkbox, or condition value while the form is open
- **THEN** the item card feedback updates immediately without requiring navigation, submit, or a separate detail view
