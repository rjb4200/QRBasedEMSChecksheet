## Context

The Restocking List on the unit page currently renders as a full detail section with a "Restocking List" header and "Items Needing Attention" subtitle, followed by grouped deficiency entries. This occupies permanent vertical space on every unit page even when crews have no immediate restocking action. Converting to a collapsed-by-default expandable box cleans up the page, and adding Print and Copy actions gives crews quick ways to share the list without switching to a Records print view.

## Goals / Non-Goals

**Goals:**
- Collapse the Restocking List detail section by default, showing only a summary header.
- Let users toggle expansion to see the full grouped deficiency list.
- Add a Print button that opens the browser print dialog targeting the expanded list content.
- Add a Copy button that copies the restocking list text to the clipboard.
- Show Print and Copy buttons only when the list is expanded.
- Keep the Restocking List hidden entirely when no exceptions exist.

**Non-Goals:**
- Do not change restocking data generation or exception logic.
- Do not change Records/archive pages, printed checksheets, PDFs, or email reports.
- Do not change the checkoff form dynamic list behavior.
- Do not add server-side APIs for print or copy.

## Decisions

1. **Use a client component with expand/copy/print state.**

   Rationale: The expand toggle, clipboard API call, and `window.print()` are all client-side behaviors. A `"use client"` wrapper component keeps the logic self-contained without adding a state management library.

   Alternative considered: Server-rendered details/summary with static print link. This cannot copy to clipboard or conditionally show buttons on expand.

2. **Use `navigator.clipboard.writeText` for copy.**

   Rationale: Standard web API, no dependency, works in all modern browsers.

   Alternative considered: execCommand-based fallback. Unnecessary for the expected device profiles (modern tablets/phones).

3. **Use `window.print()` with print-only CSS for the print button.**

   Rationale: The simplest print path. The restocking list can be styled to print cleanly with CSS media queries.

   Alternative considered: Open a separate print page. Adds complexity and a navigation away from the unit page mid-checkoff.

4. **Collapse by default using React useState.**

   Rationale: Simple, no external dependency. The default closed state keeps the page compact.

   Alternative considered: HTML `<details>`/`<summary>`. Cannot easily bind button visibility to the open/closed state across browsers.

## Risks / Trade-offs

- Clipboard API requires a secure context (HTTPS) -> Already satisfied in production.
- `window.print()` prints the full page by default -> Use print-only CSS to hide non-restocking-list content via an ID or class on the expanded section.
- Long lists may overflow the print -> Accept as-is; the box is already compact and grouped.
