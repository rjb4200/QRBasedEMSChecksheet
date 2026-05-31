## Context

The Fleet Matrix title section, unit card grid, and Print Daily Check Sheets bar are currently separate elements. Placing them inside a shared `rounded-3xl bg-white p-5 shadow-sm` container visually groups them as one fleet operations panel.

## Goals / Non-Goals

**Goals:**

- Wrap the title, card grid, and print bar in a single shared panel.

**Non-Goals:**

- Change unit card styling within the panel.
- Move the StorageWarningBanner, RecentComments, or Exceptions sections.
