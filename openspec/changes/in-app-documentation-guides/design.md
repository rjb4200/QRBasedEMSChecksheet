## Context

The repository root contains `USERGUIDE.md` and `ADMINGUIDE.md` as the source of truth for documentation. Currently there's no way to access these from within the app.

## Goals / Non-Goals

**Goals:**
- View `USERGUIDE.md` and `ADMINGUIDE.md` rendered in-app
- Download either guide as a .md file
- Lightweight — no CMS, no editing, no versioning
- Work on desktop and mobile

**Non-Goals:**
- Editable docs, WYSIWYG, PDF export, search, offline caching

## Decisions

1. **`react-markdown`** for rendering — lightweight, widely used, no config needed
2. **`fs.readFile` for server-side loading** — reads from repo root at runtime via `process.cwd()`
3. **API routes for downloads** — sets `Content-Disposition: attachment` for save behavior
4. **`outputFileTracingIncludes` in next.config.ts** — ensures .md files are included in Vercel deployments

## Routes

```
/docs/user              → Renders USERGUIDE.md
/admin/docs             → Renders ADMINGUIDE.md
/api/docs/user-guide    → Downloads USERGUIDE.md
/api/docs/admin-guide   → Downloads ADMINGUIDE.md
```

## Deployment

```ts
outputFileTracingIncludes: {
  "/*": ["./USERGUIDE.md", "./ADMINGUIDE.md"],
}
```

## Risks

- **[Risk] .md files not included in deployment** → Mitigation: `outputFileTracingIncludes` in next.config.ts
