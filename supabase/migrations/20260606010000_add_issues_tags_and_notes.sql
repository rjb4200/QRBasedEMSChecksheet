ALTER TABLE public.issues ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.issue_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  issue_id uuid NOT NULL REFERENCES public.issues(id) ON DELETE CASCADE,
  text text NOT NULL,
  created_by text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
