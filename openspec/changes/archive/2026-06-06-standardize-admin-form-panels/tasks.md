## 1. Fix padding and stray styles on always-visible forms

- [x] 1.1 Equipment Add form: remove `border border-slate-200` from form wrapper in `src/app/admin/equipment/page.tsx`
- [x] 1.2 Kits Create Kit form: change `p-5` to `p-4` in `src/app/admin/kits/page.tsx`
- [x] 1.3 Kits Create Kit From Compartment form: change `p-5` to `p-4` in `src/app/admin/kits/page.tsx`
- [x] 1.4 Kits Create Kit From Compartment: change submit button from secondary to primary red style
- [x] 1.5 Dashboard Exceptions form: change `p-5` to `p-4` in `src/app/admin/page.tsx`

## 2. Add missing filter labels

- [x] 2.1 Archives Filter: add `<p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700 md:col-span-4">Filter</p>` label to `src/app/admin/archives/page.tsx`
- [x] 2.2 Analytics Filter: add `<p className="text-sm font-bold uppercase tracking-[0.25em] text-red-700 md:col-span-4">Filter</p>` label to `src/app/admin/analytics/page.tsx`

## 3. Fix Archives Export panel

- [x] 3.1 Change flex layout to grid layout matching other forms in `src/app/admin/archives/page.tsx`
- [x] 3.2 Fix Export label from `text-sm font-semibold text-slate-600` to standard red label style

## 4. Standardize Issues Create panel (expandable)

- [x] 4.1 Change card wrapper from `p-5` to `p-4` in `src/app/admin/issues/page.tsx`
- [x] 4.2 Change all `rounded-xl` to `rounded-2xl` on inputs, selects, buttons, and toggle badge in `src/app/admin/issues/page.tsx`
- [x] 4.3 Remove inner `bg-slate-50` container from the expanded form (no-op: Issues form had no bg-slate-50)

## 5. Standardize Users Add panel (expandable)

- [x] 5.1 Change card wrapper from `p-5` to `p-4` in `src/app/admin/users/page.tsx`
- [x] 5.2 Change all `rounded-xl` to `rounded-2xl` on inputs, selects, buttons, and toggle badge in `src/app/admin/users/page.tsx`
- [x] 5.3 Remove inner `bg-slate-50` container from the expanded form

## 6. Verification

- [x] 6.1 Run `npm run build` to verify no compilation errors from class string changes
- [x] 6.2 Visually spot-check filter panels (Archives, Analytics), create panels (Equipment, Kits), and expandable panels (Issues, Users)
