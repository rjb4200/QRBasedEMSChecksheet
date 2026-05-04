## Context

The fleet matrix currently displays all units with similar styling regardless of their OOS status. OOS units should not receive checkoffs, but there's no visual indication on the fleet matrix to communicate this expectation to users.

## Goals / Non-Goals

**Goals:**
- Apply distinct visual styling to OOS unit cards on the fleet matrix
- Make it immediately clear that OOS units will not receive checkoffs
- Combine visual styling with existing OOS badge for clear communication

**Non-Goals:**
- Removing OOS units from the fleet matrix entirely
- Changing any functional behavior related to checkoffs

## Decisions

### 1. Visual Style

**Decision:** Use a dimmed/muted appearance with reduced opacity for OOS unit cards.

**Rationale:** Dimmed styling clearly communicates "inactive" or "not in service" without needing to read text. It visually "de-emphasizes" the unit while still keeping it visible for historical reference.

**Alternative Considered:** Strikethrough on unit name. Rejected because it can look like an error and may not render clearly on all devices.

**Implementation:** Apply reduced opacity (e.g., 60% opacity) and desaturated colors to OOS unit cards.

### 2. Combined Badge + Style

**Decision:** Use both the OOS badge (from previous feature) and the dimmed styling together.

**Rationale:** The badge provides text clarity while the dimmed styling provides immediate visual recognition at a glance.

## Risks / Trade-offs

- **Visual Confusion:** Mixing badge and dimmed styling might be too much. Mitigated by keeping both subtle but noticeable.
- **Accessibility:** Dimmed styling might be hard to see for some users. Mitigated by keeping the OOS badge visible which provides additional cue.

## Migration Plan

1. Update fleet matrix unit card component to apply dimmed styling for OOS units
2. Test with OOS and non-OOS units
3. Deploy to production

## Open Questions

- Should archived units also have this dimmed styling? (The user specifically asked for OOS - archived units are already handled separately)