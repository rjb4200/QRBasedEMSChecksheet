## 1. Acknowledgement State

- [x] 1.1 Add local client-side state to track whether DELETE controls are unlocked.
- [x] 1.2 Ensure the unlock state defaults to locked on initial page load and reload.
- [x] 1.3 Ensure disabling the acknowledgement returns actionable controls to the locked state.

## 2. Toggle UI

- [x] 2.1 Add a clearly labeled acknowledgement toggle to the DELETE Records section.
- [x] 2.2 Word the toggle as an unlock action, not as final deletion confirmation.
- [x] 2.3 Keep the warning text and acknowledgement toggle fully readable while locked.

## 3. Locked Controls Behavior

- [x] 3.1 Disable DELETE date inputs and Preview Records until acknowledgement is enabled.
- [x] 3.2 Visually grey out actionable DELETE controls while locked.
- [x] 3.3 Preserve data availability text readability while controls are locked.
- [x] 3.4 Preserve existing Preview Records, Export and DELETE, and slide-to-confirm behavior after unlocking.

## 4. Verification

- [x] 4.1 Add or update tests for locked, unlocked, and re-locked UI states where practical.
- [x] 4.2 Run relevant tests for the Records DELETE section.
- [x] 4.3 Run TypeScript typecheck.
