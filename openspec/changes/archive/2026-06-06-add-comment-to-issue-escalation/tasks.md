## 1. Implementation

- [x] 1.1 Add "Create Issue" button + inline escalation form to `src/components/recent-comments.tsx`
- [x] 1.2 Add state management for escalating comment (escalatingId, form fields)
- [x] 1.3 Pre-fill title as "{unitName} — {sourceName}", description with comment text, unit pre-selected
- [x] 1.4 Submit to `POST /api/admin/issues`, collapse form on success, show error on failure
- [x] 2.1 Run `npm run typecheck`
- [x] 2.2 Run `npm run build`
- [x] 2.3 Manual test: escalate a comment to an issue, verify it appears on the Issues page
