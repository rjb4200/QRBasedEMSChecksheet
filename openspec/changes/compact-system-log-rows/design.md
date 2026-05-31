## Context

Collapsed log rows currently use a two-column layout: left side for badges/action/summary, right side for target_type and target_id UUID. The UUID is not human-readable and the summary already contains the target name. Making the collapsed row single-line and removing the redundant column improves scannability.

## Goals / Non-Goals

**Goals:**

- Display badges, action name, and summary on a single responsive line.
- Remove the target_type/target_id column from the collapsed view.

**Non-Goals:**

- Change the expanded detail view.

## Decisions

Use a single flex row that wraps naturally on narrow screens. Separate the action verb from the summary with an em dash. Keep the `details/summary` wrapper for expansion.
