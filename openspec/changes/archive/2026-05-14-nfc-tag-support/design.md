## Context

The existing short opaque QR code system encodes checkoff URLs in QR images printed by admins. NFC tags containing the same URL provide an alternative access method without any routing or database changes. The admin QR page at `/admin/units/[id]/qr` is the natural place to surface NFC-relevant information.

## Goals / Non-Goals

**Goals:**
- Show the plaintext checkoff URL (`/q/{code}`) alongside each QR code image on the admin page.
- Add a "Copy URL" button per label so admins can paste the URL into an NFC writer app.
- Add a brief NFC setup section with recommended tag type (NTAG216 anti-metal, 30mm+) and placement guidance.
- Keep the QR-only print layout available for sticker printing.

**Non-Goals:**
- Do not add NFC reading/writing capabilities to the app itself.
- Do not change the `/q/[code]` route or `qr_targets` table.
- Do not change the QR scanner or checkoff redirect behavior.
- Do not generate NFC NDEF records server-side.

## Decisions

1. **Display the full URL as a read-only text input with a copy button.**

   Rationale: A read-only `<input>` with a copy button is the most reliable cross-browser clipboard pattern. The user selects and copies, or clicks the copy button.

   Alternative considered: A plain text `<span>` with a click-to-copy handler. Less discoverable that the text can be copied.

2. **Add NFC guidance as a dismissible or collapsible info block at the top of the QR page.**

   Rationale: The guidance is useful for first-time setup but shouldn't permanently consume space once the admin understands the workflow.

   Alternative considered: A separate NFC setup page. Adds navigation friction.

3. **Use the existing `navigator.clipboard.writeText()` API for copy.**

   Rationale: Same pattern already used in `RestockingListSection`. No new dependencies.

## Risks / Trade-offs

- Admins unfamiliar with NFC may need external resources to program tags -> The guidance block provides the URL and recommended hardware; actual programming is done with standard NFC writer apps.
- Copy button may fail on insecure contexts -> Production runs on HTTPS.
