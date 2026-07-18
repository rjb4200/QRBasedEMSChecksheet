## REMOVED Requirements

### Requirement: Records page displays a 14-day check completion trend chart
**Reason**: The chart's unit-completion metric is inaccurate and does not reliably represent whether required work was completed.
**Migration**: Remove the chart from the Records page. A replacement work-completion metric will be specified separately.

### Requirement: Trend chart reads existing data without new queries
**Reason**: This requirement preserves the retired chart's independent and ambiguous data path.
**Migration**: Remove the trend helper and its dedicated query path.

### Requirement: Chart is fleet-wide regardless of unit filter
**Reason**: The retired chart no longer exists.
**Migration**: No replacement behavior is introduced by this change.

### Requirement: Chart is a server component with no client-side JavaScript
**Reason**: The retired chart component no longer exists.
**Migration**: Remove the component and its server-rendering requirement.

### Requirement: Chart handles edge cases gracefully
**Reason**: The retired chart no longer exists.
**Migration**: The replacement metric will define its own treatment of unavailable and zero-completion days.
