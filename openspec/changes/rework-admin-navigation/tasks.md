## 1. Nav Component

- [ ] 1.1 Create `src/components/admin-nav.tsx` client component
- [ ] 1.2 Define top-level links: Fleet, Records, Needs Follow-up, System Log
- [ ] 1.3 Define Admin menu links: Units, Kits, Equipment, Users
- [ ] 1.4 Implement hamburger button that toggles a dropdown menu
- [ ] 1.5 Add click-outside-to-close behavior
- [ ] 1.6 Add `aria-expanded` and keyboard accessibility on the menu button
- [ ] 1.7 Apply active-page styling to both top-level links and menu items

## 2. Layout Update

- [ ] 2.1 Update `src/app/admin/layout.tsx` to use the `AdminNav` component
- [ ] 2.2 Remove the old inline navigation from the layout

## 3. Validation

- [ ] 3.1 Run `npm run lint`
- [ ] 3.2 Run `npm run typecheck`
- [ ] 3.3 Run `npm run build`
- [ ] 3.4 Manual test: top-level nav shows correct links
- [ ] 3.5 Manual test: hamburger menu opens and contains setup pages
- [ ] 3.6 Manual test: active styling works for both nav areas
- [ ] 3.7 Manual test: mobile layout remains usable
- [ ] 3.8 Manual test: keyboard access works
