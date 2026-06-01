# QR Checkoff Database Guide

This document describes every database table, key relationships, stored data, and optimization strategies in the QR-Based EMS Checksheet system.

## Table Inventory

The database contains approximately 30 tables organized into three domains:

| Domain | Tables | Purpose |
|---|---|---|
| **Operational** | compartment_checks, shift_archives, daily_unit_ledgers, daily_unit_crews, daily_unit_comments, daily_section_comments, daily_restock_items, daily_manual_restock_items, daily_email_report_runs | Daily checkoff records, crew assignments, comments, restocking, email reports |
| **Configuration** | units, unit_compartments, unit_compartment_items, unit_compartment_item_groups, unit_kits, kits, kit_items, kit_item_groups, equipment_catalog, templates, template_compartments, template_compartment_items, qr_targets, shift_calendar | Unit setup, equipment catalog, kit definitions, QR codes, shift definitions |
| **Admin** | admin_users, users, user_roles, system_logs | Authentication, authorization, audit logging |

## Core Data Flow

```text
Daily Checkoff Flow:
                    ┌──────────────────┐
                    │  equipment_catalog │ ← master item list
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │      units       │ ← unit definitions + status
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
     ┌────────────┐  ┌────────────┐  ┌────────────┐
     │ compartments│  │ unit_kits  │  │daily_unit_ │
     │ (unit-      │  │ → kits     │  │  crews     │
     │  specific)  │  │ (shared)   │  │            │
     └──────┬──────┘  └──────┬─────┘  └────────────┘
            │                │
            ▼                ▼
     ┌─────────────────────────────┐
     │   compartment_checks        │ ← crew completes checks
     │   (one per target per day)  │
     └─────────────┬───────────────┘
                   │
     ┌─────────────┼───────────────┐
     ▼             ▼               ▼
┌──────────┐ ┌───────────┐ ┌──────────────┐
│daily_unit│ │daily_unit │ │daily_section │
│_ledgers  │ │_comments  │ │_comments     │
│(snapshot)│ │           │ │              │
└────┬─────┘ └───────────┘ └──────────────┘
     │
     ▼
┌──────────┐
│shift_    │ ← historical archive (optional)
│archives  │
└──────────┘
```

## Operational Tables

### compartment_checks

Stores one row per compartment or kit check target per shift.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| unit_id | uuid → units.id | The unit being checked |
| compartment_id | uuid → unit_compartments.id | Nullable; the compartment |
| unit_kit_id | uuid → unit_kits.id | Nullable; the assigned kit |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| status | enum(in_progress, completed, partially_complete) | Check status |
| checked_by | uuid → users.id | Crew member who checked |
| item_data | jsonb | Submitted item values per equipment item |
| completed_at | timestamptz | When the check was completed |
| started_at | timestamptz | When the check was started |
| submitted_at | timestamptz | When the check was submitted |
| time_to_complete_seconds | integer | Duration |

### shift_archives

Stores a frozen snapshot of a completed daily check for historical records.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| unit_id | uuid → units.id | The unit |
| status | enum(in_progress, completed, partially_complete) | Archived status |
| completion_percentage | numeric | Snapshotted percentage |
| completed_compartments | integer | Snapshotted completed count |
| total_compartments | integer | Snapshotted total count |
| check_data | jsonb | Snapshotted check data |
| operational_date | date | Original operational date |
| checked_by | uuid → users.id | Crew member who checked |
| shift_id | uuid → shift_calendar.id | Shift definition |

### daily_unit_ledgers

A daily snapshot of each unit's status, created at shift start or on-demand. Used by the Fleet Panel and Records page to display unit state per date.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| unit_id | uuid | Unit reference |
| unit_name | text | Denormalized unit name |
| unit_status | text | Status at snapshot time |
| total_compartments | integer | Compartment and kit count at snapshot |
| archived | boolean | Whether the unit was archived on this date |
| status_note | text | Additional status context |

### daily_unit_crews

Crew assignments per unit per shift.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| unit_id | uuid → units.id | The unit |
| provider_names | text | Crew member names |
| locked | boolean | Whether crew info is locked |

### daily_unit_comments

General unit comments per shift (not compartment-specific).

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| unit_id | uuid → units.id | The unit |
| comment | text | Comment text (max 2000 chars) |

### daily_section_comments

