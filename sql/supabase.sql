CREATE TABLE IF NOT EXISTS app_users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_vip BOOLEAN NOT NULL DEFAULT false,
  duration_days INTEGER NOT NULL DEFAULT 30,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_app_users_username ON app_users (username);

INSERT INTO app_users
(username, password, is_active, is_vip, duration_days, expires_at, created_at)
VALUES
('gioperm88', '3180bot', true, false, 30, '2026-06-04T00:00:00.000Z', '2026-05-05T00:00:00.000Z')
ON CONFLICT (username) DO NOTHING;
