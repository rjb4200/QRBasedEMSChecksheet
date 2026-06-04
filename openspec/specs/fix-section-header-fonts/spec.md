## Requirements

### Requirement: Form section headers use compact red label style
Form section headers, restocking list headings, and chart labels SHALL use the compact red label pattern `text-xs font-black uppercase tracking-[0.2em] text-red-700`.

#### Scenario: Section headers use compact label
- **WHEN** an admin page renders a form section header or chart title
- **THEN** the header SHALL use the compact red label pattern

### Requirement: Filter sections have labeled headers
Filter forms on System Log and Equipment pages SHALL include a "Filter" header using the compact red label pattern.

#### Scenario: Filter labels present
- **WHEN** the System Log or Equipment page renders
- **THEN** the filter section SHALL show a "Filter" compact red label

### Requirement: Equipment Add section has labeled header
The Equipment page new-item form SHALL include an "Add" compact red label header.

### Requirement: Records page unit cards have container styling
Records page unit record cards SHALL be grouped within a white background container with thick borders and a red date label.

### Requirement: Kits page cards have container styling
Kits page cards SHALL be grouped within a white background container with thick borders and a "Kit" red label at top.
