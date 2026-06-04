## ADDED Requirements

### Requirement: Form section headers use compact red label style
Form section headers, restocking list headings, and chart labels SHALL use the compact red label pattern `text-xs font-bold uppercase tracking-[0.2em] text-red-700` rather than `font-black` page-title styling.

#### Scenario: Section headers use compact label
- **WHEN** an admin page renders a form section header or chart title
- **THEN** the header SHALL use the compact red label pattern

### Requirement: Filter sections have labeled headers
Filter forms on System Log and Equipment pages SHALL include a "Filter" header using the compact red label pattern.

#### Scenario: System Log filter has label
- **WHEN** the System Log page renders
- **THEN** the filter section SHALL show a "Filter" compact red label

#### Scenario: Equipment filter has label and is compact
- **WHEN** the Equipment page renders
- **THEN** the filter section SHALL show a "Filter" compact red label
- **AND** the filter form SHALL be a single row

### Requirement: Equipment Add section has labeled header
The Equipment page new-item form SHALL include an "Add" compact red label header.

#### Scenario: Add section has label
- **WHEN** the Equipment page renders
- **THEN** the new-item form SHALL show an "Add" compact red label

### Requirement: Records page unit cards have container styling
Records page unit record cards SHALL be grouped within a white background container with thick borders and a red date label.

#### Scenario: Unit cards styled with container
- **WHEN** the Records page renders unit records
- **THEN** the cards SHALL appear inside a white rounded container with `border-2` borders
- **AND** a red date label SHALL be displayed at the top

### Requirement: Kits page cards have container styling
Kits page cards SHALL be grouped within a white background container with thick borders and a "Kit" red label at top.

#### Scenario: Kit cards styled with container
- **WHEN** the Kits page renders
- **THEN** the cards SHALL appear inside a white rounded container with `border-2` borders
- **AND** a "Kit" compact red label SHALL be displayed at the top of the container
- **AND** individual card "Kit" labels SHALL be removed
