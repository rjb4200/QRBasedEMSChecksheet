## Context

Issue tags are rendered in multiple places: the admin issue list, issue detail page, and recent issues component. Each surface currently hashes the tag text into a deterministic color palette, but the generated badges use different shapes and spacing and the palette entries omit border colors.

The admin badge system has already standardized pill badges around `rounded-full px-2.5 py-0.5 text-xs font-bold border`. This change brings issue tags into that visual system while preserving deterministic colors.

## Goals / Non-Goals

**Goals:**

- Preserve deterministic color selection from tag text.
- Add matching border colors to every deterministic issue tag palette entry.
- Use the unified pill badge base classes for issue tags across all issue surfaces.
- Keep existing tag storage, lowercasing, filters, and APIs unchanged.

**Non-Goals:**

- Do not make issue tag colors semantic.
- Do not change which tags display or how many tags are shown in condensed lists.
- Do not redesign the issue list, issue detail page, or recent issues card beyond tag badge styling.

## Decisions

1. Keep deterministic hashing for tag colors.

   Rationale: Existing behavior ensures the same free-text tag displays with the same color across issues. The user explicitly wants to keep deterministic colors.

   Alternative considered: Convert all issue tags to neutral slate. That would maximize consistency with admin metadata tags but remove the existing tag differentiation.

2. Standardize the badge base classes everywhere issue tags render.

   Rationale: `rounded-full px-2.5 py-0.5 text-xs font-bold border` matches the current admin badge standard and prevents each surface from drifting.

   Alternative considered: Only add borders while keeping current rounded-md/rounded-lg shapes. That would leave the issue tracker visibly inconsistent.

3. Extend the palette classes with matching borders.

   Rationale: The deterministic palette should return complete color treatment, such as `bg-blue-100 text-blue-800 border-blue-200`, so callers can pair it with the shared base class.

   Alternative considered: Use a separate border helper. That increases duplication without adding flexibility.

## Risks / Trade-offs

- Repeating the palette in multiple files can drift again. Mitigation: implementation can use a shared helper if practical within the existing project structure.
- Deterministic colors are not semantic, so important tags are not guaranteed to use severity colors. Mitigation: this change preserves current behavior intentionally and only standardizes presentation.
