## 1. Project Setup & Infrastructure

- [ ] 1.1 Initialize Next.js 15+ project with App Router and TypeScript
- [ ] 1.2 Configure Tailwind CSS and shadcn/ui component library
- [ ] 1.3 Set up Supabase project and configure PostgreSQL database
- [ ] 1.4 Configure Supabase Auth with Google OAuth and domain restriction (@winchesterky.com)
- [ ] 1.5 Configure Supabase Storage bucket for compartment photos
- [ ] 1.6 Set up Supabase Edge Functions for scheduled jobs
- [ ] 1.7 Configure n8n instance with SMTP email integration
- [ ] 1.8 Set up PWA manifest with app name, icons, theme colors, and display mode

## 2. Database Schema

- [ ] 2.1 Create `users` table with Google OAuth linkage
- [ ] 2.2 Create `user_roles` table (user_id, role: user/supervisor/admin)
- [ ] 2.3 Create `equipment_catalog` table (id, name, default_par_level, input_type, category)
- [ ] 2.4 Create `templates` table (id, name, description)
- [ ] 2.5 Create `template_compartments` table (id, template_id, name, grid_position, photo_url)
- [ ] 2.6 Create `template_compartment_items` table (id, compartment_id, equipment_id, par_level, input_type)
- [ ] 2.7 Create `units` table (id, name, status: in_service/out_of_service)
- [ ] 2.8 Create `unit_compartments` table (id, unit_id, name, grid_position, photo_url)
- [ ] 2.9 Create `unit_compartment_items` table (id, compartment_id, equipment_id, par_level, input_type)
- [ ] 2.10 Create `compartment_checks` table (id, unit_id, compartment_id, shift_date, shift_period: day/night, status, checked_by, item_data: JSON, time_on_page, completed_at, created_at, updated_at)
- [ ] 2.11 Create `shift_archives` table (id, shift_date, shift_period, unit_id, status, completion_percentage, signatures: JSON, created_at)
- [ ] 2.12 Create row-level security policies for role-based access

## 3. Authentication & Authorization

- [ ] 3.1 Implement Google OAuth login flow via Supabase Auth
- [ ] 3.2 Implement secondary OAuth (Microsoft) login flow
- [ ] 3.3 Create role-based access middleware (User/Supervisor/Admin)
- [ ] 3.4 Create user role management UI for admins
- [ ] 3.5 Implement domain restriction to @winchesterky.com
- [ ] 3.6 Create login page and auth redirect logic

## 4. Equipment Catalog & Template Management

- [ ] 4.1 Build equipment catalog list view with search and category filtering
- [ ] 4.2 Build equipment catalog CRUD forms (create, edit, delete)
- [ ] 4.3 Build template list view showing compartment and item counts
- [ ] 4.4 Build template builder UI (add/remove compartments, add items from catalog)
- [ ] 4.5 Implement "Create Template from Unit" copy functionality
- [ ] 4.6 Implement template delete functionality with validation

## 5. Unit Configuration

- [ ] 5.1 Build unit list view for admin dashboard
- [ ] 5.2 Build "Create Unit" flow with choice: from template or from scratch
- [ ] 5.3 Build unit compartment builder (add/remove compartments, reorder)
- [ ] 5.4 Build compartment item assignment UI (search catalog, set par levels)
- [ ] 5.5 Build compartment photo upload functionality
- [ ] 5.6 Implement unit in-service/out-of-service toggle
- [ ] 5.7 Implement unit edit and delete functionality

## 6. QR Code Generation

- [ ] 6.1 Install and configure QR code generation library
- [ ] 6.2 Build QR code generation endpoint that encodes `/checkoff/{unit-id}/{compartment-id}`
- [ ] 6.3 Build QR code print preview page with compartment labels and unit identification
- [ ] 6.4 Implement PDF export functionality for QR code pages
- [ ] 6.5 Add QR code generation trigger to unit management page

## 7. Crew PWA - Unit Dashboard

- [ ] 7.1 Build unit selection screen showing available in-service units
- [ ] 7.2 Build compartment status grid with Grey/Yellow/Green visual indicators
- [ ] 7.3 Implement compartment status determination from database on page load
- [ ] 7.4 Implement completion progress bar (X of Y compartments)
- [ ] 7.5 Build global "Scan" button for QR scanner
- [ ] 7.6 Ensure compartment grid indicators are non-clickable (no navigation links)

## 8. QR Scanner & Checkoff Forms

