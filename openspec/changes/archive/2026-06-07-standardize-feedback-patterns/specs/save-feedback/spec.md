## MODIFIED Requirements

### Requirement: Feedback is consistent across menus
Save and action feedback behavior SHALL be consistent across all admin workflows including Equipment, Kits, Units, Users, and Issues.

#### Scenario: All admin pages use shared feedback
- **WHEN** saving, deleting, or performing actions in any admin page
- **THEN** the same shared `useSaveFeedback`, `SaveStatusMessage`, and `FeedbackBanner` components SHALL be used
- **AND** inline feedback SHALL appear close to the action that triggered it

## ADDED Requirements

### Requirement: Shared spinner component exists
A single shared `Spinner` component SHALL be used for all loading indicators across admin workflows, replacing duplicated inline SVG definitions.

#### Scenario: Spinner used consistently
- **WHEN** any admin action button shows a loading state
- **THEN** the loading indicator SHALL use the shared `Spinner` component

### Requirement: Disabled state styling is consistent
All admin action buttons SHALL use `disabled:opacity-50` when in a loading or blocked state.

#### Scenario: Button shows consistent disabled style
- **WHEN** an admin action button is disabled due to loading or validation
- **THEN** the button SHALL use `disabled:opacity-50` styling

### Requirement: Structured server action results for validation failures
Server actions that encounter expected user-facing validation failures SHALL return structured `{ ok: false, message }` results instead of throwing errors, so the UI can display the message inline without crashing.

#### Scenario: Validation failure shows inline message
- **WHEN** a server action encounters a user-facing validation failure
- **THEN** it SHALL return `{ ok: false, message }` to the caller
- **AND** the caller SHALL display the message inline near the relevant UI element
