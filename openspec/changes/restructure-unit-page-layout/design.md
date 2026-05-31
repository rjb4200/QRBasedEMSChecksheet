## Context

The units page currently has a standalone destructive toggle panel, a bare "Admin" / "Units" header, and a Create form at the bottom. The Fleet Panel was recently restructured with a shared white panel, descriptive titles, and red inline labels. The units page should follow the same visual pattern.

## Goals / Non-Goals

**Goals:**

- Group the destructive toggle and unit list in a shared white rounded panel with a `border-slate-200` border for contrast.
- Position the "Units" red label and toggle stacked vertically inside the panel.
- Use "Unit Management" as the page heading.
- Style "Create a New Unit" with red text.

**Non-Goals:**

- Change the toggle or delete confirmation behavior.
- Move the Create form.

## Decisions

1. Inline the toggle into the shared panel.

   Instead of a separate white panel above the unit list, the toggle becomes part of the shared panel, stacked below the "Units" red label and above the unit list. This groups all unit-list-related controls in one visual container.

   Alternative: keep toggle as a separate panel. Uses more space and doesn't visually group with the unit list.

2. Use "Unit Management" as the page heading.

   Consistent with other admin pages that use descriptive nouns ("System Log", "Daily Readiness Records").

   Alternative: "Manage Units." More verb-like, less consistent.
