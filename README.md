# QR-Based EMS Checksheet

Mobile-first EMS vehicle checkoff application for QR-based compartment inspections, fleet readiness tracking, and admin-managed unit/equipment configuration.

## Features

- Public crew checkoff workflow at `/units` with no login required.
- QR codes route directly to compartment checkoff forms.
- Admin dashboard for fleet status, records, units, equipment, and QR printing.
- Unit layouts can be created from scratch or copied from existing units.
- Equipment catalog with reusable items, input types, categories, and par levels.
- Full-sheet and individual QR code printing.
- Supabase-backed PostgreSQL database, Auth, Storage, and Row Level Security.
- Username/password admin login with supervisor access support through Supabase Auth roles.
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

Copy `.env.example` to `.env.local` in the project root and fill in the values:

```bash
cp .env.example .env.local
```

Do not commit `.env`, `.env.local`, service role keys, or generated credentials.

Required variables:

| Name | Cloudflare Type | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Variable | Public Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Variable | Public anon or publishable Supabase key. |
| `NEXT_PUBLIC_APP_URL` | Variable | Deployed app URL; QR codes use this value. |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret | Server-only key for admin actions and public checkoff writes. |
| `N8N_BASE_URL` | Variable or Secret | Optional n8n endpoint if alerts are enabled. |

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
- `users`
- `user_roles`

Admin server actions use `SUPABASE_SERVICE_ROLE_KEY`, so keep that key server-only.

## Access Model

- Crew unit selection and compartment checkoffs are public.
- Admin routes require the configured username/password admin session.
- Supervisor routes use Supabase authentication and `supervisor` role in `user_roles`.

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

### Cloudflare Deployment

Set these in Cloudflare Pages or Workers before deploying:

- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `N8N_BASE_URL`
- Secrets: `SUPABASE_SERVICE_ROLE_KEY`

For Cloudflare Pages, use **Settings > Environment variables** and add values for both **Production** and **Preview** as needed.

If using Wrangler, set the service role key as a secret:

```bash
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
```

Then configure the public variables in your Cloudflare project settings. Do not put `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` variables.

## License

Private operational project unless a license is added.
