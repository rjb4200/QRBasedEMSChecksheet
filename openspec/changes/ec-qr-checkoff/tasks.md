## 1. Project Setup & Infrastructure

- [x] 1.1 Initialize Next.js 15+ project with App Router and TypeScript
- [x] 1.2 Configure Tailwind CSS and shadcn/ui component library
- [x] 1.3 Set up Supabase project and configure PostgreSQL database
- [x] 1.4 Configure Supabase Auth for supervisor identity and signed cookie sessions for admin access
- [x] 1.5 Configure Supabase Storage bucket for compartment photos
- [x] 1.6 Set up Supabase Edge Functions for scheduled jobs
- [ ] 1.7 Configure n8n instance with SMTP email integration
- [x] 1.8 Set up PWA manifest with app name, icons, theme colors, and display mode

## 2. Database Schema

- [x] 2.1 Create `users` table with Supabase Auth linkage
- [x] 2.2 Create `user_roles` table (user_id, role: user/supervisor/admin)
- [x] 2.3 Create `equipment_catalog` table (id, name, default_par_level, input_type, category)
- [x] 2.4 Create `templates` table (id, name, description)
- [x] 2.5 Create `template_compartments` table (id, template_id, name, grid_position, photo_url)
- [x] 2.6 Create `template_compartment_items` table (id, compartment_id, equipment_id, par_level, input_type)
- [x] 2.7 Create `units` table (id, name, status: in_service/out_of_service)
- [x] 2.8 Create `unit_compartments` table (id, unit_id, name, grid_position, photo_url)
- [x] 2.9 Create `unit_compartment_items` table (id, compartment_id, equipment_id, par_level, input_type)
- [x] 2.10 Create `compartment_checks` table (id, unit_id, compartment_id, shift_date, shift_period: daily, status, checked_by, item_data: JSON, time_on_page, completed_at, created_at, updated_at)
- [x] 2.11 Create `shift_archives` table (id, shift_date, shift_period, unit_id, status, completion_percentage, created_at)
- [x] 2.12 Create row-level security policies for role-based access

## 3. Authentication & Authorization

- [x] 3.1 Implement admin username/password login flow with signed HTTP-only cookie session
- [x] 3.2 Remove OAuth provider login dependency
- [x] 3.3 Create role-based access middleware (User/Supervisor/Admin)
- [x] 3.4 Remove admin user management UI because admin access uses configured username/password login
- [x] 3.5 Allow public crew checkoffs without login while keeping admin/supervisor routes protected
- [x] 3.6 Create login page and auth redirect logic
- [x] 3.7 Keep Supabase user records for supervisor access without exposing an admin Users page
- [x] 3.8 Store admin password as a hash and allow production overrides through server-only environment variables

## 4. Equipment Catalog & Unit Copy Management

- [x] 4.1 Build equipment catalog list view with search and category filtering
- [x] 4.2 Build equipment catalog CRUD forms (create, edit, delete)
- [x] 4.3 Use existing units as copy sources for new unit creation
- [x] 4.4 Hide the separate Templates admin section from normal workflow
- [x] 4.5 Make duplicate equipment and unit-copy saves idempotent
- [x] 4.6 Use service-role admin reads for admin management pages
- [x] 4.7 Trim equipment catalog to EC5 checksheet items

## 5. Unit Configuration

- [x] 5.1 Build unit list view for admin dashboard
- [x] 5.2 Build "Create Unit" flow with choice: from existing unit or from scratch
- [x] 5.3 Build unit compartment builder (add/remove compartments, reorder)
- [x] 5.4 Build compartment item assignment UI (search catalog, set par levels)
- [x] 5.5 Build compartment photo upload functionality
- [x] 5.6 Implement unit in-service/out-of-service toggle
- [x] 5.7 Implement unit edit and delete functionality
- [x] 5.8 Carry equipment catalog defaults into compartment item assignments
- [x] 5.9 Add single-compartment import
- [x] 5.10 Add linked compartment groups for shared item changes
- [x] 5.11 Delete individual unit compartment items without deleting the compartment

## 6. QR Code Generation

- [x] 6.1 Install and configure QR code generation library
- [x] 6.2 Build QR code generation endpoint that encodes an absolute `/checkoff/{unit-id}/{compartment-id}` web link
- [x] 6.3 Build QR code print preview page with compartment labels and unit identification
- [x] 6.4 Implement PDF export functionality for QR code pages
- [x] 6.5 Add QR code generation trigger to unit management page
- [x] 6.6 Add individual QR code print action for each compartment QR card
- [x] 6.7 Resolve QR code host from `NEXT_PUBLIC_APP_URL` with request-host fallback

## 7. Crew PWA - Unit Dashboard

- [x] 7.1 Build unit selection screen showing available in-service units
- [x] 7.2 Build compartment status grid with Grey/Yellow/Green visual indicators
- [x] 7.3 Implement compartment status determination from database on page load
- [x] 7.4 Implement completion progress bar (X of Y compartments)
- [x] 7.5 Build global "Scan" button for QR scanner
- [x] 7.6 Ensure compartment grid indicators are non-clickable (no navigation links)
- [x] 7.7 Make `/units` the app entry point and show Admin Dashboard button only for approved admins

## 8. QR Scanner & Checkoff Forms

