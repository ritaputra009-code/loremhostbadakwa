export type DbUser = {
  id: number;
  username: string;
  password: string;
  is_active: boolean;
  is_vip: boolean;
  duration_days: number;
  expires_at: string | null;
  created_at: string;
};

export function mapForApk(u: DbUser) {
  return {
    username: u.username,
    password: u.password,
    isActive: Boolean(u.is_active),
    isVip: Boolean(u.is_vip),
    durationDays: Number(u.duration_days || 30),
    expiresAt: u.expires_at,
    createdAt: u.created_at
  };
}
