## Context

The unit page currently renders three text elements that repeat information already conveyed by the section headers: "Compartment & Kit Notes" under Section Comments, and both "Unit Comments" and a helper paragraph under Daily Unit Comments. The section headers ("Section Comments", "Daily Unit Comments") alone are sufficient.

## Goals / Non-Goals

**Goals:**
- Remove the redundant "Compartment & Kit Notes" h2 from the Section Comments block.
- Remove the redundant "Unit Comments" h2 from Daily Unit Comments.
- Remove the "Optional notes for this unit checkoff..." helper paragraph.
- Keep all section functionality unchanged.

**Non-Goals:**
- Do not change any other page content, comments logic, or database behavior.
- Do not change other surfaces (records, print, PDF).

## Decisions

1. **Simple line removal in `src/app/units/[id]/page.tsx`.**

   Rationale: The changes are purely visual with no logic impact. No component extraction or refactoring needed.

## Risks / Trade-offs

- Users lose the explicit explanation that "Only saved comments appear on records and printed checksheets" -> The Save/Clear buttons and existing behavior make this self-evident after first use.