Compartment or kit-specific notes per shift.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| unit_id | uuid → units.id | The unit |
| source_type | text (compartment, kit) | What kind of section |
| source_id | uuid | The compartment or kit ID |
| source_name | text | Denormalized section name |
| comment | text | Comment text (max 2000 chars) |

### daily_restock_items

Exception and restocking items flagged during daily checks.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| unit_id | uuid → units.id | The unit |
| shift_date | date | Operational date |
| shift_period | enum(daily) | Always 'daily' |
| target_type | text (compartment, kit) | Section type |
| target_id | uuid | Section ID |
| item_id | uuid | Equipment item ID |
| issue_type | text (missing, below_par, condition_issue) | The issue |
| addressed | boolean | Whether the issue was addressed |
| addressed_at | timestamptz | When addressed |
| addressed_by | text | Who addressed it |

### daily_manual_restock_items

Manually added restocking items (not tied to equipment catalog).

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| unit_id | uuid → units.id | The unit |
| shift_date | date | Operational date |
| item_name | text | Manual item name |
| note | text | Optional note |
| source_name | text | Source label (default "Manual") |
| addressed | boolean | Whether addressed |

### daily_email_report_runs

Tracks daily email report delivery attempts.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| report_date | date | The date the report covers (unique) |
| sent_at | timestamptz | When it was sent |
| recipient_count | integer | Number of recipients |
| status | text | sent, failed, etc. |
| error_message | text | Error details if failed |
| resend_message_id | text | Resend API message ID |

## Configuration Tables

### units

Unit definitions (apparatus, vehicles).

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | Unique unit name |
| unit_kind | text | Category label (default "EC") |
| status | enum(in_service, out_of_service) | Operational status |
| monthly_check_day | integer | Day of month for monthly checks (1-31) |
| oos_at | timestamptz | When marked OOS |
| oos_by_name | text | Who marked OOS |
| deleted_at | timestamptz | Soft delete timestamp |

### unit_compartments

Compartments belonging to a specific unit.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| unit_id | uuid → units.id | Parent unit |
| name | text | Compartment name |
| sort_order | integer | Display order |
| qr_location_note | text | Location hint for QR |
| photo_url | text | Optional photo |
| grid_position | jsonb | Layout position |

### unit_compartment_items

Equipment items assigned to a specific compartment.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| compartment_id | uuid → unit_compartments.id | Parent compartment |
| equipment_id | uuid → equipment_catalog.id | Equipment reference |
| par_level | numeric | Override par for this compartment |
| input_type | enum(quantity, checkbox, condition) | Check input type |
| sort_order | integer | Display order |
| group_id | uuid → unit_compartment_item_groups.id | Optional grouping |

### unit_compartment_item_groups

Groupings of items within a compartment.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| compartment_id | uuid → unit_compartments.id | Parent compartment |
| name | text | Group name |
| sort_order | integer | Display order |

### unit_kits

Shared kit assignments to units.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| unit_id | uuid → units.id | The unit |
| kit_id | uuid → kits.id | The kit |
| sort_order | integer | Display order |
| qr_location_note | text | Location hint for QR |

### kits

Shared kit definitions (bags, cabinets, monitor check sets).

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | Unique kit name |
| description | text | Optional description |
| sort_order | integer | Display order |
| active | boolean | Whether the kit is active |
| photo_url | text | Optional photo |

### kit_items

Equipment items assigned to a kit.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| kit_id | uuid → kits.id | Parent kit |
| equipment_id | uuid → equipment_catalog.id | Equipment reference |
| par_level | numeric | Par level for this kit item |
| input_type | enum(quantity, checkbox, condition) | Check input type |
| sort_order | integer | Display order |
| group_id | uuid → kit_item_groups.id | Optional grouping |

### kit_item_groups

Groupings of items within a kit.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| kit_id | uuid → kits.id | Parent kit |
| name | text | Group name |
| sort_order | integer | Display order |

### equipment_catalog

Master list of all equipment items.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| name | text | Item name |
| category | text | Category label (default "Uncategorized") |
| default_par_level | numeric | Default par level |
| input_type | enum(quantity, checkbox, condition) | Default input type |

### templates / template_compartments / template_compartment_items

Reusable unit templates for rapid setup (currently unused in data, reserved for future use).

### qr_targets

QR code records linking a code to a unit, compartment, or kit.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| code | text | The QR code string |
| unit_id | uuid → units.id | Target unit |
| compartment_id | uuid → unit_compartments.id | Optional compartment target |
| unit_kit_id | uuid → unit_kits.id | Optional kit target |
| active | boolean | Whether this QR code is active |

