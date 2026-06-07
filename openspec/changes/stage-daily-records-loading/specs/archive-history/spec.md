## ADDED Requirements

### Requirement: Records page supports staged section rendering
The Records page SHALL preserve existing archive filters, unit cards, summary stats, trend chart, export controls, and Clear Records workflow while allowing those sections to render progressively instead of all at once.

#### Scenario: Existing Records behavior remains after staged rendering
- **WHEN** staged loading is added to the Records page
- **THEN** the unit filter, date input, Print Daily Record, Simple CSV, Detailed CSV, Full Package, and Clear Records workflows SHALL continue to function with their existing behavior
- **AND** unit record cards SHALL display the same data as before

#### Scenario: Selected date and unit filter are preserved
- **WHEN** an admin changes the Records date or unit filter
- **THEN** all staged sections SHALL use the same selected date and unit filter
