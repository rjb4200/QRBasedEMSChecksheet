ALTER TABLE admin_users
ADD COLUMN pushover_shift_1 boolean NOT NULL DEFAULT false,
ADD COLUMN pushover_shift_2 boolean NOT NULL DEFAULT false,
ADD COLUMN pushover_shift_3 boolean NOT NULL DEFAULT false;
