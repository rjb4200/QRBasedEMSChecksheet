## Context

The Restocking List component (`src/components/restocking-list-section.tsx`) is a client component rendered on the unit dashboard page. It displays auto-generated deficiency rows grouped by source (compartments/kits), supports interactive addressed checkboxes, cross-device polling, a targeted Print action, and clipboard Copy. All restocking data is derived from existing checkoff data via `src/lib/restocking-list.ts`.

The issue requests two improvements:
1. Replace text-based Print/Copy buttons with compact icon buttons in the header bar, and add a manual Add Item button.
2. Allow crews to manually add restock items that persist in the database and behave like generated entries.

The project has no icon library (no lucide-react, heroicons, etc.). The spec and existing code live in `openspec/specs/automatic-restocking-list/` and `openspec/specs/shared-restocking-addressed-state/`.

## Goals / Non-Goals

**Goals:**
- Compact icon-style action buttons (Add, Copy, Print) in the Restocking List header bar.
- Inline form for entering manual restock item name and optional note.
- Separate `daily_manual_restock_items` table for manual items.
- Manual items displayed in the same list, grouped under "Manual" (or custom source name).
- Manual items support addressed checkboxes with optimistic toggle.
- Manual items included in Copy and Print output.
- Manual items deletable by the crew.
- Restocking List shown when manual items exist even without generated exceptions.

**Non-Goals:**
- No live sync (no Supabase Realtime).
- No full inventory management system.
- No icon library dependency — use inline SVG or Unicode.
- Do not modify original checkoff data when items are addressed.
- Do not make restocking completion required for unit completion.

## Decisions

### Decision 1: Separate table for manual items

**Choice**: New `daily_manual_restock_items` table instead of relaxing constraints on the existing `daily_restock_items` table.

**Rationale**: The existing table has non-null `target_type`, `target_id`, `item_id`, and `issue_type` columns with CHECK constraints that do not apply to manual items. Relaxing those would weaken data integrity for generated exception rows. A separate table keeps both models clean and constrained.

**Alternatives considered**: Adding nullable columns (`manual_item_name`, `manual_note`) plus a `source` discriminator. Rejected because it adds complexity to queries and weakens the existing table's guarantees.

### Decision 7: Share button uses Web Share API with Copy fallback

**Choice**: Add a Share icon button that calls `navigator.share()` when available and falls back to the existing Copy-to-clipboard behavior when the Web Share API is unsupported.

**Rationale**: Mobile crew tablets support native sharing (Messages, email, etc.) which is more useful than clipboard-only Copy. The fallback ensures desktop browsers without `navigator.share` still get clipboard copy. Same formatted text as Copy is used for share data.

### Decision 2: Inline SVG icons, no library

**Choice**: Use inline SVG path data for the Add (+), Share (share arrow), Copy (clipboard), and Print (printer) icons directly in JSX.

**Rationale**: The project has no existing icon library. Adding a dependency for three small icons adds bundle weight for minimal benefit. Inline SVGs are zero-dependency, pixel-perfect at any size, and match the existing bespoke design approach.

**Alternatives considered**: lucide-react, heroicons, react-icons. Rejected to keep the dependency tree small.

### Decision 3: Add button opens inline form below header

**Choice**: Clicking Add toggles a compact inline form that slides in below the header bar (within the expanded section), not a modal.

**Rationale**: On mobile fire apparatus tablets, modals can be hard to dismiss and obscure context. An inline form keeps the restocking list visible and feels faster. The form has two fields (item name + note) so it needs minimal vertical space.

**Alternatives considered**: Modal dialog. Rejected for mobile usability concerns.

### Decision 4: Manual items grouped under "Manual" source

**Choice**: Manual items render in a source group with the heading "Manual" unless a custom source name is provided.

**Rationale**: The existing `RestockingGroup` structure groups by source name. Reusing that pattern for manual items keeps the rendering logic consistent and avoids special-casing the list layout.

### Decision 5: Manual item addressed state stored in same table

**Choice**: `daily_manual_restock_items` has its own `addressed`, `addressed_at`, `addressed_by` columns directly on the row.

**Rationale**: No need for a separate addressed-state table. Each manual item is a single row with an addressed flag, toggled by a server action.

### Decision 6: Manual items polled alongside generated items

**Choice**: Extend the existing 15-second polling to also fetch manual items and merge them into state.

**Rationale**: This ensures manual items added by one device appear on another device after the next poll cycle, without building real-time infrastructure.

## Risks / Trade-offs

- **Risk**: Inline SVGs might not render identically across all browsers. → **Mitigation**: Use standard viewBox-based SVGs with currentColor for theming; test on Chrome, Safari, Firefox.
- **Risk**: Manual item deletion is permanent (no soft-delete). → **Mitigation**: Acceptable for a shift-based operational list; items reset each shift. Add a confirm step (inline undo or brief confirmation).
- **Risk**: Polling fetches both generated and manual addressed state every 15 seconds, adding a small query load. → **Mitigation**: Both queries are simple indexed lookups by unit/date/period; negligible load.
- **Trade-off**: Manual items are not linked to equipment catalog items (free-text only). This keeps the add form simple but means no auto-complete or inventory tracking.

## Migration Plan

1. Run migration to create `daily_manual_restock_items` table with indexes and RLS policies.
2. Deploy server actions alongside component changes.
3. No data migration needed — new table is additive.
4. Rollback: drop the new table and revert the component/spec changes.
