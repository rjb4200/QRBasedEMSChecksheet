## Why

The project has user and admin guides but no technical reference covering the database schema, table purposes, data lifecycle, and optimization strategies. Administrators and developers maintaining the system need a single reference document that explains what each table stores and how data flows through the system.

## What Changes

- Create `DATABASEGUIDE.md` in the project root documenting the database schema, stored data, relationships, and optimization strategies.
- The guide covers: table inventory, core relationships, data lifecycle (checkoff → ledger → archive → rotation), stored procedures, RLS policies, and retention rules.

## Capabilities

### Modified Capabilities

- `in-app-documentation-guides`: A new `DATABASEGUIDE.md` technical reference is added to the documentation set.

## Impact

- Creates a new `DATABASEGUIDE.md` file in the project root.
- No code changes required.
