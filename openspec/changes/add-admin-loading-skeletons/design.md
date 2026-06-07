## Context

The admin area has 19 page routes. Only 2 have loading skeletons: a generic one at `/admin/loading.tsx` (a title + 3-row placeholder that matches no specific page) and a custom one at `/admin/issues/[id]/loading.tsx` (which mirrors the issue detail layout). The remaining 13 server-rendered pages show nothing during data fetch—just a blank screen until all queries resolve.

This is a purely UI concern. No data fetching, API routes, or business logic changes. Each skeleton is a Next.js `loading.tsx` file that the framework automatically shows while the server component in the same route segment awaits its data.

The existing `admin-loading-states` spec covers the concept but is sparse—it only references the issue detail page and generic state.

## Goals / Non-Goals

**Goals:**
- Add `loading.tsx` files for all 11 major server-rendered admin pages
- Each skeleton structurally mirrors its page: matching sections, card shapes, approximate sizing, and spacing
- Improve the generic `/admin/loading.tsx` to better resemble the Fleet dashboard
- Use the same Tailwind classes as real admin cards (`rounded-3xl`, `bg-white`, `p-6`, `shadow-sm`) for seamless transition
- Zero client-side JavaScript—pure server components with `animate-pulse`

**Non-Goals:**
- No shared skeleton component library (inline per-page for maximum precision)
- No changes to page components, data fetching, or business logic
- No changes to client-rendered pages (issues list, users) which use inline Spinners
- No changes to print-only pages or redirect-only pages
- No complex animations beyond `animate-pulse`

## Decisions

### 1. Inline per-page skeletons vs. shared components

**Decision:** Each `loading.tsx` is completely self-contained with inline Tailwind placeholder divs. No shared skeleton components.

**Rationale:** The `issues/[id]/loading.tsx` proved this works well—50 lines of inline markup that perfectly matches the page. Shared components add abstraction overhead (props for width, height, rows, columns, etc.) that makes each page's skeleton harder to read and customize. The duplication is minimal since each page has a unique layout—there's little opportunity for useful reuse beyond `<div className="h-4 w-32 rounded bg-slate-200" />` which is trivial.

**Trade-off acknowledged:** If admin card radii or spacing ever change globally, each skeleton would need updating. Mitigation: skeletons use the same hardcoded Tailwind classes as the pages (`rounded-3xl`, `p-4`/`p-6`, `shadow-sm`), so a global find-and-replace would catch them.

### 2. Skeleton fidelity level

**Decision:** Skeletons match the structural layout (sections, card counts, column grids) but use approximate sizes—not pixel-perfect replicas.

**Rationale:** The goal is perceived speed and reduced layout shift, not an exact wireframe. Approximate heights (h-4 for text, h-8 for headings, h-64 for charts) are sufficient. Pixel-perfect skeletons would require maintaining two copies of the layout and would break when the page changes.

### 3. Implementation order

**Decision:** Start with the most complex and frequently-visited pages, then work down.

**Order:** Archives (most complex) → Fleet dashboard → Equipment → Units/[id] → Kits/[id] → System Log → Units list → Kits list → Analytics → Archives/[id] → Generic dashboard skeleton

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Skeleton outdated when page changes** — adding a new section to a page won't update its `loading.tsx` | Skeletons are structurally approximate, not exact. A missing section in the skeleton still beats a blank screen. Review skeletons when significantly restructuring pages. |
| **Layout shift on transition** — if skeleton sizes don't match, content still jumps | Use the same `max-w-*`, `space-y-*`, and card classes. Heights are approximate but consistent with page proportions. |
| **File count** — 11 new files may feel like clutter | Each file is 30-60 lines of simple markup. They're colocated with their pages at `page.tsx` / `loading.tsx`, following Next.js conventions. |
