## Context

`/admin/archives` currently computes all Records page data in one `Promise.all` at the top of `ArchivesPage`:

- `getDailyUnitRecords(...)` for unit cards, exceptions, restocking lists, comments, units, and summary inputs
- `getTrendGroups()` for the completion trend chart
- `getRotationDateAvailability(...)` for Clear Records tooling

The route-level `loading.tsx` now makes the initial wait look better, but the page still cannot stream useful sections progressively. The page shell, filter form, summary counts, chart, detailed unit cards, and export/maintenance tools all appear together after the slowest query completes.

## Goals / Non-Goals

**Goals:**
- Make the Records page shell and filter form render without waiting for heavy record/card data
- Add independent Suspense boundaries for summary, trend chart, record cards, and tools
- Allow summary/primary status information to appear before heavy unit detail cards when possible
- Preserve the official completion rules used by the full Records view
- Keep export, print, and Clear Records behavior unchanged

**Non-Goals:**
- Do not redesign the Records page layout
- Do not change check completion semantics
- Do not change CSV, PDF, print, or export-package routes
- Do not stage every admin page in this change
- Do not introduce client-side loading libraries

## Decisions

### 1. Split the page into local async sections

The page should become a lightweight shell that parses search params and renders:

```tsx
<RecordsHeader />
<RecordsFilterSection />
<Suspense fallback={<RecordsSummarySkeleton />}>
  <RecordsSummarySection />
</Suspense>
<Suspense fallback={<RecordsTrendSkeleton />}>
  <RecordsTrendSection />
</Suspense>
<Suspense fallback={<RecordsCardsSkeleton />}>
  <RecordsCardsSection />
</Suspense>
<Suspense fallback={<RecordsToolsSkeleton />}>
  <RecordsToolsSection />
</Suspense>
```

These sections can live in `src/app/admin/archives/page.tsx` initially to keep the change local. If the file becomes unwieldy, they can move to local sibling files under `src/app/admin/archives/`.

### 2. Preserve shared completion logic

Summary counts must not be computed with a shortcut that disagrees with full record cards. If a lightweight summary helper is added, it must reuse the same `getCheckStatus` and ledger/read-model logic as `getDailyUnitRecords`.

If sharing that logic becomes too invasive, the first implementation can keep summary derived from `getDailyUnitRecords` and still stage chart/tools independently. The priority is correctness over premature query minimization.

### 3. Keep filters and export controls stable

The filter form needs the unit list. That unit list currently comes back with `getDailyUnitRecords`. To render filters early, the page may need a lightweight unit-options query or helper. This query should return only `id` and `name` for active/non-deleted units and should respect the same unit ordering used by the current filter.

Export and print controls must continue using current query param behavior. Export package generation remains deferred to explicit routes/buttons.

### 4. Section skeletons are local and structural

This change should use section-specific skeletons for the Records page rather than generic app-wide abstractions. They should match the existing Records page cards and spacing:

- summary card skeleton
- trend chart skeleton
- record card grid skeleton
- export/clear tools skeleton

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Summary counts disagree with record cards | Reuse existing completion/read-model logic or derive summary from the same records until a safe lightweight helper exists |
| More components make `archives/page.tsx` harder to read | Keep section components small; move to local files only if needed |
| Suspense boundaries do not stream as expected due to shared blocking query | Ensure each section owns its own async data call rather than awaiting all data in the parent |
| Duplicate queries between summary and record cards | Accept temporarily if needed for correctness, then optimize with shared cached helpers after behavior is stable |
