## Context

Admin pages have accumulated inconsistent visual styling. Some section headers use `font-black` (page-title weight), filter forms lack scannable labels, and card/container styling varies across pages. This consolidates the visual language.

## Goals / Non-Goals

**Goals:**
- Replace `font-black text-red-700` section headers with compact red labels.
- Add "Filter" red labels to filter forms that lack them.
- Add "Add" red label to the equipment new-item form.
- Add card backgrounds and date labels on the Records page.
- Add kit card container background and Kit label on the Kits page.
- Make the Equipment filter bar a single line.

**Non-Goals:**
- Do not change page titles, count numbers, brand text, or page behavior.
- Do not move or restructure any page content.

## Decisions

### Decision 1: Compact red label pattern

Use `text-xs font-bold uppercase tracking-[0.2em] text-red-700` for section headers, replacing `font-black text-red-700` or adding missing labels.

Rationale: This pattern is established in the Fleet Panel and creates visual hierarchy between page titles (font-black) and section labels (compact red).

### Decision 2: Card containers use white background with thick borders

Records page unit cards and Kits page kit cards get a white background container with `border-2 border-slate-200` borders and a red label header.

Rationale: Makes the cards visually distinct from the page background and each other.

## Risks / Trade-offs

- **Risk**: None — purely cosmetic changes.
