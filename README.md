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
- Daily email delivery with Resend

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
| `RESEND_API_KEY` | Secret | Server-only Resend API key for daily reports. |
| `RESEND_FROM_EMAIL` | Variable | Verified sender address for daily reports. |
| `DAILY_REPORT_TIMEZONE` | Variable | Timezone for the daily report, usually `America/New_York`. |
| `CRON_SECRET` | Secret | Bearer token required by the daily report cron endpoint. |
| `DAILY_REPORT_SEND_HOUR` | Variable | Local 24-hour clock hour for automatic daily reports. Defaults to `10`. |

Optional variables:

| Name | Cloudflare Type | Notes |
| --- | --- | --- |
| `DAILY_REPORT_REPLY_TO` | Variable | Optional reply-to address for daily reports. |
| `DAILY_REPORT_SUBJECT_PREFIX` | Variable | Optional subject prefix, such as `[Test]`. |

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
- Configure the scheduler to call `/api/cron/daily-email-report` daily at 1000 with `Authorization: Bearer {CRON_SECRET}`.

## Daily Email Reports

The app owns daily report delivery through Resend. Reports are sent to admin users with a valid email address and `receives_daily_report` enabled on the Admin Users page.

Daily reports include:

- Unchecked in-service units
- Submitted exceptions
- A PDF attachment with all unit check sheets for the report date

### Resend Setup

1. Create a Resend account.
2. Verify the sending domain in Resend.
3. Add the required DNS records for domain verification, SPF, and DKIM.
4. Create a production API key.
5. Add `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DAILY_REPORT_TIMEZONE`, `DAILY_REPORT_SEND_HOUR`, and `CRON_SECRET` to production environment variables.
6. Add report recipient emails on `/admin/users`.

### Manual Cron Test

Use a protected request to test the daily report endpoint:

```bash
curl -X POST https://your-app-domain.com/api/cron/daily-email-report \
  -H "Authorization: Bearer $CRON_SECRET"
```

Add `?force=true` only for authorized manual re-sends after a successful run.

### Scheduler Setup

Configure your host to call the cron endpoint. The endpoint sends only during `DAILY_REPORT_SEND_HOUR` in `DAILY_REPORT_TIMEZONE` for scheduled `GET` requests, so an hourly scheduler is safe and handles daylight saving time changes.

For Vercel Cron, add a cron entry similar to:

```json
{
  "crons": [
    { "path": "/api/cron/daily-email-report", "schedule": "0 * * * *" }
  ]
}
```

For Cloudflare Workers Cron Triggers, use:

```text
0 * * * *
```

The scheduled caller must send `Authorization: Bearer {CRON_SECRET}`. If the platform cannot attach headers directly, use a small scheduled worker or job wrapper that calls the app endpoint with the header.

### Cloudflare Deployment

Set these in Cloudflare Pages or Workers before deploying:

- Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_APP_URL`, `RESEND_FROM_EMAIL`, `DAILY_REPORT_TIMEZONE`
- Secrets: `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `CRON_SECRET`

For Cloudflare Pages, use **Settings > Environment variables** and add values for both **Production** and **Preview** as needed.

If using Wrangler, set the service role key as a secret:

```bash
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put RESEND_API_KEY
wrangler secret put CRON_SECRET
```

Then configure the public variables in your Cloudflare project settings. Do not put `SUPABASE_SERVICE_ROLE_KEY` in `NEXT_PUBLIC_*` variables.

## License

Private operational project unless a license is added.
