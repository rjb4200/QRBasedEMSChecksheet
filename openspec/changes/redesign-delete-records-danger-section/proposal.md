## Why

The data deletion section currently looks like any other Records page card — plain white, no header, no permanent warning. An admin scrolling past could easily overlook the destructive nature of this section. Making it visually distinct with a red danger banner, bold warning text, and DELETED terminology ensures the gravity of these actions is immediately obvious before any interaction.

## What Changes

- Redesign the section with a "DANGER ZONE" red banner header containing a warning icon and subtext about permanent data loss
- Add static warning text visible at all times: "These actions permanently delete operational records. Exported records cannot be recovered after deletion."
- Replace all instances of "Clear" with all-caps "DELETE" throughout the section (labels, buttons, state text)
- Apply red-tinted border and background styling to clearly separate this section from other page cards
- Add warning icons (⚠️) to the section header and action buttons

## Capabilities

### Modified Capabilities

- `archive-history`: Data deletion section redesigned with danger zone visual treatment and DELETE terminology

## Impact

- **Modified**: `src/app/admin/archives/clear-records-section.tsx` — full visual redesign of the component (labels, styling, layout)
- **No route or API changes**
