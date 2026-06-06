## 1. Rewrite Fleet Matrix StatusBadge component

- [x] 1.1 Change StatusBadge base classes from solid fill to light fill + border: `rounded-full px-2.5 py-0.5 text-xs font-bold border` in `src/components/fleet-matrix.tsx`
- [x] 1.2 Change green variant from `bg-green-600 text-white` to `bg-green-100 text-green-800 border-green-200`
- [x] 1.3 Change amber variant from `bg-amber-300 text-slate-950` to `bg-amber-100 text-amber-800 border-amber-200`
- [x] 1.4 Change red variant from `bg-red-700 text-white` to `bg-red-100 text-red-800 border-red-200`
- [x] 1.5 Change slate variant from `bg-slate-200 text-slate-700` to `bg-slate-100 text-slate-700 border-slate-300`

## 2. Fix Fleet Matrix secondary badges

- [x] 2.1 Fix remaining StatusBadge usages (status note, exceptions count, comments, crew missing) to use updated component in `src/components/fleet-matrix.tsx`

## 3. Standardize Archives check status badges

- [x] 3.1 Change green variant from `bg-green-100 text-green-800 ring-green-200` to `bg-green-100 text-green-800 border-green-200` in `src/app/admin/archives/page.tsx`
- [x] 3.2 Change yellow variant from `bg-yellow-100 text-yellow-900 ring-yellow-200` to `bg-amber-100 text-amber-800 border-amber-200`
- [x] 3.3 Change red variant from `bg-red-100 text-red-800 ring-red-200` to `bg-red-100 text-red-800 border-red-200`
- [x] 3.4 Change slate variant from `bg-slate-200 text-slate-700 ring-slate-300` to `bg-slate-100 text-slate-700 border-slate-300`
- [x] 3.5 Change pill badge shape from `rounded-full px-3 py-2` to `rounded-full px-2.5 py-0.5`

## 4. Standardize Issues status badges

- [x] 4.1 Change Issues list status badges from `rounded-lg` to `rounded-full` and add `px-2.5 py-0.5` in `src/app/admin/issues/page.tsx`
- [x] 4.2 Change Issues detail status badge from `rounded-lg` to `rounded-full` and add `px-2.5 py-0.5` in `src/app/admin/issues/[id]/page.tsx`

## 5. Standardize Recent Issues status badges

- [x] 5.1 Change status badges from `rounded-md` to `rounded-full` and `px-1.5 py-0.5` to `px-2.5 py-0.5` in `src/components/recent-issues.tsx`
- [x] 5.2 Change unit and tag badges to use the same pill style in `src/components/recent-issues.tsx`

## 6. Standardize Kits active/inactive badges

- [x] 6.1 Add `border border-green-200` to active badge and `border border-slate-300` to inactive badge in `src/app/admin/kits/page.tsx`

## 7. Standardize Recent Comments crew badge

- [x] 7.1 Change crew badge from `rounded-full bg-red-100 text-red-800` to slate pill: `bg-slate-100 text-slate-700 border-slate-300` in `src/components/recent-comments.tsx`

## 8. Fix Users page indicators

- [x] 8.1 Change Pushover enabled indicator from `text-orange-600` to amber badge style
- [x] 8.2 Fix daily report status to visually distinguish enabled (green) from disabled (slate)

## 9. Fix Archives summary stat yellow references

- [x] 9.1 Change Incomplete summary stat count from `text-yellow-700` to `text-amber-700` in `src/app/admin/archives/page.tsx`

## 10. Fix Dashboard exceptions count

- [x] 10.1 Change date-level exception count badge from `bg-red-700 text-white` to `bg-red-100 text-red-800 border-red-200` in `src/app/admin/page.tsx`

## 11. Verification

- [x] 11.1 Run `npm run build` to verify no compilation errors
- [x] 11.2 Visually spot-check Fleet Matrix, Archives, Issues, and Kits badges
