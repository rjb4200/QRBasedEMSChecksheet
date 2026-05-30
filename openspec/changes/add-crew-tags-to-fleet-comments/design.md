## Context

Fleet Panel Recent Comments currently render comment rows with unit, source, date/time, and comment text. Crew names are stored separately in `daily_unit_crews.provider_names`, keyed by `unit_id`, `shift_date`, and `shift_period`. Comments are stored in `daily_section_comments`, which already includes `unit_id`, `shift_date`, and `shift_period`, so crew data can be matched without schema changes.

## Goals / Non-Goals

**Goals:**

- Add crew/provider names to Fleet Panel comment rows when matching crew data exists.
- Render crew names as compact tags so they are visible without overpowering the comment text.
- Preserve compact and expanded Recent Comments behavior.
- Avoid showing empty or misleading crew tags when crew names are unavailable.

**Non-Goals:**

- Change crew capture or locking behavior.
- Add crew filtering/searching to Recent Comments.
- Backfill crew names into comment records.
- Add database schema changes.

## Decisions

1. Match crew names by unit, shift date, and shift period.

   The comment row contains the same operational identifiers used by `daily_unit_crews`. Matching this way keeps comments historically tied to the crew assigned for that unit and daily shift.

   Alternative considered: display today's current crew for the unit. That would be wrong for older comments because crew assignment can change by shift/date.

2. Add crew names to the API response rather than deriving in the client.

   The API already owns comment retrieval and can query/match crew rows before returning normalized comment objects. This keeps the client component simple and avoids exposing database-specific joins to UI code.

   Alternative considered: issue a second client request for crews. That would add client complexity and race conditions for minimal benefit.

3. Hide crew tag when names are blank.

   Blank provider names should not render as an empty tag or "Unknown crew" because that would imply data exists when it does not.

   Alternative considered: show "No crew" for missing names. That adds noise to every comment where crew names were not locked or recorded.

## Risks / Trade-offs

- Additional query work on recent-comments endpoint -> keep the crew lookup constrained to the unit/date pairs returned by the comments query.
- Multiple comments for the same unit/date should share one crew value -> use a map keyed by unit/date/shift.
- Crew names may contain multiple providers in one string -> render the stored provider names as one tag to avoid inventing parsing rules.
