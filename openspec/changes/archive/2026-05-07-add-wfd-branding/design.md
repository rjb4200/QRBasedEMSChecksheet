## Context

The repository now contains Winchester branding assets in `images/`, including `images/WFD_Logo_1848.jpg` and `images/City of winchester Seal.png`. The app already has printed check sheet and archive/report surfaces that reference Winchester Fire Department in text, but the browser icon, login page, app header, and print headers do not consistently use the official visual mark.

This is a visual-only change. It must not alter checkoff data flow, QR scanning, fleet status computation, unit status handling, archive summaries, authentication, or Supabase schema.

## Goals / Non-Goals

**Goals:**
- Use the committed WFD logo as the primary app branding mark.
- Add a WFD-derived browser tab icon.
- Add compact WFD branding to the login page and main app header.
- Add compact WFD branding to printable check sheets and existing archive/report print outputs.
- Use the City seal only as an optional secondary formal print mark.
- Keep desktop, tablet, mobile, and print layouts readable and uncluttered.

**Non-Goals:**
- No database or Supabase migration changes.
- No workflow, QR, authentication, fleet, label, unit status, archive, or reporting behavior changes.
- No branding settings, logo upload flow, admin controls, theme system, splash screen, animation, or broad redesign.
- No logos on unit cards, item rows, labels, QR speed paths, or table rows.

## Decisions

**Confirm asset serving before wiring UI.**

Next.js only serves static URL paths from `public/` by default, while image imports from non-public folders depend on the current build setup and component usage. Implementation should first inspect existing image/static asset patterns. If `images/` cannot be referenced directly at runtime, copy or generate web-served derivatives under an appropriate public path while preserving the original committed sources as the source of truth.

Alternative considered: reference `/images/...` directly from UI. This is only safe if those files are under `public/images/`, which they currently are not.

**Use WFD logo as the primary mark.**

`images/WFD_Logo_1848.jpg` should drive favicon, login, header, and print branding. This keeps the everyday app identity tied to Winchester Fire Department and avoids overusing formal city imagery.

Alternative considered: use the City seal in the app chrome. This was rejected because the seal should remain a formal secondary print mark.

**Keep app header branding compact.**

The main header should show a small logo near the app name, not consume fleet controls or mobile space. The header layout should degrade gracefully on small screens.

Alternative considered: add large branding across dashboards. This was rejected as visual clutter and outside the first-pass scope.

**Keep print branding official but secondary to content.**

Print headers should include WFD logo, department name, and check sheet/report title. Existing unit, operational date, shift, crew, timing, comments, and item details remain the focus. The City seal may appear only as a small footer mark or faint watermark if it does not reduce readability.

Alternative considered: add full-page decorative backgrounds. This was rejected because printed reports must stay compact and readable in black and white.

## Risks / Trade-offs

- **Asset path mismatch**: `images/` may not be web-served directly. Mitigation: confirm current Next.js asset handling and create public/favicon derivatives when required.
- **Header crowding on mobile**: Adding a logo may compete with controls. Mitigation: use small fixed dimensions and responsive spacing; avoid adding new header text beyond the app identity.
- **Print readability regression**: Logos or seal marks could compete with checkoff data. Mitigation: keep print header compact, make the seal optional/secondary, and ensure text remains readable if images fail.
- **Over-branding**: Adding logos too broadly would clutter operational pages. Mitigation: restrict placement to favicon, login, header, and print/report surfaces only.

## Migration Plan

1. Inspect current Next.js metadata, layout, login, header, print, PDF, and archive report files.
2. Decide whether to import from `images/` or copy/generate public web assets for runtime use.
3. Add favicon assets or metadata using a WFD-derived icon.
4. Add compact login and app header branding.
5. Add compact WFD print/report branding and optional secondary City seal treatment.
6. Verify mobile layout, print layout, typecheck, and lint.

Rollback is a normal code revert because no schema or persisted data changes are involved.

## Open Questions

- Whether implementation should keep the current `images/` directory only as source assets and add generated public derivatives, or relocate/copy the runtime assets into `public/images/`.
- Whether PDF generation can embed the JPG/PNG assets directly or should use text-only fallback if image embedding is not straightforward.
