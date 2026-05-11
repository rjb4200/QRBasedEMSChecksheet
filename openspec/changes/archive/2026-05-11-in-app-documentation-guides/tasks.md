## 1. Install dependency

- [ ] 1.1 Install `react-markdown` package

## 2. Create download API routes

- [ ] 2.1 Create `/api/docs/user-guide/route.ts`
- [ ] 2.2 Create `/api/docs/admin-guide/route.ts`

## 3. Create viewer pages

- [ ] 3.1 Create `/docs/user/page.tsx` that renders USERGUIDE.md
- [ ] 3.2 Create `/admin/docs/page.tsx` that renders ADMINGUIDE.md

## 4. Add output tracing for deployment

- [ ] 4.1 Add USERGUIDE.md and ADMINGUIDE.md to outputFileTracingIncludes

## 5. Add links to panels

- [ ] 5.1 Add Documentation section to user-facing panel (/units page)
- [ ] 5.2 Add Documentation section to admin panel (/admin page)

## 6. Verify

- [ ] 6.1 Run typecheck and build
- [ ] 6.2 Verify viewer pages render correctly
- [ ] 6.3 Verify download routes return correct files
- [ ] 6.4 Commit and push
