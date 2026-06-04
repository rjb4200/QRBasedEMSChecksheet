## Context

The admin layout currently renders a flat list of nav links inline. This was reworked into a client component with a hamburger menu but needs to be properly spec'd and re-implemented. The current flat layout shows Fleet, Units, Kits, Equipment, Records, Users, System Log, and QR Codes all at the same level.

## Goals / Non-Goals

**Goals:**
- Show Fleet, Records, System Log as top-level links.
- Move Units, Kits, Equipment, Users into a hamburger/Admin dropdown.
- Remove the QR Codes top-level link.
- Active-page styling for both top-level and dropdown links.
- Keyboard accessible and mobile-friendly.

**Non-Goals:**
- Do not change any route behavior or page content.
- Do not remove any existing pages.

## Decisions

### Decision 1: Extract nav into a client component

Create a new `AdminNav` client component with the reorganized links and hamburger menu. The admin layout imports this component.

Rationale: The current inline nav is a server component that can't manage dropdown toggle state. A client component is needed for the hamburger menu interaction and path-aware active styling.

### Decision 2: Use a native button + dropdown for the hamburger menu

Render a button that toggles an absolutely-positioned dropdown menu. Close on click-outside via a `mousedown` listener.

Rationale: Keeps the implementation dependency-free and matches existing disclosure patterns used elsewhere in the app.

### Decision 3: Top-level links as a config array

Define top-level and admin-menu links as constant arrays at the top of the component.

Rationale: Makes the link structure visible and easy to modify without hunting through JSX.

## Risks / Trade-offs

- **Risk**: The hamburger menu could be less discoverable than flat links. -> **Mitigation**: The Admin label makes it clear that setup pages live there. Active page still gets styled.
- **Risk**: Click-outside logic needs a ref and event listener. -> **Mitigation**: Clean up the listener on unmount.

## Migration Plan

1. Create the `AdminNav` client component.
2. Update the admin layout to use it.
3. Run lint, typecheck, and build.
