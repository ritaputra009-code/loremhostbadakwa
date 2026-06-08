export type DbUser = {
  id?: number | string;
  username: string;
  password: string;
  is_active?: boolean;
  is_vip?: boolean;
  duration_days?: number;
  expires_at?: string | null;
  created_at?: string | null;

  isActive?: boolean;
  isVip?: boolean;
  durationDays?: number;
  expiresAt?: string | null;
  createdAt?: string | null;
};

function toIso(value?: string | null) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toISOString();
}

export function mapForApk(user: DbUser) {
  return {
    username: user.username,
    password: user.password,
    isActive: Boolean(user.is_active ?? user.isActive ?? true),
    isVip: Boolean(user.is_vip ?? user.isVip ?? false),
    durationDays: Number(user.duration_days ?? user.durationDays ?? 30),
    expiresAt: toIso(user.expires_at ?? user.expiresAt ?? null),
    createdAt: toIso(user.created_at ?? user.createdAt ?? null),
  };
}
