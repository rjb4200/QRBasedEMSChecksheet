## Why

The issue detail page needs a delete option so admins can remove issues that are no longer relevant. Its layout also needs to feel more like GitHub Issues — a proper header area, clear metadata, and a defined content flow — instead of the current flat stack of sections.

## What Changes

- Add a delete button to the issue detail page with a confirmation step, calling the existing `DELETE /api/admin/issues/[id]` endpoint
- Redesign the detail page layout with a proper header section (title, status, metadata, actions), a content body (description), and a discussion section (notes)
- After deletion, navigate back to the issues list

## Capabilities

### Modified Capabilities

- `issue-detail-page`: Add delete capability and GitHub-style layout with header, content, and discussion sections

## Impact

- **Modified files**: `src/app/admin/issues/[id]/page.tsx`
- **API**: Uses existing `DELETE /api/admin/issues/[id]` endpoint
- **Database**: No changes (cascade delete handles notes)
