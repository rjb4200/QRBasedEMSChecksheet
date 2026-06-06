## Context

The current issue detail page has functional editing and notes but the layout is a flat stack of rounded cards with no visual hierarchy. A delete option is missing entirely. This change adds deletion and restructures the layout to resemble GitHub's issue page.

## Goals / Non-Goals

**Goals:**
- Add a delete button with confirmation on the detail page
- Restructure layout: header area, content body, discussion section
- Navigate to `/admin/issues` after successful deletion

**Non-Goals:**
- No soft-delete or archival (hard delete only)
- No sidebar (assignees, milestones) — Stage 1A minimal design
- No changes to the list page

## Decisions

### Decision 1: Delete button in the actions area next to Edit

The title area shows [Edit] and [Delete] action buttons. Delete opens a confirm step (inline or inline replacement showing "Delete? Confirm / Cancel"). After successful delete, `router.push("/admin/issues")` navigates back.

**Rationale:** GitHub places "Delete issue" under a menu, but for our minimal design, a visible button with confirmation is clearer and requires less UI depth.

### Decision 2: Layout restructured into three clear sections

```
┌─────────────────────────────────────────────────┐
│  ← Back to Issues                                │
│                                                  │
│  HEADER                                          │
│  ┌────────────────────────────────────────────┐  │
│  │  Title           [Edit] [Delete]            │  │
│  │  [Status badge]                             │  │
│  │  Unit · Creator · Timestamp                 │  │
│  │  Tags: [badge] [badge] [edit tags]          │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  CONTENT                                         │
│  ┌────────────────────────────────────────────┐  │
│  │  Description text...                        │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  DISCUSSION                                      │
│  ┌────────────────────────────────────────────┐  │
│  │  Notes (3)                                  │  │
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │  Note 1 · Author · Timestamp          │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  │  ┌──────────────────────────────────────┐   │  │
│  │  │  Note 2 · Author · Timestamp          │   │  │
│  │  └──────────────────────────────────────┘   │  │
│  │  [Add note...]                       [Add]  │  │
│  └────────────────────────────────────────────┘  │
│                                                  │
│  STATUS (right-aligned in header or bottom)      │
│  Status: [Open ▾]                                │
└─────────────────────────────────────────────────┘
```

The three sections are visually distinct cards with labeled headers. This gives clear separation between metadata (header), the issue body (content), and the conversation (discussion).

## Risks / Trade-offs

- **[Risk] Accidental deletion** → Mitigation: Two-step confirmation ("Delete?" → "Confirm"). Sufficient for admin-only tool.
- **[Trade-off] No soft-delete** → Acceptable. Deleted issues are gone. Notes cascade-delete. No undo.
