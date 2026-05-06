## Why

Quantity/count equipment rows in the crew checkoff UI become cramped on mobile when equipment names are long because the name and quantity controls compete for the same horizontal space. This hurts field usability for EMS crews who need readable item names and large tap targets on phones.

## What Changes

- Update quantity/count item rows to use a mobile-first stacked layout where the item name and metadata get full width and the count controls move below them.
- Allow long equipment names to wrap naturally instead of shrinking or overflowing.
- Keep quantity controls large and easy to tap, preserving the existing minus/current-count/plus interaction.
- Preserve checkbox and condition row behavior and layout except for safe shared text wrapping improvements.
- Preserve checkoff submission payloads, defaults, par logic, and database behavior.

## Capabilities

### New Capabilities

- `mobile-checkoff-quantity-layout`: Responsive crew checkoff layout behavior for quantity/count equipment rows.

### Modified Capabilities

## Impact

- Affected UI: `src/app/checkoff/[unitId]/[compartmentId]/checkoff-form.tsx` quantity item rendering.
- No database, Supabase, QR, route, archive, analytics, or submission schema changes.
- Validation should include narrow mobile widths, long equipment names, checkbox rows, condition rows, lint, and typecheck.
