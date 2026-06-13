## MODIFIED Requirements

### Requirement: Admin can delete equipment items
The admin interface SHALL allow deleting equipment items that are not in use by any active unit, kit, or template. When an item is in use, the delete SHALL be blocked and the UI SHALL display a message listing where the item is still used, including kit names and unit/compartment names.

#### Scenario: Delete unused equipment item
- **WHEN** admin deletes an equipment item not assigned to any compartment, kit, or template
- **THEN** the item is removed from the catalog

#### Scenario: Cannot delete item in use
- **WHEN** admin attempts to delete an equipment item assigned to an active compartment, kit, or template
- **THEN** the delete is blocked and a message appears listing the specific usage locations

#### Scenario: Delete from edit mode behaves same as normal mode
- **WHEN** admin deletes an equipment item while the row is in edit mode
- **THEN** the same server action and error handling SHALL apply as in normal mode

#### Scenario: Usage message lists kit names
- **WHEN** an equipment item is used in one or more kits
- **THEN** the block message SHALL include kit names with unit context when available
