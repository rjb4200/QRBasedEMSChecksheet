ALTER TABLE public.admin_users ADD COLUMN IF NOT EXISTS receives_weekly_issues_digest boolean NOT NULL DEFAULT true;

CREATE TABLE IF NOT EXISTS public.weekly_email_report_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_week_start date NOT NULL UNIQUE,
  sent_at timestamptz NOT NULL DEFAULT now(),
  recipient_count integer NOT NULL DEFAULT 0,
  status text NOT NULL,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
