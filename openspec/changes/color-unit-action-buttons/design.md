## Context

The admin units page action row currently uses all-slate buttons after the iconify change. The Set OOS and QR code buttons should carry red accent color on in-service rows to restore visual hierarchy.

## Goals / Non-Goals

**Goals:**

- Apply `bg-red-700 text-white` to Set OOS and QR icon buttons on in-service rows.
- Keep slate styling on OOS rows for both buttons.

**Non-Goals:**

- Change Edit or Delete icon styling.
- Change button layout or ordering.

## Decisions

1. Conditionally apply red classes based on `unit.status`.

   Use a ternary on the className: `bg-red-700 text-white` when in-service, `border border-slate-300` when OOS.

   Alternative: create separate button variants. Adds abstraction without benefit for two button types.
