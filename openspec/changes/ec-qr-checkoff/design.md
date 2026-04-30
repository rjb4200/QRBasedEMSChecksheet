## Context

Winchester Fire-EMS operates 7 engine companies (EC1-7) and 1 medic unit (Medic 1). Each vehicle requires a 12-hour checkoff performed by crew members, currently tracked via paper check-sheets. The system needs to enforce physical presence at each compartment, provide real-time fleet status to supervisors, and maintain historical records for accountability.

The system will be built as a Next.js PWA with Supabase as the backend (PostgreSQL, Auth, Storage, Edge Functions). n8n will handle scheduled email alerts. No offline mode is required — all users will have WiFi or 5G access at stations.

## Goals / Non-Goals

**Goals:**
- Mobile-first PWA for crew checkoffs with QR-based compartment navigation
- Public crew checkoffs without login friction
- Real-time fleet readiness dashboard for supervisors and admins
- Flexible unit configuration system — each unit is independent and can be copied as a starting point for another unit
- Equipment catalog for reusable item definitions across units
- Daily reset at 06:00 with partial data preservation
- Collision prevention per compartment via database row checks (no WebSockets)
- Automated email alerts for missed checkoffs

**Non-Goals:**
- Offline mode — not needed as all stations have connectivity
- Real-time WebSocket subscriptions — DB row checks on page load are sufficient
- Hard block on manual URL entry — UI simply doesn't provide links, but URL patterns are not cryptographically secured
- Mobile app (native) — PWA with add-to-home-screen is sufficient
- Multi-language support — English only initially

## Decisions

### 1. Status Propagation via DB Row Checks (No WebSockets)

**Decision:** Compartment status (Grey/Yellow/Green) is determined by checking the `compartment_checks` table on page load, not via Supabase Realtime subscriptions.

**Rationale:** The collision prevention use case only needs to know if someone else currently has a compartment open. A simple DB query on page load handles this. If Provider B navigates away while Provider A is editing, the stale "Yellow" status will persist until the next shift reset or a manual cleanup — acceptable trade-off for simplicity.

**Alternatives considered:**
- Supabase Realtime subscriptions: Overkill for this use case, adds complexity and cost
- Polling every N seconds: Unnecessary — status only needs to be checked on page load

### 2. Unit Configuration Model — Independent Units, Units as Starting Points

**Decision:** Each unit has its own independent configuration of compartments and items. Existing units can be copied into a new unit but don't maintain a parent-child relationship afterward. The admin UI does not expose a separate template management section.

**Rationale:** Units diverge over time (equipment changes, layout modifications). Using real units as copy sources avoids maintaining a duplicate template workflow. Copy-once is simpler and matches how physical units actually evolve.

**Data model:**
```
units → unit_compartments → unit_compartment_items
equipment_catalog (shared across all)
```

### 3. Shift Reset — Archive Partials, Don't Discard

**Decision:** At 06:00, completed checks are archived to history. In-progress checks are saved as "partially complete" with all entered data preserved. The new daily checkoff starts fresh but can see what the previous checkoff completed.

**Rationale:** Partial data has value — if 18 of 25 compartments were done, supervisors should know. The next daily checkoff starts fresh while retaining visibility into the prior checkoff.

**Alternatives considered (from original PRD):**
- Discard all in-progress: Loses potentially valuable data about fleet readiness

### 4. Take Over = Silent Transfer

**Decision:** When Provider B clicks "Take Over" on a locked compartment, the form ownership silently transfers. No notification is sent to Provider A.

**Rationale:** Provider B is actively taking action, so they know. Provider A will see the change if they try to submit (their session becomes stale). Simpler UX.

### 5. QR Code Generation in Admin Panel

**Decision:** QR codes are generated server-side using a library (e.g., `qrcode` npm package), rendered as printable pages with compartment labels, and exportable as PDF via browser print or server-side PDF generation.

**Rationale:** QR codes encode full web URLs to the public checkoff route (`https://app-host/checkoff/{unit-id}/{compartment-id}`), using `NEXT_PUBLIC_APP_URL` when configured and the current request host as a fallback. No need for external QR services. Server-side generation ensures consistency and avoids printed QR codes that only contain incomplete relative paths.

### 6. Input Types for Checkoff Items

**Decision:** Three input types:
- `quantity`: Stepper with [-] and [+], par level reference, previous shift count
- `checkbox`: Simple done/not-done toggle
- `condition`: Status selector (OK/Low/Missing) with optional numeric value (e.g., O2 PSI)

**Rationale:** The checksheet has a mix of item types. A single input model doesn't fit all cases. Three types cover the observed patterns.

### 7. Authentication for Privileged Access

**Decision:** Routine crew checkoffs do not require authentication. Admin access uses a dedicated username/password login that creates a signed, HTTP-only admin session cookie. Supervisor access continues to use Supabase authenticated identity and role data.

**Rationale:** Removing login from the checkoff path keeps QR scanning fast for crews. A direct admin username/password gate avoids email validation dependency for admin pages while still storing the admin session in a secure cookie. Supabase authenticated identity remains useful for supervisor role access.

### 10. Public Entry Point

**Decision:** The app root redirects to `/units`. Admins with a valid admin session cookie see an Admin Dashboard button on the public unit selector after signing in.

**Rationale:** Crew checkoff is the primary workflow, so the app should open directly to unit selection. Admin access remains available without exposing admin controls to unauthenticated users.

### 8. Equipment Catalog with Categories

**Decision:** Equipment items are stored in a global catalog with categories (Medical, PPE, Tools, Fluids, etc.). When adding items to a compartment, admins can search/browse the catalog or create new items on the fly.

**Rationale:** Many items appear across multiple compartments (gloves, trauma shears, etc.). A catalog prevents duplication and ensures consistent naming.

### 9. Tech Stack

- **Frontend:** Next.js 15+ (App Router), React 19, Tailwind CSS, shadcn/ui components
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)
- **Email:** n8n scheduled workflows with SMTP
- **Deployment:** Vercel (Next.js) + Supabase Cloud

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|------------|
| Stale Yellow status if user abandons form | Minor — compartment appears locked until next shift reset | Add "stale timeout" (e.g., 30 min) to auto-release locks |
| Compartment photos not available for all units initially | Partial UX degradation | Admin can upload photos over time; forms work without photos |
| Shift reset timing edge case (user mid-form at exactly 06:00) | Data loss for in-progress form | Add 5-minute buffer window with warning at 05:55 |
| QR codes damaged or unreadable in field | User cannot access checkoff form | Admin can regenerate and reprint; backup manual override via admin panel |
| n8n email service downtime | Missed alerts not sent | Fallback: Supabase cron job as backup email trigger |
| Equipment catalog grows unwieldy | Admin confusion when building units | Categories, search, and filtering in the catalog UI |
