CREATE INDEX IF NOT EXISTS idx_issue_notes_issue_id_created_at ON public.issue_notes (issue_id, created_at);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues (status);
CREATE INDEX IF NOT EXISTS idx_issues_created_at ON public.issues (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_unit_id ON public.issues (unit_id);
