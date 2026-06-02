## Context

The admin users page was a standalone layout with `max-w-4xl p-6`, a side-by-side grid, and non-standard heading styling. The edit form used `sm:min-w-64` which forced overflow when the side-by-side layout ran out of space.

## Goals / Non-Goals

**Goals:**

- Stack sections vertically inside a shared white panel matching the Units and Fleet pattern.
- Use red labels for section headings ("User Management", "Existing Users").
- Make the edit form wrap inline to prevent overflow.

**Non-Goals:**

- Change form fields or validation logic.

## Decisions

1. Stack sections vertically inside a shared white panel.

   The previous `lg:grid-cols-2` layout put Add New User and Existing Users side by side. When editing, the expanding form pushed content out of view. Stacking solves this naturally.

   Alternative: keep grid but use `overflow-x-auto`. Ugly and doesn't fix the root cause.

2. Inline edit form with `flex-wrap`.

   The old edit form used `grid gap-2 sm:min-w-64` which added a minimum width. Using `flex flex-wrap` lets the form shrink and wrap naturally on any screen width.

   Alternative: keep the edit form at full width below the card info. Uses more vertical space but equally valid.
