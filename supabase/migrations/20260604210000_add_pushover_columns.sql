ALTER TABLE admin_users
ADD COLUMN pushover_user_key text,
ADD COLUMN pushover_alert_enabled boolean NOT NULL DEFAULT false,
ADD COLUMN pushover_daily_report boolean NOT NULL DEFAULT false,
ADD COLUMN pushover_missed_checkoff boolean NOT NULL DEFAULT false,
ADD COLUMN pushover_missed_checkoff_fup boolean NOT NULL DEFAULT false;
