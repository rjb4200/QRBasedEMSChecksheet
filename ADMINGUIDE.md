# EMS Checksheet Admin Guide

This guide covers the day-to-day admin side of the QR-Based EMS Checksheet system.

The admin panel is used to manage units, compartments, shared kits, equipment, QR codes, check records, users, and fleet readiness.

The system is designed to keep the crew workflow simple while giving supervisors and admins better visibility into fleet status and accountability.

## Admin Areas

### Fleet

Route:

```text
/admin/fleet
```

The Fleet page is the operational overview for the system.

From here you can quickly see:

- which units are complete
- which units still need checks
- units with exceptions
- below-par counts
- comments
- crew names
- daily readiness status

The Fleet page is intended to answer:

```text
What still needs attention right now?
```

### Units

Route:

```text
/admin/units
```

This is where units are created and managed.

Typical tasks:

- create units
- edit unit names
- configure compartments
- assign shared kits
- print QR codes
- archive retired/OOS units
- restore archived units
- clone layouts from another unit

Units can contain:

- direct compartments
- assigned shared kits
- photos/logos
- monthly check reminder dates

Archived units are preserved historically and can be restored later.

### Kits

Route:

```text
/admin/kits
```

Kits are reusable equipment layouts shared across multiple units.

Examples:

- airway bag
- narc box
- monitor checks
- cabinet layouts
- supply bags

Important:

Editing a shared kit updates it everywhere that kit is assigned.

Use a compartment instead of a kit when a unit needs a custom one-off layout.

The Kits page supports:

- creating kits
- editing kit items
- assigning photos
- cloning kits
- creating kits from compartments
- viewing attached units

### Equipment Catalog

Route:

```text
/admin/equipment
```

The Equipment Catalog is the master item list used throughout the system.

Equipment items can include:

- quantity inputs
- checkbox items
- condition/status items

Equipment properties include:

- item name
- category
- default par level
- input type
- active status

Try to avoid duplicate items with slightly different names.

### Checksheets / Records

Route:

```text
/admin/checksheets
```

This area contains completed check records.

Admins can:

- review historical checks
- filter by unit/date
- print records
- review comments
- review exceptions
- generate daily print packets

The printable fleet packet is formatted for compact operational printing.

### Users

Route:

```text
/admin/users
```

This area controls admin access.

Admins can:

- create admin users
- remove admin access
- manage report recipients
- enable/disable daily report emails

Only authorized personnel should have admin access.

## Daily Workflow

A normal admin/supervisor workflow usually looks like:

1. Review the Fleet page.
2. Identify incomplete units.
3. Review exceptions/comments.
4. Follow up on missing or below-par equipment.
5. Print records if needed.
6. Review daily email reports.

## Admin Lockout Recovery

If normal admin accounts are unavailable, the app supports an optional bootstrap recovery admin login.

Bootstrap recovery uses these server-only environment variables:

- `BOOTSTRAP_ADMIN_ENABLED`
- `BOOTSTRAP_ADMIN_USER`
- `BOOTSTRAP_ADMIN_PASSWORD`

Important:

- do not use `NEXT_PUBLIC_` for these values
- do not share the bootstrap password with crews or place it in client-side config
- use bootstrap only as a recovery path, not as the normal daily admin login

Recommended recovery workflow:

1. Enable bootstrap recovery in the server environment.
2. Set a strong temporary bootstrap username and password.
3. Sign in through the normal `/login` page using the bootstrap credentials.
4. Restore or create the regular admin user account you actually want to keep using.
5. Test normal admin login.
6. Disable bootstrap recovery or rotate the bootstrap password immediately after recovery.

If bootstrap recovery is left enabled indefinitely, it becomes an extra standing admin credential and increases risk.

## Compartments vs Kits

This is one of the most important concepts in the system.

### Compartments

Compartments belong only to one unit.

Changing a compartment only affects that unit.

Good for:

- custom layouts
- unit-specific storage
- special equipment setups

### Kits

Kits are shared.

Changing a kit affects every unit using that kit.

Good for:

- standard bags
- repeated cabinet layouts
- monitor checks
- common inventory groups

If you are unsure whether something should be a kit or compartment:

```text
If multiple units should stay identical, use a kit.
If the layout is unique to one truck, use a compartment.
```

## QR Codes

Each unit, compartment, and assigned kit can have QR codes.

QR pages are available from the unit detail pages.

QR codes allow crews to:

- jump directly into the right unit
- open the correct compartment
- open the correct assigned kit

This reduces navigation time and helps tie the check to the physical truck layout.

## Exceptions

Exceptions are generated when items are:

- below par
- missing
- newly below par compared to previous checks

The goal is visibility, not punishment.

Crews should enter actual counts even if an item is short.

The admin side exists so supervisors can quickly identify:

- missing equipment
- repeat shortages
- incomplete checks
- operational readiness problems

## Daily Email Reports

The system can send automatic daily reports through Resend.

Reports can include:

- unchecked units
- submitted exceptions
- PDF fleet packet attachments

Reports are sent to admin users with:

- a valid email address
- daily report delivery enabled

The cron endpoint is:

```text
/api/cron/daily-email-report
```

## Printing

The system supports:

- fleet print packets
- individual checksheets
- QR print pages
- historical print records

The print layouts are designed for compact operational use.

## Archiving Units

Units that are retired or no longer operational can be archived.

Archiving:

- removes the unit from normal active views
- preserves historical check records
- preserves compartment and kit relationships
- allows later restoration if needed

Archive units instead of deleting them.

## Comments and Crew Names

Crew names and comments are part of the permanent daily record.

Comments should be used for:

- broken equipment
- supply problems
- unusual findings
- operational concerns
- explanations for shortages

Keep comments factual and operational.

## Recommended Practices

### Do

- Keep layouts standardized where possible.
- Use kits for repeated layouts.
- Review exceptions daily.
- Archive units instead of deleting them.
- Keep the equipment catalog clean.
- Test QR codes after layout changes.
- Print and review checks periodically.
- Review daily report emails.

### Don't

- Delete equipment that is still assigned.
- Create duplicate catalog items unnecessarily.
- Edit a shared kit without understanding what units use it.
- Ignore repeated shortages.
- Give admin access to unauthorized users.
- Make major configuration changes during active morning checks if avoidable.

## Common Questions

### Why are some fields already filled in during checks?

The system can carry forward recent values to speed up daily checks.

Crews still need to verify the actual inventory.

### Why use QR codes instead of paper?

The goal is to make the correct workflow easier while improving accountability and visibility.

### What happens if a crew leaves an item below par?

The exception remains visible for supervisor review and follow-up.

### Can kits be edited from the unit page?

Assigned kits are generally read-only from the unit page. Shared kit content is managed from `/admin/kits`.

### Should old units be deleted?

No. Archive them so historical records stay intact.

## Quick Reference

### Main Admin Routes

| Area | Route |
| --- | --- |
| Fleet | `/admin/fleet` |
| Units | `/admin/units` |
| Kits | `/admin/kits` |
| Equipment | `/admin/equipment` |
| Checksheets | `/admin/checksheets` |
| Users | `/admin/users` |

---

**Document Version:** 1.1  
**Last Updated:** May 2026  
**For Support:** Contact the system administrator or supervising officer.
