## 1. Data Pipeline

- [x] 1.1 Add a `SectionCommentRow` type to `archive-records.ts`
- [x] 1.2 Add section comments to `DailyRecordReadModelInput`
- [x] 1.3 Query `daily_section_comments` in `getLedgerBackedDailyUnitRecordsForDate`
- [x] 1.4 Group section comments by `unit_id` and pass into the read model builder
- [x] 1.5 Add `sectionComments` field to the `DailyUnitRecord` type

## 2. Records Page Display

- [x] 2.1 Render a compact `Section Comments` block for each unit record with section comments
- [x] 2.2 Label each comment with its source compartment/kit name
- [x] 2.3 Keep unit-level comments visually separate from section comments
- [x] 2.4 Hide the block when no section comments exist

## 3. Validation

- [ ] 3.1 Manual test: section comments appear on Records for the correct date
- [ ] 3.2 Manual test: section comments are labeled with source names
- [ ] 3.3 Manual test: no section comments block when none exist
- [ ] 3.4 Manual test: unit-level comments remain separate
- [x] 3.5 Run `npm run lint`
- [x] 3.6 Run `npm run typecheck`
- [x] 3.7 Run `npm run build`
