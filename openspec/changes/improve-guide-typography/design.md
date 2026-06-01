## Context

The guide page uses `react-markdown` inside a `prose` container, but `@tailwindcss/typography` is not installed. The `prose` class has no effect, leaving markdown content with browser-default styling. The page is a single scrollable document with no internal navigation.

## Goals / Non-Goals

**Goals:**

- Install and configure `@tailwindcss/typography` so the `prose` class applies proper typography styles.
- Add a sticky sidebar table of contents generated from markdown headings for quick section navigation.
- Make admin route references clickable instead of displaying them as code blocks.

**Non-Goals:**

- Rewrite guide content.
- Convert guides from markdown to JSX.

## Decisions

1. Use `@tailwindcss/typography` with the default `prose` class.

   One-line install + config change. Immediately styles all markdown content with proper heading hierarchy, list spacing, table formatting, and readable line lengths.

   Alternative: custom CSS for markdown elements. More work and harder to maintain.

2. Parse markdown headings client-side for the TOC.

   Use react-markdown's heading renderer or a simple regex over the raw markdown to extract heading text and generate anchor links. Render in a sticky sidebar.

   Alternative: pre-generate TOC at build time. Overkill for two static guides.
