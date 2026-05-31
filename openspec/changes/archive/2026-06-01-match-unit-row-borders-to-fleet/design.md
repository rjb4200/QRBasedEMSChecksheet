## Context

The Fleet Panel uses borderless `bg-white shadow-sm` for the outer panel and `border border-slate-200` on individual cards. The units page should follow the same pattern: outer panel gets no border, individual unit rows get the slate border.

## Decisions

Remove the border from the shared panel div and add it to each unit row. OOS rows already have borders; in-service rows just need the same class added.
