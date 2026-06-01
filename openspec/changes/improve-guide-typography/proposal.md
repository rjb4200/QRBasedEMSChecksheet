## Why

The Admin and User guides render as raw markdown without proper typography styling because the `@tailwindcss/typography` plugin is not installed. This produces poorly-spaced, difficult-to-read walls of text despite well-written content.

## What Changes

- Install `@tailwindcss/typography` and add it to the Tailwind CSS config.
- Add a sticky sidebar table of contents to the guide pages for section navigation.
- Style admin route references as clickable links instead of code blocks.
- Apply the Tailwind `prose` class to guide content for proper heading, list, table, and spacing styles.

## Capabilities

### Modified Capabilities

- `in-app-documentation-guides`: Guide pages use proper Tailwind typography with a sidebar table of contents and clickable route links.

## Impact

- Adds `@tailwindcss/typography` dependency.
- Affects `src/app/admin/docs/page.tsx`, tailwind/postcss config, and potentially the guide markdown files.
