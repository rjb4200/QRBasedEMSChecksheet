## Context

Admin pages were built incrementally and use different max-width containers. The Fleet Panel and main index pages use `max-w-7xl` while detail pages use `max-w-6xl` or `max-w-5xl`. Some pages also have a legacy "Admin" label that predates the current nav structure.

## Goals / Non-Goals

**Goals:**
- Standardize admin page container to `max-w-7xl`.
- Remove "Admin" red labels from page headers.

**Non-Goals:**
- Do not change page content, routes, or behavior.
- Do not modify the admin layout/nav.

## Decisions

### Decision 1: Standardize to `max-w-7xl`

The Fleet Panel already uses `max-w-7xl`. Making all admin pages use the same width creates visual consistency.

Rationale: There is no functional reason for the narrower containers on detail pages. The wider layout gives more space for item lists and forms.

### Decision 2: Remove "Admin" labels

Delete the `<p className="...text-red-700">Admin</p>` lines from page headers.

Rationale: These labels predate the admin nav rework. The page title itself already identifies the page.

## Risks / Trade-offs

- **Risk**: None — these are purely cosmetic changes.
