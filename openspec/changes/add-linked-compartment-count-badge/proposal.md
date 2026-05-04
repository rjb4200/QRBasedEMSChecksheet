## Why

When administrators link compartments across units using a shared link name, there is currently no visual indication of how many compartments are linked together. A badge showing the link count will help administrators quickly understand the scope of their linked compartments and avoid accidentally breaking existing links.

## What Changes

- Add a small badge (pill shape) next to each linked compartment name on the edit compartment page
- Badge displays the count of compartments sharing that link name (e.g., "1", "5")
- Badge appears in the compartment list where the link name is displayed
- Count includes all compartments across all units that share the same link name
- Badge styled with same red primary theme as other admin UI elements

## Capabilities

### New Capabilities

- `linked-compartment-badge`: Visual badge showing count of compartments sharing the same link name.

### Modified Capabilities

- None. This adds a new UI element without modifying functionality.

## Impact

- Modified: Compartment edit page UI (likely in unit edit or compartment component)
- No database changes required
- Improves admin UX for understanding link scope