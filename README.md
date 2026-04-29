# QR-Based EMS Checksheet

Mobile-first EMS vehicle checkoff application for QR-based compartment inspections, fleet readiness tracking, and admin-managed unit/equipment configuration.

## Features

- Public crew checkoff workflow at `/units` with no login required.
- QR codes route directly to compartment checkoff forms.
- Admin dashboard for fleet status, units, equipment, users, and QR printing.
- Unit layouts can be created from scratch or copied from existing units.
- Equipment catalog with reusable items, input types, categories, and par levels.
- Full-sheet and individual QR code printing.
- Supabase-backed PostgreSQL database, Auth, Storage, and Row Level Security.
- Email magic-link login for admin/supervisor access and personnel signatures.
- Daily checkoff state, shift archive support, and completion status tracking.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Supabase PostgreSQL/Auth/Storage
- QR code generation with `qrcode`
- Camera scanning with `html5-qrcode`

## Getting Started

### Install Dependencies

```bash
npm install
```

### Environment Variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
N8N_BASE_URL="https://your-n8n-instance.example.com"
```

Do not commit `.env`, `.env.local`, service role keys, or generated credentials.

### Run Development Server

```bash
npm run dev
```

Open `http://localhost:3000`. The app redirects to `/units`.

## Available Scripts

```bash
npm run dev        # Start local development server
npm run build      # Build production app
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # Run TypeScript without emitting files
```

## Supabase Setup

This app expects a Supabase project with the schema and policies in `supabase/migrations`.

Key tables include:

- `units`
- `unit_compartments`
- `unit_compartment_items`
- `equipment_catalog`
- `compartment_checks`
- `personnel_signatures`
- `users`
- `user_roles`

Admin server actions use `SUPABASE_SERVICE_ROLE_KEY`, so keep that key server-only.

## Access Model

- Crew unit selection and compartment checkoffs are public.
- Admin routes require Supabase authentication and `admin` role in `user_roles`.
- Personnel sign-off requires authentication so signatures can be tied to a known user.
- Admin-created users are email-confirmed and default to `user` role.

## QR Codes

Admins can generate QR codes from a unit detail page:

```text
/admin/units/{unit-id}/qr
```

The QR page supports:

- Expand/collapse sections for large unit layouts.
- Printing all QR codes for a unit.
- Printing an individual compartment QR code.

## Deployment Notes

- Configure the same environment variables in your hosting provider.
- `NEXT_PUBLIC_APP_URL` should match the deployed application URL so QR codes point to the correct host.
- Keep Supabase service role keys out of client code and public repositories.

## License

Private operational project unless a license is added.
