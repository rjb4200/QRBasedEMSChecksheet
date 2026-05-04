## 1. Database Setup

- [ ] 1.1 Add link_name column to compartments table via Supabase migration
- [ ] 1.2 Update compartment fetch queries to include link_name

## 2. UI - Link Name Input

- [ ] 2.1 Add link_name input field to compartment editing page
- [ ] 2.2 Add visual indicator for linked compartments
- [ ] 2.3 Display linked compartment count when link_name is set

## 3. Sync - Equipment Items

- [ ] 3.1 Create sync function that finds all compartments with matching TRIM(link_name)
- [ ] 3.2 Implement add-item-sync: when item added, add to all linked compartments
- [ ] 3.3 Implement remove-item-sync: when item removed, remove from all linked compartments
- [ ] 3.4 Implement par-change-sync: when par value changed, update in all linked compartments

## 4. Sync - Equipment Ordering

- [ ] 4.1 Extend reorder function to sync new order to all linked compartments
- [ ] 4.2 Use item name as sync identifier for ordering

## 5. Sync - Subcategories

- [ ] 5.1 Implement add-subcategory-sync: when subcategory added, add to all linked compartments
- [ ] 5.2 Implement remove-subcategory-sync: when subcategory removed, remove from all linked compartments
- [ ] 5.3 Implement subcategory-reorder-sync: when subcategories reordered, sync to all linked compartments
- [ ] 5.4 Use subcategory name as sync identifier

## 6. Sync Trigger Integration

- [ ] 6.1 Add sync triggers to item add/edit/delete operations
- [ ] 6.2 Add sync triggers to subcategory add/edit/delete operations
- [ ] 6.3 Add sync triggers to reordering operations
- [ ] 6.4 Ensure checkoff status is NOT included in any sync operations

## 7. Validation and Testing

- [ ] 7.1 Run typecheck to verify no type errors
- [ ] 7.2 Run lint to verify no linting issues
- [ ] 7.3 Build the project to ensure everything compiles
- [ ] 7.4 Test linking two compartments with same link_name
- [ ] 7.5 Test adding item syncs to linked compartment
- [ ] 7.6 Test removing item syncs to linked compartment
- [ ] 7.7 Test par change syncs to linked compartment
- [ ] 7.8 Test reorder syncs to linked compartment
- [ ] 7.9 Test subcategory add/remove/reorder syncs
- [ ] 7.10 Verify checkoff status is NOT synced between linked compartments