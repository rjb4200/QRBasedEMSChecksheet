alter table public.daily_unit_comments
  add constraint daily_unit_comments_comment_length check (char_length(comment) <= 2000);
