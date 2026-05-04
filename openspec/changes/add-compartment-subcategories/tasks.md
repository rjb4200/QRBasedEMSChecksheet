## 1. Database Changes

- [ ] 1.1 Add subcategory column to compartment_items table via Supabase migration
- [ ] 1.2 Add subcategory_position column for ordering subcategories
- [ ] 1.3 Update item fetch queries to include subcategory and order by subcategory position

## 2. Compartment Editing UI

- [ ] 2.1 Add subcategory management section to compartment editing page
- [ ] 2.2 Create UI to add new subcategory with name input
- [ ] 2.3 Create UI to delete subcategory (items move to uncategorized)
- [ ] 2.4 Add item-to-subcategory assignment dropdown/selector in item editing

## 3. Checkoff Page Display

- [ ] 3.1 Update checkoff page to group items by subcategory
- [ ] 3.2 Add visual styling for subcategory section headers (background, border)
- [ ] 3.3 Display uncategorized items in default section
- [ ] 3.4 Ensure printouts display items grouped by subcategory

## 4. Reordering Updates

- [ ] 4.1 Extend reordering UI to support reordering subcategories
- [ ] 4.2 Add ability to move items between subcategories
- [ ] 4.3 Add ability to move items to/from uncategorized
- [ ] 4.4 Persist subcategory order to database

## 5. Validation and Testing

- [ ] 5.1 Run typecheck to verify no type errors
- [ ] 5.2 Run lint to verify no linting issues
- [ ] 5.3 Build the project to ensure everything compiles
- [ ] 5.4 Test creating and managing subcategories
- [ ] 5.5 Test item assignment to subcategories
- [ ] 5.6 Test checkoff page displays grouped items
- [ ] 5.7 Test reordering subcategories
- [ ] 5.8 Test moving items between subcategories