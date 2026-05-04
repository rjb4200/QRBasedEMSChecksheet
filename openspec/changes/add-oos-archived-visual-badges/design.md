## Context

The application supports OOS (Out of Service) and archived status for units, but there is currently no visual indication of these statuses on the fleet panel or unit pages. Admin users and supervisors need at-a-glance recognition of unit status.

## Goals / Non-Goals

**Goals:**
- Display "OOS" badge with orange color on fleet panel for OOS units
- Display "ARCHIVED" badge with grey color on fleet panel for archived units
- Display corresponding badges on unit detail pages
- Use distinct, accessible colors for each status

**Non-Goals:**
- Changing any functional behavior based on status
- Adding notifications or alerts for status changes

## Decisions

### 1. Badge Styling

**Decision:** Use orange/amber for OOS and grey for archived.

**Rationale:**
- Orange (amber-500) is standard for warning/caution status like OOS
- Grey is standard for inactive/archived items
- These colors are accessible and provide clear visual distinction
- Matches existing application color patterns

### 2. Badge Placement

**Decision:** Place badge in the unit card header area, visible immediately when viewing the fleet.

**Rationale:** This position ensures the badge is the first thing noticed when scanning the fleet. On unit pages, place it near the unit name/title.

### 3. Badge Text

**Decision:** Use "OOS" for Out of Service and "ARCHIVED" for archived units.

**Rationale:** Clear, unambiguous text that immediately communicates the status. No abbreviations that might confuse users.

## Risks / Trade-offs

- **Visual Clutter:** Adding badges to all units might clutter the UI. Mitigated by only showing badges for OOS/archived units, not active units.
- **Color Accessibility:** Orange and grey should be distinguishable for color-blind users. Mitigated by also having text labels, not just color.

## Migration Plan

1. Create badge component with OOS and archived variants
2. Update fleet panel unit card to display badge for OOS units
3. Update fleet panel unit card to display badge for archived units
4. Update unit detail page to display badge
5. Test with various unit states
6. Deploy to production

## Open Questions

- Should archived units be hidden from the fleet panel entirely? (No, the user specifically asked for badges to show archived status, not hidden)
- Should the badge show the date the status was set? (Optional enhancement, not required)