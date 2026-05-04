## Context

The QR-Based EMS Checksheet application currently allows crews to complete daily equipment checkoffs but lacks a mechanism for crews to add notes or comments. Supervisors need visibility into crew observations, equipment issues, or other important information that cannot be captured through the standard checkbox items.

The current data model stores daily checkoffs in the `daily_units` table with fields for compartment items, crew names, and timestamps. The application has public checkoff flows, admin fleet management, and supervisor record viewing capabilities.

## Goals / Non-Goals

**Goals:**
- Add a comments field to capture crew notes during daily checkoffs
- Display comments on the unit viewing page in the correct position (above "Past exceptions" and "Previous shift")
- Include comments in records view and printouts when present
- Hide the comments section entirely when no content is provided
- Store comments in the daily ledger for historical record-keeping

**Non-Goals:**
- Adding rich text editing or formatting for comments (plain text only)
- Creating a notification system for new comments
- Adding comment threads or replies
- Integrating comments into the n8n alert workflow

## Decisions

### 1. Database Storage Location

**Decision:** Add a `comments` column to the `daily_units` table.

**Rationale:** The `daily_units` table already stores all per-unit daily checkoff data including crew names and compartment items. Adding the comments field here keeps all unit-level data together and ensures comments are included in the daily ledger snapshot automatically.

**Alternative Considered:** Create a separate `daily_unit_comments` table. Rejected because comments are tightly coupled to the daily unit record and don't require独立 existence.

### 2. UI Component Placement

**Decision:** Add comments section at the bottom of the unit page, between the last compartment section and the "Past exceptions" section.

**Rationale:** The proposal specifies this placement order. The comments should appear after all checkoff items are complete but before viewing historical exception data.

**Alternative Considered:** Placing comments at the top of the page. Rejected because crews should complete their checkoff items before adding comments.

### 3. Conditional Display Logic

**Decision:** Check if comments field is non-null and non-empty before rendering the section.

**Rationale:** This keeps the UI clean for crews who don't need to add comments while ensuring comments are visible when present.

**Implementation:** Use a simple conditional render in the React component.

### 4. Print Output Integration

**Decision:** Include comments in the print document immediately after the unit header and before compartment items, only when comments exist.

**Rationale:** Printouts serve as official records that supervisors may review. Including comments provides context that may not be visible in the digital view.

## Risks / Trade-offs

- **Data Migration Risk:** Existing daily_unit_records won't have comments data. Mitigated by handling null/empty values gracefully in all display logic.

- **Print Layout Impact:** Adding comments to printouts may increase page count for units with lengthy comments. Mitigated by keeping comments plain text with reasonable character guidance.

- **Historical Record Consistency:** Units checked off before this change won't have comments in historical ledgers. Accepted - this is normal for retroactive features.

## Migration Plan

1. Add `comments` column to `daily_units` table via Supabase migration
2. Update unit detail page UI to add comments section with conditional display
3. Update records view to display comments when present
4. Update print document generation to include comments
5. Deploy and verify in staging
6. Deploy to production

## Open Questions

- Should there be a character limit for comments? (Recommend 500 characters)
- Should comments be editable after the daily ledger is created? (Recommend yes, for corrections)
- Should comments be searchable in the supervisor records view?