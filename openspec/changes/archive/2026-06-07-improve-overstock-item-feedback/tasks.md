## 1. Feedback Classification

- [x] 1.1 Add a local item feedback classifier in `CheckoffForm` for quantity, checkbox, and condition item values
- [x] 1.2 Classify unchecked checkbox items as `Missing` with red severity
- [x] 1.3 Classify quantity values below par as understocked with red severity
- [x] 1.4 Classify quantity values over par by exactly 1 as text-only overstock feedback
- [x] 1.5 Classify quantity values over par by 2 or more as amber overstock feedback
- [x] 1.6 Classify condition statuses other than `OK` as amber attention feedback

## 2. Item Card Rendering

- [x] 2.1 Apply light red card background and red border to missing and understocked item cards
- [x] 2.2 Apply amber attention treatment to overstocked-by-2-or-more and non-OK condition item cards
- [x] 2.3 Render `Overstocked: +X` helper text for overstocked quantity items
- [x] 2.4 Render text-only `Overstocked: +1` feedback without amber card treatment for one-item overstock
- [x] 2.5 Hide par/helper text for normal quantity items exactly at par
- [x] 2.6 Preserve existing previous-value reference text and input controls

## 3. Verification

- [x] 3.1 Verify quantity below par, at par, over by 1, and over by 2 or more on a daily check form
- [x] 3.2 Verify unchecked checkbox items show `Missing` with red treatment
- [x] 3.3 Verify non-OK condition items show amber treatment
- [x] 3.4 Run the production build
