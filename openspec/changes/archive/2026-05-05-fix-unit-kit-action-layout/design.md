## Context

The admin unit detail page renders two related forms side by side: assigning a shared kit to the unit and cloning a shared kit into a new compartment. Each form currently uses fixed grid column templates inside a parent two-column grid. At intermediate viewport widths, the fixed columns exceed their container, causing controls from the clone form to overlap the assign-kit form and making the row look broken.

## Goals / Non-Goals

**Goals:**

- Make both forms readable and usable at desktop, tablet, and mobile widths.
- Preserve existing admin workflows, field names, server actions, and labels.
- Keep the forms visually related while preventing overlap between them.
- Use existing Tailwind/layout patterns already present in the app.

**Non-Goals:**

- Do not redesign the entire unit admin page.
- Do not change kit assignment or clone behavior.
- Do not add new validation, server actions, or database changes.

## Decisions

- Render the two kit action forms as vertically stacked cards instead of side-by-side to prevent any width-related overlap.
- Use a simple single-column grid with consistent internal form layouts (`md:grid-cols-[minmax(0,1fr)_...]`) for each form.
- Keep button labels (`Assign Kit`, `Clone`) and input placeholders unchanged to avoid retraining users.
- Keep the two actions visually separated in their own card containers.

## Risks / Trade-offs

- More vertical height on medium screens -> acceptable because it avoids overlapping controls and wrong submissions.
- Slightly different visual density from adjacent admin forms -> mitigate by preserving existing card, input, and button styling.
