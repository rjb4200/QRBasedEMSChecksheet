## Context

The Fleet Panel, System Log, Users, and Kits list pages already used `max-w-7xl`. Archives, Equipment, and Docs used `max-w-6xl`. This change normalizes all admin pages to the same 1280px max-width.

## Decisions

Change `max-w-6xl` to `max-w-7xl` on the `section` or container `div` element. Print-formatting pages and record detail pages are excluded as they use narrower widths intentionally for content readability.
