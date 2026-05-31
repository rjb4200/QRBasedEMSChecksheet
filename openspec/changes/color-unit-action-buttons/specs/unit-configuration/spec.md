## ADDED Requirements

### Requirement: Action button color reflects unit service status
The admin units list page SHALL use red accent styling for the Set OOS and QR Code action buttons on in-service units, and muted slate styling on out-of-service units.

#### Scenario: In-service unit buttons have red accent
- **WHEN** a unit row has `status = in_service`
- **THEN** the Set OOS button SHALL use red background with white text
- **AND** the QR Code icon button SHALL use red background with white icon

#### Scenario: OOS unit buttons use slate styling
- **WHEN** a unit row has `status = out_of_service`
- **THEN** the Set OOS button and QR Code icon button SHALL use muted slate styling
