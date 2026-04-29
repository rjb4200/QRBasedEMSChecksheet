## Why

Winchester Fire-EMS currently relies on paper check-sheets for 12-hour vehicle inspections across EC1-7 and Medic 1. This creates gaps in accountability, delayed visibility into fleet readiness, and no real-time oversight for supervisors. The system replaces paper with a mobile-first, QR-driven PWA that enforces physical presence at each compartment and provides real-time fleet status dashboards.

## What Changes

- Paper check-sheets replaced with QR-scanned digital forms on mobile devices
- Real-time fleet readiness dashboard for supervisors and admins
- Daily reset logic at 06:00 with partial data preservation
- Template-driven unit configuration with a reusable equipment catalog
- Admin panel for managing units, layouts, equipment, and QR code generation
- Compartment collision prevention (one user editing at a time)
- Automated missed-checkoff email alerts at 09:00

## Capabilities

### New Capabilities

- `qr-authentication`: QR code scanning as the primary navigation method into compartment checkoff forms. QR codes encode URLs to specific unit/compartment routes. No manual entry links in the UI.
- `compartment-checkoff`: Digital checkoff forms with quantity steppers, checkbox items, and condition inputs. Auto-save persistence. Previous shift data displayed as reference. Time-on-page logging for analytics.
- `collision-prevention`: Single-user edit locking per compartment. Status propagation (Grey → Yellow → Green) via database row checks on page load. Silent takeover without notification.
- `shift-reset`: Hard reset at 06:00. Completed data archived to history. In-progress data saved as partially complete for reference. The new daily checkoff starts fresh with visibility into prior checkoff progress.
- `fleet-dashboard`: Real-time grid-of-grids showing all units and their compartment completion status. In-service/out-of-service toggle. Filter by unit type and shift.
- `unit-configuration`: Admin interface for building unit layouts from templates or scratch. Add/remove compartments, assign items from equipment catalog, set par levels, upload compartment photos.
- `equipment-catalog`: Global catalog of equipment items with name, default par level, input type (quantity/checkbox/condition), and category. Reusable across all units and templates.
- `template-management`: Reusable layout templates as starting points for unit configuration. Create, edit, and delete templates. Copy template to new unit.
- `qr-code-generation`: Generate printable QR codes for each unit's compartments. Print/save as PDF option in admin panel. QR codes encode checkoff URLs.
- `email-alerts`: Automated email notifications at 09:00 for any in-service unit that is not 100% complete. Sent to admin users.
- `pwa-shell`: Progressive Web App with add-to-home-screen support. Mobile-first responsive design. Camera integration for QR scanning.
- `user-authentication`: Google Workspace OAuth (@winchesterky.com) with role-based access (User, Supervisor, Admin). Secondary OAuth support for Apple/Microsoft.
- `archive-history`: Historical storage of completed and partial shift data. Queryable by date range, unit, and user. Archive viewer in admin panel.
- `provider-analytics`: Time-to-complete metrics per employee and compartment. Discrepancy rate tracking. Available in admin dashboard.
- `personnel-signoff`: End-of-checkoff signature capture. Each crew member signs via their authenticated identity.

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **New codebase**: Full-stack Next.js application with Supabase PostgreSQL backend
- **Infrastructure**: Supabase (PostgreSQL, Auth, Storage, Edge Functions), n8n for email automation
- **Physical**: QR code stickers printed and applied to all EC units and Medic 1
- **Users**: All EMS crews, captains, brigade chiefs, and administrators transition from paper to digital workflow
- **Breaks**: Replaces existing paper check-sheet process entirely
