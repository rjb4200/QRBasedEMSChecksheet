## Why

The admin units page description text currently lives at the top of the page. After moving the Create form below the unit list, the description better fits as a subheading preceding the Create form, creating a cleaner visual separation between the unit list and the creation section.

## What Changes

- Remove the page description paragraph from the top header.
- Add a "Create a New Unit" subheading and the description paragraph above the Create form.

## Capabilities

### Modified Capabilities

- `unit-configuration`: Admin units page description text moves to the Create section at the bottom of the page.

## Impact

- Affects `src/app/admin/units/page.tsx`.
