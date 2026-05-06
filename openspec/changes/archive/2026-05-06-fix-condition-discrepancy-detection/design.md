## Context

The discrepancy detection in `src/lib/discrepancies.ts` currently only checks:
- `checkbox` items with `false` value → "Missing" exception
- `quantity` items below par_level → "Below par" exception

Condition items (input_type = "condition") store data as JSON objects: `{"value":"","status":"OK"}` or `{"value":"some note","status":"FAILED"}`. The current logic skips these because:
1. The check `item.input_type === "checkbox"` never matches condition items
2. The check `item.input_type === "quantity"` never matches condition items

## Goals / Non-Goals

**Goals:**
- Detect condition items with status != "OK" as exceptions
- Preserve existing behavior for checkbox and quantity discrepancies

**Non-Goals:**
- Don't change how condition items are stored (already correct)
- Don't add new UI - just fix detection logic

## Decisions

**Option 1: Add condition check in discrepancies.ts loop**

- Add a third check in the existing for-loop at line 138
- Check if `input_type === "condition"` AND `value.status !== "OK"`
- This is the simplest fix with minimal code change

**Option 2: Create separate condition discrepancy function**

- More separation of concerns
- Overkill for single check addition

**Chosen: Option 1** - Keep it simple, add condition check inline

## Implementation

In `src/lib/discrepancies.ts`, add after line 136:

```typescript
// Condition items with non-OK status
if (item.input_type === "condition" && typeof value === "object" && value?.status !== "OK") {
  discrepancies.push({ ...base, inputType: "condition", expected: "OK", actual: value.status });
}
```

Note: Need to handle the stored value format - it's an object with `status` field.

## Risks / Trade-offs

- **Minimal risk**: Simple logic addition, no breaking changes
- **Testing**: Need verification that non-OK condition items are detected