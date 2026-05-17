## ADDED Requirements

### Requirement: Admin QR page supports 3x2 rotated label print format
The admin QR print page SHALL support a 3" × 2" rotated label layout accessible via a `format=3x2-rotated` query parameter.

#### Scenario: Admin selects 3x2 rotated format
- **WHEN** an admin navigates to the QR print page with `?format=3x2-rotated`
- **THEN** the page SHALL render a 5-row × 2-column grid of 3" × 2" label cells
- **AND** each label cell SHALL contain content rotated 90 degrees

#### Scenario: Default format unchanged
- **WHEN** an admin navigates to the QR print page without a format parameter
- **THEN** the existing default QR print grid SHALL render unchanged

### Requirement: Rotated label uses 2x2 QR with identifying text
Each 3x2 rotated label SHALL display a QR code filling a ~2" × 2" area with the compartment/kit name, unit name, and short URL in the remaining strip, so that when the label is peeled off and held upright the QR is at the top with the name underneath.

#### Scenario: Label content renders
- **WHEN** the 3x2 rotated label layout is active
- **THEN** each label SHALL show a QR code sized approximately 2" × 2"
- **AND** the unit name, target name, and short URL SHALL appear in the remaining 1" strip
- **AND** when the label is turned upright, the QR SHALL appear at the top with text below it

### Requirement: Rotated layout prints correctly at 100% scale
The rotated label layout SHALL print reliably at 100% scale on letter-size paper without browser scaling.

#### Scenario: Printing rotated labels
- **WHEN** an admin prints the 3x2 rotated layout
- **THEN** labels SHALL align to a 2-column × 5-row grid on letter paper
- **AND** QR codes SHALL remain scannable after printing