- [ ] 8.1 Implement QR scanner component with device camera integration
- [ ] 8.2 Build QR code URL parsing and routing to checkoff form
- [ ] 8.3 Build checkoff form layout with compartment photo display
- [ ] 8.4 Implement quantity stepper component with [-]/[+] controls
- [ ] 8.5 Implement checkbox toggle component for done/not-done items
- [ ] 8.6 Implement condition status selector (OK/Low/Missing) with optional numeric field
- [ ] 8.7 Display par levels and previous shift count alongside each item
- [ ] 8.8 Implement real-time auto-save of form data
- [ ] 8.9 Implement time-on-page tracking per compartment form
- [ ] 8.10 Build form submission handler that sets status to Green and saves data
- [ ] 8.11 Handle out-of-service unit QR scan with error message
- [ ] 8.12 Handle invalid QR code scan with error message

## 9. Collision Prevention

- [ ] 9.1 Implement lock creation when user opens a compartment form (sets status to Yellow with user_id and timestamp)
- [ ] 9.2 Build "Locked" notice UI showing current owner's name
- [ ] 9.3 Implement "View Only" mode that displays another user's data as read-only
- [ ] 9.4 Implement "Take Over" functionality that transfers ownership silently
- [ ] 9.5 Implement stale lock timeout (30 minutes without save activity releases lock)
- [ ] 9.6 Handle lock release on form submission or navigation away

## 10. Personnel Sign-off

- [ ] 10.1 Build sign-off flow after all compartments are completed
- [ ] 10.2 Implement signature capture using authenticated user identity
- [ ] 10.3 Allow multiple crew members to sign off on same shift
- [ ] 10.4 Display signatures on unit dashboard when checkoff is complete

## 11. Shift Reset Logic

- [ ] 11.1 Implement shift reset scheduled job (runs at 06:00 and 18:00)
- [ ] 11.2 Archive completed (Green) compartments to shift_archives table
- [ ] 11.3 Save in-progress (Yellow) compartments as "partially complete" with all data
- [ ] 11.4 Reset all compartments to Grey status for new shift
- [ ] 11.5 Implement previous shift completion summary display (X of Y done, Z%)
- [ ] 11.6 Add 5-minute buffer warning before shift reset (05:55 / 17:55)

## 12. Email Alerts

- [ ] 12.1 Configure n8n scheduled workflow for 09:00 and 21:00 triggers
- [ ] 12.2 Build API endpoint for n8n to query incomplete in-service units
- [ ] 12.3 Build email alert template with unit name, completion count, and percentage
- [ ] 12.4 Implement conditional alert sending (no email if all units complete)
- [ ] 12.5 Exclude out-of-service units from alert calculations
- [ ] 12.6 Test n8n-to-Supabase integration and email delivery

## 13. Admin Dashboard - Fleet Matrix

- [ ] 13.1 Build fleet matrix grid showing all units with status
- [ ] 13.2 Display completion percentage per unit (X of Y compartments, Z%)
- [ ] 13.3 Implement auto-refresh polling every 30 seconds
- [ ] 13.4 Add filter controls for unit type (EC/Medic) and shift
- [ ] 13.5 Build supervisor dashboard (view-only fleet matrix and provider stats)

## 14. Archive History

- [ ] 14.1 Build archive list view with date range, unit, and user filters
- [ ] 14.2 Build archive detail view showing all compartment data for a shift
- [ ] 14.3 Display partially complete markers with completion percentage
- [ ] 14.4 Display personnel signatures for archived shifts

## 15. Provider Analytics

- [ ] 15.1 Build provider analytics dashboard with time-to-complete metrics
- [ ] 15.2 Calculate and display average time per compartment per employee
- [ ] 15.3 Calculate and display discrepancy rate per employee
- [ ] 15.4 Implement date range and unit filters for analytics
- [ ] 15.5 Display analytics data in charts/tables for admin review

## 16. PWA Optimization & Deployment

- [ ] 16.1 Test PWA installation flow on iOS and Android
- [ ] 16.2 Verify standalone mode (no browser chrome) on home screen launch
- [ ] 16.3 Test camera permission flow and QR scanning on mobile devices
- [ ] 16.4 Optimize responsive layouts for mobile, tablet, and desktop
- [ ] 16.5 Configure deployment to Vercel with Supabase connection
- [ ] 16.6 Set up Supabase Edge Functions deployment for scheduled jobs
- [ ] 16.7 End-to-end testing of complete crew checkoff workflow
- [ ] 16.8 Generate and print QR code stickers for physical deployment on fleet
