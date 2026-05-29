## Context

Section comments are already saved to `daily_section_comments` during compartment and kit checkoff submissions. The crew-facing unit dashboard reads and displays them. But the admin Records page data pipeline never queries that table, so section comments are invisible in historical records. This change adds the query, wires the data into the existing records read model, and adds a compact display on the Records page.

## Goals / Non-Goals

**Goals:**
- Load `daily_section_comments` for the selected date in the Records data pipeline.
- Add section comments to the `DailyUnitRecord` type.
- Display section comments under each unit record, labeled by source compartment/kit name.
- Keep unit-level comments visually separate from section comments.
- Hide the section comments block when no section comments exist.

**Non-Goals:**
- Do not change the section comment entry flow.
- Do not change checkoff completion logic.
- Do not change archive, email, print, or export behavior.

## Decisions

### Decision 1: Add section comments to the existing `getLedgerBackedDailyUnitRecordsForDate` query

The function already queries multiple tables in parallel. Adding `daily_section_comments` as one more parallel query is the smallest correct change.

Rationale: This avoids a separate API or page-level query and keeps the data-loading pattern consistent.

### Decision 2: Group section comments by unit

Build a `Map<string, SectionComment[]>` keyed by `unit_id` and pass it into `buildLedgerBackedDailyUnitRecords`.

Rationale: The read model already processes data grouped by unit-day. Section comments follow the same grouping pattern.

### Decision 3: Display section comments as a compact block after unit comments

Render a "Section Comments" block after the existing `record.comments` section, listing `source_name: comment`.

Rationale: This is visually similar to how the unit dashboard renders section comments and keeps unit-level and section-level comments distinct.

## Risks / Trade-offs

- **Risk**: Section comments with very long text could clutter the Records page. -> **Mitigation**: The schema already has a 2000-character limit. The display uses compact text formatting.

## Migration Plan

1. Add section comment row type and query in `archive-records.ts`.
2. Add `sectionComments` to `DailyUnitRecord` and the read model builder.
3. Render section comments on the Records page.
4. Run lint, typecheck, and build.
