# EMS Checksheet Admin Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Admin Pages Overview](#admin-pages-overview)
3. [Do's and Don'ts](#dos-and-donts)
4. [Common Tasks](#common-tasks)
5. [System Features](#system-features)

---

## Introduction

### What is the Admin Panel?

The admin panel is where you manage the EMS Checksheet system. This is where you configure units, equipment, compartments, and monitor fleet status.

### Who Can Access?

Admin access is restricted to authorized personnel only. Access requires authentication through the User Management section.

### Your Responsibilities

As an admin, you are responsible for:
- Adding and configuring new units
- Managing the equipment catalog
- Building and organizing compartments
- Linking compartments for synchronized configuration
- Monitoring fleet readiness
- Generating reports and printouts

---

## Admin Pages Overview

### Fleet Page (`/admin/fleet`)

The Fleet page provides an overview of your entire fleet's status.

**Features:**
- View all units and their current status
- See completion percentages for each unit
- Filter by status (all, ready, needs attention)
- Quick access to individual unit checkoffs
- Exception summary showing items below par

**Status Indicators:**
- **Ready** - Unit has been checked off and has no exceptions
- **Incomplete** - Checkoff not finished for the day
- **Has Exceptions** - Items are below par and need attention

---

### Units Page (`/admin/units`)

The Units page is where you create and manage individual vehicles.

**Features:**
- Create new units with custom names
- Configure compartments for each unit
- Link compartments across multiple units
- Set up photos for visual identification
- Archive units that are out of service (OOS)
- View unit checkoff history

**Unit Configuration Options:**
- Unit name (e.g., "EC5", "Medic 1")
- Status: Active or OOS (Out of Service)
- Compartments with custom equipment assignments

---

### Checksheets Page (`/admin/checksheets`)

The Checksheets page displays completed checkoff records.

**Features:**
- View all historical checkoffs by date
- Filter by unit
- See crew names who performed each checkoff
- Review exceptions and comments
- Print daily checksheets
- Export historical records

**Print Options:**
- Daily checksheet with current day's values
- Historical records with date range selection

---

### Equipment Catalog Page (`/admin/equipment`)

The Equipment Catalog is where you define all equipment items used in checkoffs.

**Features:**
- Add new equipment to the catalog
- Edit equipment properties (name, par level, input type)
- Delete equipment not in use
- Search equipment by name
- Filter by category

**Equipment Properties:**
- **Name** - Description of the item
- **Default Par Level** - Standard quantity needed
- **Input Type** - How the item is counted:
  - *Quantity* - Use stepper to enter count
  - *Checkbox* - Binary done/not-done
  - *Condition* - Status selector (Good/Fair/Poor)
- **Category** - Grouping (Medical, PPE, Tools, etc.)

---

### User Management Page (`/admin/users`)

The User Management page controls admin access to the system.

**Features:**
- View list of admin users
- Add new admin users
- Remove admin access
- Reset admin passwords

**Important:** Only authorized personnel should have admin access. Each admin user should have their own account for accountability.

---

## Do's and Don'ts

### DO:

- ✅ Complete admin tasks during your shift as needed
- ✅ Keep equipment catalog up to date with current items
- ✅ Verify compartment configurations are accurate
- ✅ Use linked compartments to keep similar units in sync
- ✅ Review fleet status regularly to catch issues
- ✅ Generate and review printouts for accuracy
- ✅ Archive units properly when they go out of service
- ✅ Document any system changes or issues
- ✅ Test new configurations before relying on them

### DON'T:

- ❌ Delete equipment that is assigned to active compartments
- ❌ Remove a unit's compartments without a backup plan
- ❌ Break compartment links without understanding the impact
- ❌ Create duplicate equipment with different names
- ❌ Leave equipment in the catalog that is no longer used
- ❌ Give admin access to unauthorized personnel
- ❌ Make changes to production during active checkoffs if possible
- ❌ Ignore fleet status warnings
- ❌ Share admin credentials

---

## Common Tasks

### Adding New Equipment to Catalog

1. Navigate to `/admin/equipment`
2. Click "Add Equipment" button
3. Enter equipment name (e.g., "N95 Masks")
4. Set default par level (e.g., 20)
5. Select input type:
   - Quantity (for countable items)
   - Checkbox (for binary items)
   - Condition (for quality assessment)
6. Optionally select a category
7. Click Save

**Note:** If equipment with the same name already exists, it will update that entry instead of creating a duplicate.

---

### Creating a New Unit

1. Navigate to `/admin/units`
2. Click "Add Unit" button
3. Enter unit name (e.g., "EC6")
4. Click Create
5. Add compartments:
   - Click "Add Compartment"
   - Enter compartment name (e.g., "Driver Side", "Narc Box")
   - Add equipment from catalog to compartment
   - Set sort order for items
6. Configure additional compartments as needed
7. Save changes

**Tip:** Start with a minimal compartment setup and add more as needed.

---

### Building Compartments with Equipment

1. Navigate to `/admin/units` and select your unit
2. Click "Add Compartment" or select existing compartment
3. In the compartment, click "Add Item"
4. Search and select equipment from the catalog
5. Repeat for all items needed in this compartment
6. Drag items to reorder as needed
7. Set subcategories to group related items

**Linked Compartments:** If you want this compartment to share configuration with other units, see "Linking Compartments" below.

---

### Linking Compartments

Linking compartments allows you to share equipment configuration across multiple units. When you add, remove, or modify items in a linked compartment, all linked compartments update automatically.

**Use Cases:**
- Multiple units with identical "Narc Box" configurations
- Common compartments across similar apparatus
- Standardized equipment layouts

**To Link Compartments:**

1. Navigate to `/admin/units` and select a unit
2. Select the compartment to link
3. Click "Link Compartment"
4. Enter a link group name (e.g., "Narc Box", "Airway Kit")
5. Select other units' compartments to link
6. Confirm the link

**Behavior:**
- Existing items in the new link group are preserved
- Future changes sync across all linked compartments
- Deleting a linked compartment doesn't affect other units

---

### Printing Daily Checksheets

1. Navigate to `/admin/checksheets`
2. Select the unit from the dropdown
3. Select date range (default: today)
4. Click "Print Checksheet"
5. A printable view will open
6. Use browser print (Ctrl+P) to print

**What's Included:**
- Unit name and date
- Each compartment with items
- Par levels and actual counts
- Any exceptions highlighted
- Comments if present

---

### Printing Historical Records

1. Navigate to `/admin/checksheets`
2. Select the unit
3. Choose date range (start and end dates)
4. Click "View Records"
5. Review the historical data
6. Click "Print" to generate a printable report

**Use Cases:**
- Monthly compliance reports
- Auditing purposes
- Supervisor reviews

---

## System Features

### Units Management

**Configuration Options:**
- Unit name and identification
- Compartment structure
- Linked compartment groups
- Photo for visual identification
- OOS (Out of Service) status

**Archive Feature:**
When a unit is taken out of service:
1. Open the unit in `/admin/units`
2. Click "Archive Unit"
3. Confirm the action
4. Unit moves to archived status
5. Does not appear in active fleet views

**Restoring Archived Units:**
Archived units can be restored to active status through the same interface.

---

### Fleet Overview

The Fleet page shows a summary of all units:

- **Total Units** - Count of all active units
- **Completion Rate** - Percentage of units checked off today
- **Exception Count** - Total items below par across fleet

**Filtering:**
- Show all units
- Show only incomplete
- Show only with exceptions

---

### Checksheet Management

**Record Contents:**
Each checksheet record contains:
- Timestamp
- Crew names
- Compartment-by-compartment item status
- Actual counts vs par levels
- Comments from crew
- Completion status

**Retention:**
Records are kept indefinitely unless deleted by admin.

---

### Export/Import Functionality

**Export Unit Layout:**
1. Navigate to `/admin/units`
2. Select the unit
3. Click "Export Layout"
4. Download JSON file with compartment structure

**Import Unit Layout:**
1. Navigate to `/admin/units`
2. Click "Import Layout"
3. Select JSON file
4. Confirm import
5. Review and adjust as needed

**Use Cases:**
- Backup unit configurations
- Copy configuration to new unit
- Share configurations between admins

---

### Archive and OOS Features

**OOS (Out of Service):**
- Units can be marked OOS when not in active use
- OOS units don't require daily checkoffs
- OOS units appear in fleet with OOS badge

**Archive:**
- Archiving removes unit from active view
- Archived data is preserved
- Can be restored anytime

**Workflow:**
1. Unit goes out of service → Mark OOS
2. Unit retired from fleet → Archive
3. Unit returns to service → Restore from archive

---

### Linked Compartment Synchronization

**How It Works:**

When compartments are linked:
1. Changes in one compartment apply to all linked compartments
2. Adding equipment propagates to all links
3. Removing equipment propagates to all links
4. Reordering items syncs across all links

**Important Behaviors:**

| Action | Non-Linked | Linked |
|--------|------------|--------|
| Add item | Applies to single compartment | Applies to all linked |
| Remove item | Applies to single compartment | Applies to all linked |
| Edit item | Applies to single compartment | Applies to all linked |
| Delete unit | Compartment data lost | Shared data preserved |

**Shared Item Storage:**
Linked compartments use a shared item table. This means:
- The link group owns the items, not individual units
- Deleting a unit doesn't delete shared items
- Other units with the same link continue normally

---

## Quick Reference

### Common Admin URLs
- Fleet: `/admin/fleet`
- Units: `/admin/units`
- Checksheets: `/admin/checksheets`
- Equipment: `/admin/equipment`
- Users: `/admin/users`

### Daily Admin Checklist
- [ ] Review fleet status
- [ ] Check for new exceptions
- [ ] Verify completed checkoffs
- [ ] Address any equipment issues

---

**Document Version:** 1.0
**Last Updated:** May 2026
**For System Support:** Contact technical support