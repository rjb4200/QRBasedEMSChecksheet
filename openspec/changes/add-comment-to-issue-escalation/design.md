## Context

The Fleet panel's Recent Comments widget displays the latest 3 crew comments (unit-level and section-level) for quick admin review. The Issues tracker (Stage 1A) provides a persistent issue-tracking system. Currently, an admin who sees a report-worthy comment must manually copy the text, navigate to the Issues page, and re-type everything. This adds friction to a workflow that should be one click.

## Goals / Non-Goals

**Goals:**
- Add a "Create Issue" button to each comment card in the Recent Comments widget
- Clicking opens an inline form pre-filled with the comment text, unit name, and source context
- Form submits to the existing `POST /api/admin/issues` endpoint
- Form collapses after successful creation
- Zero new API routes, zero database changes

**Non-Goals:**
- No "Create Issue" button on the Records page or unit page (Future Stage 1C)
- No linking/back-referencing from an issue to its source comment
- No automatic issue creation (always manual admin action)
- No deduplication logic (admins decide what's worth tracking)

## Decisions

### Decision 1: Inline form per comment card, not a modal overlay

The escalation form replaces the comment card in-place when activated — the card expands to show the pre-filled create form. Cancelling returns to the normal comment view. No z-index layering or overlay management needed.

**Rationale:** Simpler implementation than a modal. Since the Recent Comments widget already has its own scroll context, an inline form fits naturally within the existing DOM structure. Avoids z-index conflicts with other Fleet page overlays.

### Decision 2: Pre-fill title with "{Unit} — {Source}" pattern

The issue title is auto-populated as `"{Unit Name} — {Source Name}"` (e.g., "Engine 1 — General" or "Squad 2 — Airway Bag"). The description is pre-filled with the full comment text. The unit dropdown is pre-selected.

**Rationale:** Gives the admin a meaningful starting point they can edit. The unit-source pattern makes issues distinguishable at a glance without requiring the admin to type a title from scratch.

### Decision 3: State per comment card — independent toggles

Each comment card tracks its own `escalating` boolean. Only one card can be in escalation mode at a time (opening one closes any other). This avoids multiple open forms cluttering the widget.

**Rationale:** Single tracking state (an `escalatingId` string) is simpler than managing boolean arrays or per-card state objects.

### Decision 4: No link back from issue to comment

The created issue stores the unit reference and the comment text as its description, but there is no formal foreign key linking `issues.id` to `daily_unit_comments.id` or `daily_section_comments.id`.

**Rationale:** Comments are temporary (rotated with data retention policy). Issues are long-lived. A FK would break when the source comment is rotated out. Future stages can add a `source_comment_id` text field if traceability is needed.

## Risks / Trade-offs

- **[Risk] Comment text exceeds reasonable issue description length** → Mitigation: The textarea in the escalation form is resizable. The admin can trim before submitting. The `issues.description` has no character limit in the database.
- **[Risk] Duplicate issues if admin escalates the same comment twice** → Mitigation: Low risk. The admin sees the comment card disappear after escalation (comment still shows, but there's no visual duplicate-prevention badge). A future stage could track escalated comment IDs.
- **[Trade-off] No deduplication across similar comments** → Acceptable for Stage 1B. Admins are expected to exercise judgment.
