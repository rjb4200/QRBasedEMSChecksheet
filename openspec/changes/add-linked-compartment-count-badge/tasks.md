## 1. Create Link Count Query Function

- [ ] 1.1 Create database query function to get count of compartments with same link name
- [ ] 1.2 Filter out archived and OOS units from the count
- [ ] 1.3 Add function to Supabase client or existing data layer

## 2. Create Badge Component

- [ ] 2.1 Create LinkedCountBadge component with red pill styling
- [ ] 2.2 Accept count as prop and display the number
- [ ] 2.3 Style with admin red theme colors (bg-red-600, text-white)
- [ ] 2.4 Add small font size and padding for compact appearance

## 3. Update Compartment Display

- [ ] 3.1 Find compartment component that displays link names
- [ ] 3.2 Add badge component inline next to link name text
- [ ] 3.3 Fetch link count when displaying compartments
- [ ] 3.4 Handle case where link name is empty (no badge shown)

## 4. Test and Validate

- [ ] 4.1 Test badge displays correct count for various link configurations
- [ ] 4.2 Verify "1" shows for singletons
- [ ] 4.3 Test that archived/OOS units are excluded from count
- [ ] 4.4 Run lint and typecheck
- [ ] 4.5 Verify existing link functionality still works