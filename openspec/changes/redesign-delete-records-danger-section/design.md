## Context

The Clear Records section (`src/app/admin/archives/clear-records-section.tsx`) is a client component managing a multi-step delete workflow. It currently renders a plain white card indistinguishable from other page sections. This change applies a danger zone visual treatment and replaces "Clear" terminology with "DELETE".

## Goals / Non-Goals

**Goals:**
- Red banner header with warning icon and permanent subtext
- Replace all instances of "Clear" with all-caps "DELETE"
- Red-tinted border and background to visually separate from other cards
- Static warning text always visible
- SlideToConfirm and action buttons remain fully functional

**Non-Goals:**
- No route, API, or behavior changes
- No changes to the SlideToConfirm component itself

## Decisions

### 1. Danger zone banner at top of card

```tsx
<div className="rounded-3xl border-2 border-red-300 bg-red-50/30 p-4 shadow-sm">
  <div className="mb-4 rounded-2xl bg-red-700 p-3 text-white">
    <p className="text-sm font-black uppercase tracking-[0.2em]">⚠️ DANGER ZONE — Data Destruction</p>
    <p className="mt-1 text-xs text-red-100">These actions permanently delete operational records. Exported records cannot be recovered after deletion.</p>
  </div>
  ...
</div>
```

### 2. Terminology replacements

| Current | New |
|---|---|
| "Clear Records From" | "DELETE RECORDS From" |
| "Preview" | "Preview Records" |
| "Export and Clear" | "Export and DELETE" |
| "Slide to permanently delete" | (keep) |
| "Clearing records..." | "DELETING records..." |
| "Records cleared successfully" | "Records DELETED successfully" |
| "Clear another range" | "DELETE another range" |
| Error: "Clear operation failed" | "DELETE operation failed" |

### 3. Static warning visible in idle state

Even before any preview is triggered, the red banner and subtext are always visible. This ensures the admin sees the warning on every visit.
