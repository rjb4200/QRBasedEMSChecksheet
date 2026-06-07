## Why

Admin workflows use three inconsistent feedback patterns: server actions crash on errors, client fetch pages build ad-hoc banners, and the existing `useSaveFeedback` / `SaveStatusMessage` components were built but never wired in. Users experience different loading, success, and error behaviors on every page, and server action errors surface as full-page crashes rather than inline messages.

## What Changes

- Wire the existing `useSaveFeedback` hook and `SaveStatusMessage` component into admin pages that currently use manual `useState` booleans and inline divs.
- Standardize server actions to return structured `{ ok, message }` results instead of throwing errors, so errors appear as inline banners rather than page crashes.
- Extract the duplicated SVG spinner into a shared `Spinner` component.
- Apply consistent disabled state styling (`disabled:opacity-50`) across all admin action buttons.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `save-feedback`: The existing shared components will be used across all admin workflows instead of only being defined for Kits and Equipment. The spinner will be extracted as a shared component.

## Impact

- Affects `src/lib/use-save-feedback.ts`, `src/components/save-feedback.tsx` (enhance existing dead code).
- Affects admin pages: `users`, `issues`, `kits`, `equipment`, `units` — update to use shared feedback patterns.
- Affects server actions that currently throw — convert to return-value pattern.
- No database schema, API route, or authentication changes.
