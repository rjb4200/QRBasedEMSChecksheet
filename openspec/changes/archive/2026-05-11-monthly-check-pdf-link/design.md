## Context

The monthly check banner currently shows a text reminder with no actionable link. Crews need the actual checklist PDF form.

## Goals / Non-Goals

**Goals:**
- Add a clickable link to the monthly checklist PDF in the banner

**Non-Goals:**
- Per-unit PDF configuration
- Unit-type-specific PDFs

## Decisions

1. **Hardcoded PDF URL** over configurable/env var
   - Rationale: One PDF for now. Can be made configurable later if needed.

## Risks / Trade-offs

- **[Risk] URL changes** → Mitigation: Easy to update in one component file
