## Context

Unit checks already store per-item values in `compartment_checks.item_data`, and multiple parts of the app already derive exceptions from those values. Restocking needs the same facts presented as a consolidated operational list across compartments and assigned kits, without creating a separate inventory or restocking workflow.

## Goals / Non-Goals

**Goals:**
- Generate a grouped Restocking List from existing check data and item definitions.
- Reuse one shared exception/restocking normalization path for current unit pages, print/PDF/email output, and historical records.
- Support compartments and assigned kits as equivalent restocking sources.
- Update the current checkoff UI immediately as item values change.
- Keep the list hidden when no deficiencies exist.

**Non-Goals:**
- Do not create a restocking table or persistent restocking records.
- Do not introduce new deficiency rules separate from existing exception logic.
- Do not assume unchecked items are missing.
- Do not change checkoff submission requirements.
- Do not build inventory fulfillment, assignment, or notification workflows.

## Decisions

1. **Create a shared restocking/exception utility instead of copying logic per surface.**

   Rationale: Quantity, checkbox, and condition exceptions must mean the same thing on the checkoff page, Records page, printouts, PDF exports, and daily email reports. A shared utility avoids divergent text or duplicate edge-case handling.

   Alternative considered: Add display-specific helpers in each page. This is faster initially but risks inconsistent exception behavior and duplicate maintenance.

2. **Derive lists from check data at render time.**

   Rationale: `compartment_checks.item_data` plus item definitions already preserve enough information to reproduce deficiencies. Deriving the list avoids schema changes and keeps historical records tied to archived check data.

   Alternative considered: Persist generated restocking rows. That would create sync and historical drift problems and contradict the operational-summary goal.

3. **Use grouped entries by source section.**

   Rationale: Crews need to know where each item belongs. Grouping by compartment or kit name keeps duplicate equipment names understandable and treats assigned kits independently per unit.

   Alternative considered: A flat item list. This is compact but loses source context and makes restocking duplicates ambiguous.

4. **Use client-side derivation for in-progress checkoff form updates.**

   Rationale: The checkoff form already owns live item state before save. Deriving visible deficiencies from local state gives immediate feedback without extra server round trips.

   Alternative considered: Wait for autosave/server reads. That would lag behind the user and make the list feel stale.

## Risks / Trade-offs

- Historical records may lack item definitions for deleted or renamed items -> Use saved source names and best-effort item names where available; avoid fabricating missing deficiencies.
- Large units may produce long lists -> Keep the section compact and grouped, and hide it entirely when empty.
- Existing exception logic is currently spread across surfaces -> Consolidation may require careful refactoring to avoid behavior changes outside restocking display.
- Print/PDF/email layouts may have limited vertical space -> Render only when exceptions exist and use compact grouped text.
