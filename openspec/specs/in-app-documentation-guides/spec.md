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
