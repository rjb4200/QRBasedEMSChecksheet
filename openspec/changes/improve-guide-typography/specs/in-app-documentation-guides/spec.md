## ADDED Requirements

### Requirement: Guide pages use proper typography with Tailwind prose
The in-app guide pages SHALL use the `@tailwindcss/typography` plugin's `prose` class to render markdown content with proper heading, list, table, and spacing styles.

#### Scenario: Guide page renders with typography
- **WHEN** a guide page loads
- **THEN** markdown content SHALL be styled with the Tailwind prose typography system

### Requirement: Guide pages include a table of contents sidebar
The in-app guide pages SHALL display a sticky sidebar table of contents generated from section headings for navigation within the guide.

#### Scenario: Sidebar shows section headings
- **WHEN** a guide page loads
- **THEN** a sidebar SHALL display clickable links to each section heading

#### Scenario: Sidebar is sticky on scroll
- **WHEN** the user scrolls the guide content
- **THEN** the sidebar SHALL remain visible in a sticky position

### Requirement: Admin route references are clickable links
Admin route references in the guide markdown SHALL be displayed as clickable internal links instead of code blocks.

#### Scenario: Route reference is clickable
- **WHEN** a guide includes an admin route like `/admin/units`
- **THEN** the route SHALL be rendered as a clickable link
