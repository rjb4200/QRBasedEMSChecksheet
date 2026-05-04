## 1. Install Dependencies

- [ ] 1.1 Install `@react-pdf/renderer` package for PDF generation
- [ ] 1.2 Verify installation works with TypeScript

## 2. Create API Route Handler

- [ ] 2.1 Create `src/app/api/checksheets/print/route.ts` API route file
- [ ] 2.2 Implement GET handler accepting optional date and unitIds query parameters
- [ ] 2.3 Add validation for date parameter (ISO 8601 format)
- [ ] 2.4 Add validation for unitIds parameter (comma-separated integers)

## 3. Implement PDF Generation Logic

- [ ] 3.1 Create PDF document component using `@react-pdf/renderer` primitives
- [ ] 3.2 Implement checksheet data fetching logic (reuse from checksheet-documents.ts)
- [ ] 3.3 Style PDF to match existing print layout (3 columns, per-unit page breaks, headers)
- [ ] 3.4 Add "No checkoffs found" handling for empty results

## 4. Configure Response Headers

- [ ] 4.1 Set Content-Type to application/pdf
- [ ] 4.2 Set Content-Disposition with dynamic filename based on date

## 5. Test and Validate

- [ ] 5.1 Test API endpoint with curl/browser
- [ ] 5.2 Verify PDF renders correctly
- [ ] 5.3 Run lint and typecheck
- [ ] 5.4 Test with n8n webhook to verify binary response handling

## 6. Update Documentation

- [ ] 6.1 Update N8NGUIDE.md with API endpoint documentation
- [ ] 6.2 Add example n8n workflow configuration for automated printing