## MODIFIED Requirements

### Requirement: Action button color reflects unit service status
The admin units list page SHALL use red accent styling for the Set OOS button on in-service units and muted slate styling for the QR Code, Edit, and Delete buttons in all unit states.

#### Scenario: In-service Set OOS button has red accent
- **WHEN** a unit row has `status = in_service`
- **THEN** the Set OOS button SHALL use red background with white text

#### Scenario: QR Code button uses slate in all states
- **WHEN** the admin units list page renders a unit row
- **THEN** the QR Code icon button SHALL use muted slate styling regardless of unit status

#### Scenario: OOS unit buttons use slate styling
- **WHEN** a unit row has `status = out_of_service`
- **THEN** the Set OOS button SHALL use muted slate styling
