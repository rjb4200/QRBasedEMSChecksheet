## 1. Export API

- [ ] 1.1 Create API endpoint to export unit layout as JSON
- [ ] 1.2 Include version and exported timestamp in export file
- [ ] 1.3 Include all compartments with positions
- [ ] 1.4 Include all items with name, par, position, subcategory
- [ ] 1.5 Include all subcategories with name and position

## 2. Import API

- [ ] 2.1 Create API endpoint to import layout from JSON
- [ ] 2.2 Validate JSON structure before import
- [ ] 2.3 Add new compartments from import file
- [ ] 2.4 Update existing compartments with import data
- [ ] 2.5 Add new items to compartments
- [ ] 2.6 Update existing items by matching name
- [ ] 2.7 Add/update subcategories with import data

## 3. UI - Export

- [ ] 3.1 Add export button to each unit on admin units page
- [ ] 3.2 Implement file download in browser
- [ ] 3.3 Include unit name in filename (e.g., "UnitName-layout.json")

## 4. UI - Import

- [ ] 4.1 Add import button to admin units page
- [ ] 4.2 Implement file upload in browser
- [ ] 4.3 Add confirmation dialog before import
- [ ] 4.4 Show success/error message after import

## 5. Validation and Testing

- [ ] 5.1 Run typecheck to verify no type errors
- [ ] 5.2 Run lint to verify no linting issues
- [ ] 5.3 Build the project to ensure everything compiles
- [ ] 5.4 Test export generates valid JSON file
- [ ] 5.5 Test import adds new compartments and items
- [ ] 5.6 Test import updates existing compartments
- [ ] 5.7 Test import with invalid file shows error
- [ ] 5.8 Verify checkoff data is not affected by import