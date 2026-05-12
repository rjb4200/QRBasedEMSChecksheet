## Context

The `/scan` page shows a "Request Camera Permissions" button before starting the built-in scanner. Users must click this every visit. A simple localStorage flag can skip this after the first successful use.

## Goals / Non-Goals

**Goals:**
- Skip permission button on repeat visits
- Set flag after first successful scanner start

**Non-Goals:**
- No scanner preference system
- No auto-open behavior
- No camera permission checking

## Decisions

1. **Simple boolean localStorage flag** over complex preference object
   - Key: `qrCheckoff.cameraPermissionInitialized`
   - Set to `"true"` after successful scanner start
   - Never cleared automatically

## Risks

- **[Risk] Browser still prompts on first visit** → Expected and acceptable; the flag only skips the in-app button
