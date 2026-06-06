## Context

The unit dashboard renders compartment and kit cards as status indicators with three states: grey (not started), yellow (in progress), green (completed). Cards have no tap interaction. The only way to open a checkoff form is scanning a QR code. Once a checkoff has been started (via QR scan), returning to the form should not require re-scanning.

## Goals / Non-Goals

**Goals:**
- Yellow (in-progress) and green (completed) cards navigate to the checkoff form on tap
- Grey (not-started) cards remain non-interactive — QR scan required to begin
- QR location `<details>` remains independently expandable

**Non-Goals:**
- Adding hover/pressed visual affordances
- Changing status colors or card layout
- Collision prevention — handled by the checkoff page, not the card

## Decisions

### Decision 1: Conditionally wrap cards in a `<Link>`

```tsx
const href = target.type === "compartment"
  ? `/checkoff/${unit.id}/${target.id}`
  : `/checkoff/${unit.id}/kit/${target.id}`;

return status === "grey" ? (
  <article ...>...</article>
) : (
  <Link href={href} className="block">
    <article ...>...</article>
  </Link>
);
```

Grey cards render as plain `<article>` (same as current). Yellow and green wrap in `<Link>`.

### Decision 2: `stopPropagation` on QR location summary

Same as before — prevents the `<details>` expand from triggering card navigation.

## Risks / Trade-offs

- **Trade-off**: Grey cards remain non-interactive — intentional; QR scan is the onboarding gate
