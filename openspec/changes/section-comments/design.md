## Context

The unit dashboard currently shows a single unit-level comment field with save/clear actions. The compartment and kit checkoff pages have no comment capability. This design adds per-section comments without changing the existing unit-level comment behavior, checkpoint completion logic, or exception logic.

## Goals / Non-Goals

**Goals:**
- Add an optional comment textarea to compartment and kit checkoff pages.
- Save comments to a new `daily_section_comments` table, keyed by unit/date/shift/source.
- Display all section comments merged on the unit dashboard, labeled by source name.
- Upsert by unique key to prevent duplicates on re-submission.
- Keep the existing unit-level comment unchanged.

**Non-Goals:**
- Do not change exception logic or completion percentage logic.
- Do not require comments to submit a section.
- Do not add chat, threading, rich text, or notifications.
- Do not remove the existing unit-level comment.

## Decisions

1. **Use a separate `daily_section_comments` table rather than extending the existing `daily_unit_comments` table.**

   Rationale: Section comments have a different key structure (unit + date + shift + source_type + source_id) and should not conflict with the single unit-level comment. A separate table keeps queries simple and avoids optional fields that would be null for unit-level comments.

   Alternative considered: Add `source_type` and `source_id` columns to `daily_unit_comments`. This would mix unit-level and section-level comments in one table, complicating queries and uniqueness constraints.

2. **Store `source_name` as a snapshot at comment time.**

   Rationale: If a compartment or kit is renamed later, the saved comment should still display the original name. Storing the name at write time avoids needing joins to historical name data.

3. **Upsert on submit, delete on blank.**

   Rationale: Re-submitting a section should update the existing comment row rather than creating duplicates. If the user clears the comment and submits, the row should be removed.

4. **Display section comments in source_name order on the unit page.**

   Rationale: Consistent ordering makes the merged list predictable. Sorting by `source_name` then `created_at` groups by section and shows latest first within each group.

## Risks / Trade-offs

- Section comments are not yet included in print/PDF/email outputs → Follow-up work; the unit page display provides immediate value.
- Comment text length should be bounded → Use a reasonable max length (2000 chars, matching the existing unit comment limit).
