## Requirements

### Requirement: User guide viewer page
The app SHALL provide a page at `/docs/user` that renders `USERGUIDE.md` as formatted Markdown.

#### Scenario: User opens guide
- **WHEN** a user navigates to `/docs/user`
- **THEN** the contents of USERGUIDE.md SHALL be rendered as readable Markdown

### Requirement: Admin guide viewer page
The app SHALL provide a page at `/admin/docs` that renders `ADMINGUIDE.md` as formatted Markdown.

#### Scenario: Admin opens guide
- **WHEN** an admin navigates to `/admin/docs`
- **THEN** the contents of ADMINGUIDE.md SHALL be rendered as readable Markdown

### Requirement: User guide download
The app SHALL provide a download endpoint for `USERGUIDE.md`.

#### Scenario: User downloads guide
- **WHEN** a user requests `/api/docs/user-guide`
- **THEN** the response SHALL be USERGUIDE.md with `Content-Disposition: attachment`

### Requirement: Admin guide download
The app SHALL provide a download endpoint for `ADMINGUIDE.md`.

#### Scenario: Admin downloads guide
- **WHEN** a user requests `/api/docs/admin-guide`
- **THEN** the response SHALL be ADMINGUIDE.md with `Content-Disposition: attachment`

### Requirement: Guide links in UI panels
The user-facing and admin panels SHALL include links to their respective documentation.

#### Scenario: User panel shows documentation links
- **WHEN** viewing the user-facing panel
- **THEN** links to the user guide SHALL be visible

#### Scenario: Admin panel shows documentation links
- **WHEN** viewing the admin panel
- **THEN** links to the admin guide SHALL be visible

### Requirement: Guide files included in deployment
The Markdown guide files SHALL be available in production deployments.

#### Scenario: Guides load in production
- **WHEN** the app is deployed to production
- **THEN** USERGUIDE.md and ADMINGUIDE.md SHALL be accessible at runtime

### Requirement: Admin guide includes lockout recovery guidance
The admin guide SHALL document how bootstrap admin recovery is enabled, used for lockout recovery, and disabled or rotated after recovery.

#### Scenario: Admin reads recovery guidance
- **WHEN** an admin opens `ADMINGUIDE.md` through the admin guide viewer or download
- **THEN** the guide SHALL include lockout-recovery instructions for bootstrap admin configuration and safe follow-up actions

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

### Requirement: Database guide documents schema and data lifecycle
The project SHALL include a `DATABASEGUIDE.md` file documenting every database table, its purpose, key columns, foreign key relationships, stored data, and the data lifecycle from daily checkoff through archival rotation.

#### Scenario: Guide covers all operational tables
- **WHEN** a developer or administrator reads DATABASEGUIDE.md
- **THEN** the guide SHALL describe each operational table and its role in the checkoff workflow

#### Scenario: Guide documents optimization strategies
- **WHEN** reading the guide
- **THEN** the guide SHALL document stored procedures, RLS policies, retention rules, and query optimization patterns

### Requirement: Admin guide includes Pushover setup instructions
The admin guide SHALL document how admins configure Pushover push notifications, including obtaining a User Key, enabling notifications, and selecting alert types.

#### Scenario: Admin reads Pushover setup guidance
- **WHEN** an admin opens `ADMINGUIDE.md` through the admin guide viewer or download
- **THEN** the guide SHALL include a Pushover section covering:
  - how to create a Pushover account and obtain a User Key
  - how to install the Pushover app on devices
  - where to enter the User Key in the admin panel
  - which alert types are available and what they mean
  - how to test Pushover delivery
  - quiet hours policy (0800-2200 ET, test sends always allowed)
