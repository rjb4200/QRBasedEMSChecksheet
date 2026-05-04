# Implementation Tasks

## 1. Frontend Development

- [x] 1.1 Update `src/components/fleet-matrix.tsx` to include the "View Checkoff" button.
- [x] 1.2 Implement dynamic Tailwind classes for state-aware styling:
  - **Active:** `bg-slate-700 text-white` (when inProgress > 0)
  - **Inactive:** `border border-slate-300 text-slate-600` (when inProgress = 0)
- [x] 1.3 Wrap button in Next.js `<Link>` with `prefetch={true}` and link to `/units/{unit.id}`.
- [x] 1.4 Ensure 44px minimum height for mobile accessibility using `min-h-[44px]`.

## 2. Validation and Testing

- [x] 2.1 Verify "View Checkoff" navigates to correct `/units/{unitId}` URL.
- [x] 2.2 Confirm button is visible on all states (Not started, In progress, Completed).
- [x] 2.3 Check mobile view to ensure card height remains manageable.
- [x] 2.4 Run typecheck to verify no type errors.
- [x] 2.5 Run lint to verify no linting issues.
- [x] 2.6 Build the project to ensure everything compiles.