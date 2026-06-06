## 1. Fix H1 `mt-2` on Archives and Analytics

- [x] 1.1 Fix Archives H1: change `mt-2 text-4xl font-black` to `text-4xl font-black` in `src/app/admin/archives/page.tsx`
- [x] 1.2 Fix Analytics H1: change `mt-2 text-4xl font-black` to `text-4xl font-black` in `src/app/admin/analytics/page.tsx`

## 2. Standardize section labels on Equipment page

- [x] 2.1 Fix Filter label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/equipment/page.tsx`
- [x] 2.2 Fix Add label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/equipment/page.tsx`

## 3. Standardize section labels on System Log page

- [x] 3.1 Fix Filter label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/system-log/page.tsx`

## 4. Standardize section labels on Units page

- [x] 4.1 Fix "Create a New Unit" label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/units/page.tsx`
- [x] 4.2 Add intro subtitle to Units page: "Create and manage apparatus units with compartments, equipment, and QR codes."

## 5. Standardize section labels on Kits page

- [x] 5.1 Fix "Create Kit" label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/kits/page.tsx`
- [x] 5.2 Fix "Create Kit From Compartment" label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/kits/page.tsx`
- [x] 5.3 Fix "Kit" section label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/kits/page.tsx`

## 6. Standardize section labels on Archives page

- [x] 6.1 Fix date label: change `text-xs font-black uppercase tracking-[0.2em]` to `text-sm font-bold uppercase tracking-[0.25em]` in `src/app/admin/archives/page.tsx`

## 7. Standardize section labels on Users page

- [x] 7.1 Fix "User Management" label: change `text-sm font-black` to `text-sm font-bold` in `src/app/admin/users/page.tsx`
- [x] 7.2 Fix "Existing Users" label: remains `text-sm font-bold uppercase tracking-[0.25em] text-red-700` — verify already correct
- [x] 7.3 Fix editing sub-labels: change all `text-xs font-black uppercase tracking-[0.2em] text-red-700` to `text-sm font-bold uppercase tracking-[0.25em] text-red-700` in `src/app/admin/users/page.tsx`
- [x] 7.4 Add intro subtitle to Users page: "Manage admin accounts, report subscriptions, and Pushover alert settings."

## 8. Standardize section labels on Issues list page

- [x] 8.1 Fix "Create Issue" label: change `text-sm font-black` to `text-sm font-bold` in `src/app/admin/issues/page.tsx`
- [x] 8.2 Add intro subtitle to Issues page: "Track maintenance issues, equipment problems, and action items across the fleet."

## 9. Add intro subtitle to Dashboard

- [x] 9.1 Add intro subtitle to Dashboard: "Fleet-wide readiness overview showing daily check status across all active units."

## 10. Verification

- [x] 10.1 Run `npm run build` to verify no compilation errors from class string changes
- [x] 10.2 Visually spot-check 3-4 pages to confirm labels, H1 spacing, and intros are consistent
