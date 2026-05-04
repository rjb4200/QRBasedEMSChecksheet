## 1. Component Updates

- [ ] 1.1 Update compartment item component to accept par value prop
- [ ] 1.2 Add comparison logic to determine exception status (above/below/at par)
- [ ] 1.3 Create badge component for exception display

## 2. Badge Styling

- [ ] 2.1 Add yellow badge styling (amber-500) for above par
- [ ] 2.2 Add red badge styling (red-500) for below par/missing
- [ ] 2.3 Style badge to include par value reference

## 3. Integration

- [ ] 3.1 Integrate badges into compartment check page
- [ ] 3.2 Ensure badges only show on items that differ from par
- [ ] 3.3 Test with smart-defaults feature (previous check values)

## 4. Validation and Testing

- [ ] 4.1 Run typecheck to verify no type errors
- [ ] 4.2 Run lint to verify no linting issues
- [ ] 4.3 Build the project to ensure everything compiles
- [ ] 4.4 Test yellow badge shows when count > par
- [ ] 4.5 Test red badge shows when count < par
- [ ] 4.6 Test red badge shows when count = 0
- [ ] 4.7 Test no badge shows when count = par