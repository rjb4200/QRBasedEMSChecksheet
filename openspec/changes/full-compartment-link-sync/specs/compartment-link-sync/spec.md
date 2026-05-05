## REMOVED Requirements

### Requirement: Full compartment link synchronization
**Reason**: Compartment linking is being removed from the application.
**Migration**: Use independent compartment configuration. Changes to one compartment do not affect any other compartment.

#### Scenario: No synchronization applies
- **WHEN** an admin changes equipment, par levels, ordering, or subcategories for a compartment
- **THEN** the change applies only to that compartment