### shift_calendar

Pre-generated shift dates with shift names and time ranges.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| operational_date | date | Unique date |
| shift_name | text | 1st Shift, 2nd Shift, 3rd Shift |
| starts_at | timestamptz | Shift start |
| ends_at | timestamptz | Shift end |

## Admin Tables

### users (Supabase Auth)

Managed by Supabase Auth. Contains email, full_name, avatar_url.

### user_roles

Maps users to application roles.

| Column | Type | Description |
|---|---|---|
| user_id | uuid → users.id | The user |
| role | enum(user, supervisor, admin) | Application role |

### admin_users

Stores admin credentials for the custom admin login system (separate from Supabase Auth).

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| username | text | Unique username |
| password_hash | text | bcrypt hashed password |
| email | text | Email for daily reports |
| receives_daily_report | boolean | Whether to send daily reports |

### system_logs

Audit trail for administrative, crew, and system actions.

| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| actor_type | text (admin, crew, system) | Who performed the action |
| actor_id | text | Actor identifier |
| actor_name | text | Human-readable actor name |
| action | text | Action verb (e.g., unit.status_changed) |
| area | text | Domain (fleet, checkoff, equipment, etc.) |
| target_type | text | What was acted on |
| target_id | text | Target identifier |
| target_name | text | Target display name |
| result | text (success, failure, warning) | Outcome |
| message | text | Human-readable message |
| before_data | jsonb | State before the action |
| after_data | jsonb | State after the action |
| metadata | jsonb | Additional context |

## Data Lifecycle

### Daily Checkoff Flow

1. A shift starts. `daily_unit_ledgers` are created or refreshed via `refreshDailyUnitLedgers()`.
2. Crew scans QR codes and completes `compartment_checks`.
3. Crew enters names into `daily_unit_crews`.
4. Comments are saved to `daily_unit_comments` (general) and `daily_section_comments` (per-section).
5. Restocking items are flagged in `daily_restock_items`.
6. Optionally, completed checks are archived into `shift_archives` as a frozen snapshot.

### Data Rotation (Records Cleanup)

Operational tables can be cleared via the Records page DELETE mechanism:

1. Only rows **before today** are eligible.
2. Maximum range: **60 days**.
3. A ZIP export package is generated before deletion.
4. The `clear_operational_records` stored procedure handles transactional deletion.
5. Configuration tables (units, equipment_catalog, kits, etc.) are **never** cleared.

### Data Retention

| Data | Retention |
|---|---|
| system_logs | 3 months (automatic cleanup) |
| daily_email_report_runs | Cleared with data rotation |
| compartment_checks, daily_unit_* | Cleared with data rotation |
| shift_archives | Cleared with data rotation |
| Configuration tables | Never cleared |

## Optimizations

### Stored Procedures

Two PostgreSQL functions handle data rotation efficiently:

- **`preview_operational_counts(from_date, to_date, unit_id)`** — Returns per-table row counts for a date range without deleting.
- **`clear_operational_records(from_date, to_date, unit_id)`** — Deletes rows from all 8 operational tables in a single transaction, returning the count per table.

### Row-Level Security (RLS)

Every table has RLS enabled. Policies restrict access based on the authenticated user's role:

- **Admin users**: Full read/write access to all tables.
- **Crew users**: Can read/update their own check records and unit data.
- **Public (anonymous)**: Can access checkoff flows for QR code scanning.
- **Service role**: Bypasses RLS for server-side operations (cron jobs, data rotation).

### Bulk Queries

The Fleet Panel uses a single `getFleetStatus()` call that queries multiple tables in parallel (`Promise.all`), avoiding per-unit database round-trips. The records page similarly aggregates compartment checks, crews, comments, and archives in a single set of parallel queries.

### Daily Unit Ledgers

`daily_unit_ledgers` serves as a point-in-time snapshot of each unit's configuration. When the Fleet Panel loads today's data, `refreshDailyUnitLedgers()` ensures the ledger rows reflect the current unit state before rendering, preventing stale configuration from appearing.

### Soft Deletes

Units use `deleted_at` timestamps rather than hard deletes. This preserves historical records (ledgers, archives, crew names) for dates when the unit was active, even after it is removed from current workflows.

---

**Document Version:** 1.0  
**Last Updated:** June 2026
