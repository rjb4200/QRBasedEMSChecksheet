## Context

The application stores operational checksheet layout data in Supabase tables for units, compartments, equipment catalog rows, templates, kits, daily crews, checks, ledgers, and archives. The current data is not the desired EC4 baseline and must be replaced while preserving login/admin access.

## Goals / Non-Goals

**Goals:**
- Clear operational layout and historical check data in dependency-safe order.
- Preserve authentication/admin data.
- Seed a single `EC4` unit with compartments and equipment from the provided checklist.
- Capture subcategory headings where the schema supports them on `unit_compartment_items`.
- Use numeric par levels when the checklist provides a count or minimum count.

**Non-Goals:**
- Change database schema.
- Seed templates or shared kits after the reset.
- Preserve historical checks, reports, or old layout data.
- Build UI for importing arbitrary lists.

## Decisions

- Use one transactional SQL operation for reset and seed so partial data is not left behind if any insert fails.
- Delete child/dependent rows before parent rows to satisfy foreign keys.
- Preserve `users`, `user_roles`, `admin_users`, and auth schema data to keep access intact.
- Treat repeated equipment names as one catalog item reused across compartments.
- Use `quantity` input for counted supplies, `checkbox` for operational/appearance checks, and `condition` for battery/pressure/readiness checks.
- For range quantities such as `5-7`, use the minimum as the par level because below the minimum is always a readiness exception.

## Risks / Trade-offs

- Destructive reset removes historical operational records. Mitigation: scope is explicitly confirmed and excludes login/admin data.
- Checklist text contains ambiguous grouping and some line wraps. Mitigation: preserve headings as compartments/subcategories and use practical item names.
- Normalizing repeated equipment names can hide compartment-specific context. Mitigation: keep compartment assignment rows separate with their own par/input values.
