## Why

The current Restocking List relies entirely on auto-generated exception rows from checkoff deficiencies. Crews cannot manually add restock items they observe (e.g., a torn oxygen wrench strap or a broken cabinet seal) that were never captured in checkoff data. Additionally, the Print and Copy controls are bulky text buttons placed below the header rather than compact icon buttons integrated into the header bar, wasting vertical space and making the header feel disconnected from its actions.

## What Changes

- Replace Copy and Print text buttons with compact icon buttons in the header bar.
- Move all action controls (Add, Share, Copy, Print, expand/collapse chevron) into the header bar.
- Add a Share icon button that uses the Web Share API when available and falls back to Copy behavior.
- Add an Add Item button that opens an inline form for crews to enter a manual restock item name and optional note.
- Store manual restock items in a new `daily_manual_restock_items` table.
- Display manual items in the Restocking List grouped under a "Manual" section (or a custom source name).
- Extend addressed checkbox behavior to manual items via new server actions.
- Include manual items in Copy and Print output.
- Allow manual items to be deleted if entered by mistake.
- Preserve all existing generated-exception behavior, checkboxes, polling, and addressed state.
- Show the Restocking List section when manual items exist even if no generated exceptions exist.

## Capabilities

### New Capabilities
- `manual-restock-items`: Crews can manually add, address, and remove restock items not generated from checkoff data.

### Modified Capabilities
- `automatic-restocking-list`: Header layout changes (icon buttons, inline controls), manual items appear alongside generated entries, section shown when manual items exist without generated exceptions.

## Impact

- **Code**: `src/components/restocking-list-section.tsx` (header layout, inline Add form, manual item rows, copy/print logic extended), `src/app/units/[id]/actions.ts` (new server actions for manual items), `src/app/units/[id]/page.tsx` (fetch manual items), `src/lib/restocking-list.ts` (new `ManualRestockItem` type).
- **Database**: New `daily_manual_restock_items` table (migration required).
- **Dependencies**: No new npm packages. Unicode or inline SVG icons used for icon buttons (no icon library added).
