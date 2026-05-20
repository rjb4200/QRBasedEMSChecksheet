## Context

The fleet matrix currently displays all units with similar styling regardless of their service status. Units with `status = out_of_service` should not receive checkoffs, but there's no strong visual indication on the fleet matrix to communicate this expectation, and there is no direct current-state display of when the unit went OOS or which admin set that status.

## Goals / Non-Goals

**Goals:**
- Apply distinct visual styling to OOS unit cards on the fleet matrix
- Make it immediately clear that OOS units will not receive checkoffs
- Combine visual styling with existing OOS badge for clear communication
- Persist current OOS metadata on the unit record
- Show OOS timestamp and admin attribution directly on the fleet matrix

**Non-Goals:**
- Removing OOS units from the fleet matrix entirely
- Changing any functional behavior related to checkoffs
- Replacing the system activity log as the historical audit source

## Decisions

### 1. Visual Style

**Decision:** Use a dimmed/muted appearance with reduced opacity for unit cards where `status = out_of_service`.

**Rationale:** Dimmed styling clearly communicates "inactive" or "not in service" without needing to read text. It visually "de-emphasizes" the unit while still keeping it visible for historical reference.

**Alternative Considered:** Strikethrough on unit name. Rejected because it can look like an error and may not render clearly on all devices.

**Implementation:** Apply reduced opacity (e.g., 60% opacity) and desaturated colors to OOS unit cards.

### 2. Combined Badge + Style

**Decision:** Use both the OOS badge (from previous feature) and the dimmed styling together.

**Rationale:** The badge provides text clarity while the dimmed styling provides immediate visual recognition at a glance.

### 3. Persist OOS Current-State Metadata On Units

**Decision:** Store explicit OOS metadata on the `units` table when a unit is set out of service.

**Rationale:** The system log already captures historical status-change events, but the fleet matrix needs cheap access to the current OOS timestamp and admin attribution. Treating this as unit state avoids repeatedly deriving the latest OOS event from logs.

**Implementation:** Add fields such as:
- `oos_at timestamptz null`
- `oos_by_name text null`
- optional `oos_reason text null` if status notes should be shown as durable unit state

When a unit is set to `out_of_service`, populate the OOS metadata. When a unit returns to `in_service`, clear the OOS metadata.

### 4. Keep System Logs As Historical Audit

**Decision:** Continue writing `unit.status_changed` system log events even after adding persistent OOS metadata.

**Rationale:** The fleet matrix needs current state; the system log remains the historical source of truth for the change history.

## Risks / Trade-offs

- **Visual Confusion:** Mixing badge, dimmed styling, and metadata might be too much. Mitigated by prioritizing a clear hierarchy: badge first, metadata second, muted card treatment third.
- **Accessibility:** Dimmed styling might be hard to see for some users. Mitigated by keeping the OOS badge and metadata text visible.
- **State Drift:** OOS metadata could drift from the log if updates are incomplete. Mitigated by updating and clearing OOS metadata only in the central unit status action.

## Migration Plan

1. Add OOS metadata fields to units
2. Update the unit status change flow to write/clear OOS metadata
3. Update fleet matrix cards to display dimmed styling plus OOS metadata
4. Test with OOS and non-OOS units
5. Deploy to production

## Open Questions

- Should the fleet card show only timestamp/admin, or also the reason/status note when present?
