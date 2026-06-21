# EMS Checksheet Admin Guide

This guide covers the day-to-day admin side of the QR-Based EMS Checksheet system.

The admin panel is used to manage fleet readiness, records/archives, issues, system logs, units, compartments, shared kits, equipment, QR codes, templates, users, reports, and notification preferences.

The system is designed to keep the crew workflow simple while giving supervisors and admins better visibility into fleet status and accountability.

## Admin Areas

### Fleet

Route:

```text
/admin
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

The top navigation labels this page as **Fleet**. It is the default admin dashboard at `/admin`.

### Records / Archives

Route:

```text
/admin/archives
```

Records / Archives is the historical daily readiness area.

Admins can:

- review historical daily readiness records
- inspect unit completion status by date
- review archived check data, comments, and exceptions
- print historical records
- export records and archive packages
- clear records through the protected archive workflow when intentionally needed

The printable fleet packet for the current day is available at:

```text
/admin/checksheets/print
```

Use Records / Archives for historical review. Use the Fleet dashboard for current operational readiness.

### Issues

Route:

```text
/admin/issues
```

The Issues page tracks operational follow-up items that need supervisor review.

Admins can:

- create issues from operational observations
- open issue detail pages
- assign status and tags
- add notes/comments to issue history
- preserve addressed notes and context for auditability
- filter and review active or historical issues

The Fleet dashboard also shows recent open issues so supervisors can see active follow-up work while reviewing daily readiness.

Weekly Issues Digest emails are generated from the Issues workflow and are sent to admin users who have weekly digest delivery enabled.

### System Log

Route:

```text
/admin/system-log
```

The System Log shows operationally significant events such as checkoff activity, admin actions, report sends, notification failures, and other system events.

Use the log to answer:

```text
What happened, when, and from which workflow?
```

Do not use the System Log as a place to store secrets or sensitive credentials.

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

### Templates

Route:

```text
/admin/templates
```

Templates are reusable layout starting points for units and configuration work.

Use templates when you want a consistent structure that can be copied into new or updated unit layouts.

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

### Print Checksheets

Route:

```text
/admin/checksheets/print
```

This area generates printable check sheets for operational use.

Admins can:

- generate daily print packets
- print current check sheets
- use a compact layout designed for operational review

Historical records are reviewed through Records / Archives at `/admin/archives`.

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
- enable/disable weekly Issues Digest emails
- configure Pushover user keys and alert preferences
- test daily report, weekly digest, and Pushover delivery

Only authorized personnel should have admin access.

#### Pushover Notifications

Pushover sends push notifications to your phone, tablet, or desktop when important events occur. Each admin can opt into the alert types they want.

**Setup:**

1. Create a free Pushover account at [pushover.net](https://pushover.net)
2. From your Pushover dashboard, copy your 30-character **User Key**
3. Install the Pushover app on your phone, tablet, or desktop
4. In the Admin Users page, edit your user and:
   - Paste your User Key
   - Toggle "On" to enable Pushover alerts
   - Check the alert types you want to receive
   - Select the shifts that should trigger missed-checkoff alerts for you
5. Save the user settings

**Alert types:**

| Alert | Time | Description |
|---|---|---|
| Daily report summary | 1000 ET | Brief summary after the daily report email is sent |
| Missed checkoff | 0930 ET | Initial alert for incomplete units |
| Missed checkoff follow-up | 1300 ET | Follow-up if units are still incomplete |

Missed-checkoff alerts can be filtered per admin by shift preference: 1st Shift, 2nd Shift, and 3rd Shift.

#### Weekly Issues Digest

Admin users can opt into the Weekly Issues Digest from `/admin/users`.

The digest summarizes active issue-tracker items for the week and is separate from the daily readiness email. Use the test weekly report control on the Admin Users page to send a one-off test to a selected recipient.

**Quiet hours:** Automated Pushover alerts are not sent outside 0800-2200 ET. Manual test sends from the Admin Users page always work regardless of time.

**Testing:** Use the "Test Pushover" dropdown on the Admin Users page to send a test notification. This confirms your User Key is correct.

**Device management:** Pushover handles device selection, quiet hours, and notification sounds on your device. Configure these in the Pushover app — not in this admin panel.

**Troubleshooting:** If you stop receiving alerts, check that:
- Your User Key is still valid (not regenerated)
- The Pushover app is installed and logged in on your device
- The alert type you expect is checked in your preferences
- It is between 0800-2200 ET (manual test sends bypass this)

## Daily Workflow

A normal admin/supervisor workflow usually looks like:

1. Review the Fleet page.
2. Identify incomplete units.
3. Review exceptions/comments.
4. Review recent open Issues on the Fleet dashboard or Issues page.
5. Follow up on missing or below-par equipment.
6. Print records or current check sheets if needed.
7. Review daily email reports and weekly Issues Digest emails.

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

The system sends automatic daily reports through Resend to admin users with report delivery enabled.

Each email includes:

- a summary line with the date, unit count, and total exceptions
- per-unit cards showing completion percentage, progress bar, exception count, and comments
- general unit comments alongside section comments
- compact green cards for fully complete units with no exceptions
- a PDF fleet packet attachment

The cron endpoint is:

```text
/api/cron/daily-email-report
```

### Testing the Daily Report

You can send a test email to a single address without triggering the full recipient list:

```bash
curl -X POST "https://your-app.vercel.app/api/cron/daily-email-report?test=you@example.com&force=true" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

| Parameter | Purpose |
|---|---|
| `?test=email` | Override recipients — sends to only this address |
| `?force=true` | Skip the send-hour check and already-sent gate |
| `?date=YYYY-MM-DD` | Generate report for a specific date instead of today |

Without `?test=`, the report sends to all admin users who have daily report delivery enabled. The `?force=true` parameter bypasses the configured send hour and idempotency check so you can test repeatedly.

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
| Fleet | `/admin` |
| Records / Archives | `/admin/archives` |
| Issues | `/admin/issues` |
| System Log | `/admin/system-log` |
| Units | `/admin/units` |
| Kits | `/admin/kits` |
| Equipment | `/admin/equipment` |
| Templates | `/admin/templates` |
| Print Checksheets | `/admin/checksheets/print` |
| Unit QR Codes | `/admin/units/{unit-id}/qr` |
| Users | `/admin/users` |

---

**Document Version:** 1.2
**Last Updated:** June 2026
**For Support:** Contact the system administrator or supervising officer.
