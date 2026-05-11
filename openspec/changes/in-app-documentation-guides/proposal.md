## Why

The repository contains `USERGUIDE.md` and `ADMINGUIDE.md` but there's no in-app way for crews or admins to read or download them. Users must navigate to GitHub to access documentation.

## What Changes

- Create `/docs/user` page that renders `USERGUIDE.md` as in-app Markdown
- Create `/admin/docs` page that renders `ADMINGUIDE.md` as in-app Markdown
- Create `/api/docs/user-guide` and `/api/docs/admin-guide` download endpoints
- Add small Documentation section links to the user-facing and admin panels
- Add `react-markdown` for Markdown rendering
- Add `outputFileTracingIncludes` to next.config.ts so the .md files are included in deployment

## Capabilities

### New Capabilities

- `in-app-documentation`: View and download documentation guides from within the app

### Modified Capabilities

- None

## Impact

- New pages: `src/app/docs/user/page.tsx`, `src/app/admin/docs/page.tsx`
- New API routes: `src/app/api/docs/user-guide/route.ts`, `src/app/api/docs/admin-guide/route.ts`
- Updated: `next.config.ts` (outputFileTracingIncludes)
- New dependency: `react-markdown`
- Link additions to user-facing and admin panels
