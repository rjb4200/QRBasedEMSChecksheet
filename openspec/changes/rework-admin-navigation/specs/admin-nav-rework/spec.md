## ADDED Requirements

### Requirement: Top-level navigation shows operational pages
The admin navigation SHALL show Fleet, Records, and System Log as top-level links.

#### Scenario: Top-level nav visible
- **WHEN** an admin opens any admin page
- **THEN** Fleet, Records, and System Log SHALL be visible as top-level navigation links

### Requirement: Setup pages are in a hamburger menu
The admin navigation SHALL place Units, Kits, Equipment, and Users inside a hamburger/Admin dropdown menu.

#### Scenario: Hamburger menu contains setup pages
- **WHEN** an admin opens the Admin hamburger menu
- **THEN** Units, Kits, Equipment, and Users SHALL be listed as menu items

### Requirement: QR Codes link is removed from navigation
The admin navigation SHALL NOT include a top-level QR Codes link.

#### Scenario: QR Codes not in nav
- **WHEN** the admin navigation renders
- **THEN** no QR Codes link SHALL appear at the top level

### Requirement: Active page styling works for both nav areas
Active page styling SHALL apply to both top-level links and Admin menu links when the current page matches.

#### Scenario: Active top-level link highlighted
- **WHEN** the current page matches a top-level link
- **THEN** that link SHALL be visually highlighted

#### Scenario: Active menu link highlighted
- **WHEN** the current page matches an Admin menu link
- **THEN** that menu item SHALL be visually highlighted and the hamburger button SHALL show active styling

### Requirement: Hamburger menu is keyboard accessible and mobile-friendly
The hamburger menu SHALL be operable via keyboard and SHALL remain usable on mobile viewports.

#### Scenario: Keyboard access
- **WHEN** a keyboard user focuses the hamburger button and presses Enter or Space
- **THEN** the menu SHALL open and menu items SHALL be focusable

#### Scenario: Click outside closes menu
- **WHEN** the menu is open and the user clicks outside it
- **THEN** the menu SHALL close
