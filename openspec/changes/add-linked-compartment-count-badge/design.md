## Context

The compartment linking feature allows administrators to link compartments across different units using a shared link name. When compartments are linked, they share the same configuration (par levels, subcategories, items). Currently, when viewing or editing compartments with links, there is no way to see how many other compartments share the same link.

## Goals / Non-Goals

**Goals:**
- Display a count badge next to linked compartment names showing how many compartments share that link
- Help admins understand the scope of their links at a glance
- Prevent accidental link changes that would affect multiple compartments

**Non-Goals:**
- Changing link behavior or synchronization logic
- Adding the ability to see which specific units are linked
- Allowing bulk operations on linked compartments

## Decisions

### 1. Badge Placement

**Decision:** Place badge inline next to the link name text in the compartment list/item display.

**Rationale:**
- Keeps information in context where link name is already displayed
- Minimal visual disruption to existing layout
- Familiar pattern from other badge usages in the app

### 2. Badge Styling

**Decision:** Use a small pill-shaped badge with red background (matching admin theme) and white text.

**Rationale:**
- Consistent with existing badges in the app (exception badges, status badges)
- High contrast for readability
- Compact size that doesn't overwhelm the link name

### 3. Count Logic

**Decision:** Count is based on ALL compartments across ALL units that have the same `linked_compartment_name` value (excluding archived/OOS units).

**Rationale:**
- Provides accurate scope of the link
- Excluding archived/OOS units keeps count relevant to active operations
- Consistent with how the link sync feature works

### 4. Where to Display

**Decision:** Show the badge in:
- Unit edit page where compartments are listed
- Compartment cards showing link name
- Anywhere link name is displayed in admin UI

**Rationale:**
- Any place admin sees the link name should show the scope
- Ensures consistent information throughout the admin experience

## Risks / Trade-offs

- **Performance:** Counting linked compartments requires querying all units. Mitigated by efficient database query with proper indexing.
- **Stale Count:** Count may become outdated if another admin changes links. Mitigated by refreshing data when page loads.

## Migration Plan

1. Add database query function to get link counts
2. Modify compartment display component to show badge
3. Style badge to match admin theme
4. Test with various link configurations
5. Verify existing link functionality still works

## Open Questions

- Should badge show "1" for singletons or be hidden? (Show "1" to indicate it's linked but only to itself)
- Should count include or exclude current compartment? (Include current - total count of linked items)