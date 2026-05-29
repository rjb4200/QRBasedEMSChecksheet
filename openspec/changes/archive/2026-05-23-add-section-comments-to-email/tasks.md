## 1. Data Pipeline

- [x] 1.1 Add a `SectionComment` type for the email report to `daily-report.ts`
- [x] 1.2 Query `daily_section_comments` for the report date in `getDailyEmailReport`
- [x] 1.3 Join unit names to section comments
- [x] 2.1 Add section comment rendering to `buildDailyReportEmail`
- [x] 2.2 Group section comments by unit in the email output
- [x] 2.3 Label each comment with source compartment or kit name
- [x] 2.4 Omit the section comments block when no comments exist
- [x] 3.1 Run `npm run lint`
- [x] 3.2 Run `npm run typecheck`
- [x] 3.3 Run `npm run build`
- [x] 3.4 Manual test: section comments appear in daily email
- [x] 3.5 Manual test: no section comments block when none exist
- [x] 3.6 Manual test: existing email content unchanged
