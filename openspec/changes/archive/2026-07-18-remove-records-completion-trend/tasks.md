## 1. Retire Chart Code

- [x] 1.1 Remove the Records page trend section, chart-specific imports, and loading skeleton.
- [x] 1.2 Remove the completion trend component and its focused component tests.
- [x] 1.3 Remove the trend aggregation helper, its tests, and the public facade export.

## 2. Verify Unrelated Records Behavior

- [x] 2.1 Confirm no application code still references the retired chart title, component, or trend helper.
- [x] 2.2 Run relevant Records page and Daily Readiness tests, typecheck, and lint.
- [x] 2.3 Manually verify the Records page retains filters, selected-date summaries, cards, exports, printing, and Clear Records controls without the chart.
