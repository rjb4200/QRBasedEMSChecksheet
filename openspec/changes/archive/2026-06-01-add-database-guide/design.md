## Context

The project has two markdown guides (ADMINGUIDE.md, USERGUIDE.md) covering operational workflows. A third document covering database architecture would serve as technical reference for schema understanding, troubleshooting, and maintenance.

## Goals / Non-Goals

**Goals:**

- Document every table with its purpose, key columns, and relationships.
- Map the data lifecycle from daily checkoff through archiving and rotation.
- Document stored procedures, RLS policies, and retention rules.

**Non-Goals:**

- Auto-generate from schema. This is a manually maintained reference.
- Add a database guide viewer page. The guide is available as markdown in the repo.

## Decisions

1. Organize by domain: operational tables first, then configuration, then admin.

   Readers most often need to understand the checkoff data flow. Configuration tables are less frequently referenced.

   Alternative: alphabetize. Less useful for understanding relationships.

2. Include ASCII relationship diagrams.

   Visual maps of foreign key relationships help readers understand table connections without running queries.

   Alternative: list foreign keys as text. Harder to scan.
