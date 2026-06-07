## MODIFIED Requirements

### Requirement: Real-time status via page refresh or polling
The fleet matrix SHALL update unit statuses periodically via client-side polling of the fleet status API endpoint.

#### Scenario: Status updates on polling interval
- **WHEN** the polling interval elapses (every 30 seconds)
- **THEN** the fleet matrix SHALL fetch `GET /api/admin/fleet-status`
- **AND** the fleet matrix SHALL update displayed completion data to match the response
- **AND** discrepancies, comments, issues, and storage warnings on the page SHALL NOT be re-fetched as part of this poll cycle

#### Scenario: API failure does not clear displayed data
- **WHEN** the fleet status API request fails (network error or non-200 response)
- **THEN** the fleet matrix SHALL continue displaying the last successfully fetched unit data
- **AND** no error SHALL be surfaced to the user
