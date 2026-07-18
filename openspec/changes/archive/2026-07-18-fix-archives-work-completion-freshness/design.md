## Context

Direct read-only production queries prove the expected work-completion inputs: 55 completed targets plus 2 crew locks out of 160 required actions on 2026-07-17, and 106 completed targets plus 3 crew locks out of 187 required actions on 2026-07-18. The Records page instead displays 15/160 and 3/187, which match the crew-lock portion alone. The source rows contain valid normalized target identities, so the database data and denominator logic are not the cause.

## Goals / Non-Goals

**Goals:**

- Ensure the Archives trend is evaluated against fresh ledger, check, and crew data for each request.
- Preserve the current action-count definition and normalized target de-duplication.
- Verify the deployed page matches known production aggregates.

**Non-Goals:**

- Change the required-work denominator, checkoff writes, or crew-lock rules.
- Add a database migration, RPC, or client-side polling.
- Change Fleet Matrix behavior.

## Decisions

### Explicitly opt the Archives trend out of caching

The Archives page and its work-completion fetch path will explicitly use dynamic, no-store rendering semantics.

Rationale: the values displayed follow an early request-time snapshot rather than the current source rows. Making freshness explicit prevents framework or data caching from preserving a stale action count.

Alternative considered: replace the aggregate with a database RPC. Rejected because direct production queries already return the correct values and the defect is response freshness, not SQL aggregation capability.

### Preserve target identity and add direct production validation

The aggregate will continue to use normalized target identities with legacy fallback. Verification will compare the rendered trend with direct linked-project reads for representative dates.

Rationale: target rows are valid in production; changing the metric definition would mask the cache problem and risk changing historical behavior.

## Risks / Trade-offs

- [Fresh requests add three small database reads to each Archives visit] -> The trend remains limited to 14 dates and existing focused queries.
- [A future caching change reintroduces stale values] -> Add regression coverage and explicitly declare dynamic/no-store behavior at the page and data boundaries.
- [Production and local environments diverge] -> Compare known production dates through the linked Supabase CLI after deployment.