- [x] 8.1 Implement QR scanner component with device camera integration
- [x] 8.2 Build QR code URL parsing and routing to checkoff form
- [x] 8.3 Build checkoff form layout with compartment photo display
- [x] 8.4 Implement quantity stepper component with [-]/[+] controls
- [x] 8.5 Implement checkbox toggle component for done/not-done items
- [x] 8.6 Implement condition status selector (OK/Low/Missing) with optional numeric field
- [x] 8.7 Display par levels and previous shift count alongside each item
- [x] 8.8 Implement real-time auto-save of form data
- [x] 8.9 Implement time-on-page tracking per compartment form
- [x] 8.10 Build form submission handler that sets status to Green and saves data
- [x] 8.11 Handle out-of-service unit QR scan with error message
- [x] 8.12 Handle invalid QR code scan with error message
- [x] 8.13 Improve scan page visual hierarchy for scanner controls
- [x] 8.14 Add current-day unit crew names and previous-check exceptions to unit checkoff page
- [x] 8.15 Add lock/unlock feedback for saving current-day unit crew names
- [x] 8.16 Count locked crew names toward completion and hide checkbox par labels

## 9. Collision Prevention

- [x] 9.1 Implement lock creation when user opens a compartment form (sets status to Yellow with user_id and timestamp)
- [x] 9.2 Build "Locked" notice UI showing current owner's name
- [x] 9.3 Implement "View Only" mode that displays another user's data as read-only
- [x] 9.4 Implement "Take Over" functionality that transfers ownership silently
- [x] 9.5 Implement stale lock timeout (30 minutes without save activity releases lock)
- [x] 9.6 Handle lock release on form submission or navigation away

## 11. Shift Reset Logic

- [x] 11.1 Implement shift reset scheduled job (runs at 06:00)
- [x] 11.2 Archive completed (Green) compartments to shift_archives table
- [x] 11.3 Save in-progress (Yellow) compartments as "partially complete" with all data
- [x] 11.4 Reset all compartments to Grey status for new shift
- [x] 11.5 Implement previous shift completion summary display (X of Y done, Z%)
- [x] 11.6 Add 5-minute buffer warning before shift reset (05:55)
- [x] 11.7 Save daily unit ledger snapshot at reset for historical fleet counts

## 12. Email Alerts

- [x] 12.1 Configure n8n scheduled workflow for 09:00 trigger
- [x] 12.2 Build API endpoint for n8n to query incomplete in-service units
- [x] 12.3 Build email alert template with unit name, completion count, and percentage
- [x] 12.4 Implement conditional alert sending (no email if all units complete)
- [x] 12.5 Exclude out-of-service units from alert calculations
- [x] 12.6 Include submitted missing and below-par item exceptions in alert payload/email
- [ ] 12.7 Test n8n-to-Supabase integration and email delivery
- [x] 12.8 Include daily check sheet print URL in alert payload for future email attachment workflow

## 13. Admin Dashboard - Fleet Matrix

- [x] 13.1 Build fleet matrix grid showing all units with status
- [x] 13.2 Display completion percentage per unit (X of Y compartments, Z%)
- [x] 13.3 Implement auto-refresh polling every 30 seconds
- [x] 13.4 Remove fleet filters because fleet size is limited and all units should be visible
- [x] 13.5 Build supervisor dashboard (view-only fleet matrix and provider stats)
- [x] 13.6 Display last-14-day submitted missing and below-par item exceptions by date on Fleet page
- [x] 13.7 Add date filtering and CSV export for Fleet exceptions
- [x] 13.8 Compact Fleet page header copy and default exceptions to 7 days
- [x] 13.9 Add Fleet page daily check sheet print action
- [x] 13.10 Compact daily check sheet print layout and include crew names
- [x] 13.11 Use three-column check sheet print layout and omit checkbox par values

## 14. Archive History

- [x] 14.1 Build archive list view with date range and unit filters
- [x] 14.2 Build archive detail view showing all compartment data for a shift
- [x] 14.3 Display partially complete markers with completion percentage
- [x] 14.5 Use saved daily unit ledgers so OOS/deleted/added units do not rewrite history
- [x] 14.6 Add simple and detailed records CSV export options
- [x] 14.7 Add historical daily check sheet print action
- [x] 14.8 Include crew names and crew lock status in records completion/export

## 15. Provider Analytics

- [x] 15.1 Build provider analytics dashboard with time-to-complete metrics
- [x] 15.2 Calculate and display average time per compartment per employee
- [x] 15.3 Calculate and display discrepancy rate per employee
- [x] 15.4 Implement date range and unit filters for analytics
- [x] 15.5 Display analytics data in charts/tables for admin review

## 16. PWA Optimization & Deployment

- [ ] 16.1 Test PWA installation flow on iOS and Android
- [ ] 16.2 Verify standalone mode (no browser chrome) on home screen launch
- [ ] 16.3 Test camera permission flow and QR scanning on mobile devices
- [x] 16.4 Optimize responsive layouts for mobile, tablet, and desktop
- [ ] 16.5 Configure deployment to Vercel with Supabase connection
- [ ] 16.6 Set up Supabase Edge Functions deployment for scheduled jobs
- [ ] 16.7 End-to-end testing of complete crew checkoff workflow
- [ ] 16.8 Generate and print QR code stickers for physical deployment on fleet
