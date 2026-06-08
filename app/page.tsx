"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  username: string;
  password: string;
  is_active: boolean;
  is_vip: boolean;
  duration_days: number;
  expires_at: string | null;
  created_at: string;
};

function toInputDate(value: string | null) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function AdminPage() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [login, setLogin] = useState({ username: "admin", password: "" });
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState({ username: "", password: "", isActive: true, isVip: false, durationDays: 30, expiresAt: "" });

  async function check() {
    const res = await fetch("/api/admin/me", { cache: "no-store" });
    const json = await res.json();
    setLoggedIn(Boolean(json.ok));
    setReady(true);
    if (json.ok) loadUsers();
  }

  async function loadUsers() {
    const res = await fetch("/api/admin/users", { cache: "no-store" });
    if (!res.ok) return;
    const json = await res.json();
    setUsers(json.users || []);
  }

  useEffect(() => { check(); }, []);

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(login) });
    if (!res.ok) { setMessage("Login admin salah"); return; }
    setLoggedIn(true);
    loadUsers();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setLoggedIn(false);
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, expiresAt: form.expiresAt ? `${form.expiresAt}T00:00:00.000Z` : null })
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setMessage(json.message || "Gagal membuat user"); return; }
    setForm({ username: "", password: "", isActive: true, isVip: false, durationDays: 30, expiresAt: "" });
    setMessage("User berhasil dibuat");
    loadUsers();
  }

  async function patchUser(id: number, patch: Record<string, unknown>) {
    const res = await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (!res.ok) { setMessage("Gagal update user"); return; }
    loadUsers();
  }

  async function deleteUser(id: number) {
    if (!confirm("Hapus user ini?")) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    loadUsers();
  }

  if (!ready) return <main><div className="card"><p>Loading...</p></div></main>;

  if (!loggedIn) {
    return (
      <main>
        <div className="card" style={{ maxWidth: 430, margin: "70px auto" }}>
          <h1>Lrmhstzz Admin</h1>
          <p>Login untuk membuat akun APK.</p>
          {message && <div className="notice err">{message}</div>}
          <form onSubmit={doLogin}>
            <label>Username admin</label>
            <input value={login.username} onChange={(e) => setLogin({ ...login, username: e.target.value })} />
            <label>Password admin</label>
            <input type="password" value={login.password} onChange={(e) => setLogin({ ...login, password: e.target.value })} />
            <button type="submit">Login</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main>
      <div className="header">
        <div>
          <h1>Lrmhstzz Admin</h1>
          <p>Endpoint APK: /osea/datauser.json</p>
        </div>
        <button className="secondary" onClick={logout}>Logout</button>
      </div>

      {message && <div className={`notice ${message.includes("Gagal") ? "err" : ""}`}>{message}</div>}

      <div className="card" style={{ marginBottom: 18 }}>
        <h2>Create Akun</h2>
        <form onSubmit={createUser} className="grid">
          <div><label>Username</label><input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required /></div>
          <div><label>Password</label><input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></div>
          <div><label>Aktif</label><select value={String(form.isActive)} onChange={(e) => setForm({ ...form, isActive: e.target.value === "true" })}><option value="true">Aktif</option><option value="false">Nonaktif</option></select></div>
          <div><label>VIP</label><select value={String(form.isVip)} onChange={(e) => setForm({ ...form, isVip: e.target.value === "true" })}><option value="false">Free</option><option value="true">VIP</option></select></div>
          <div><label>Durasi hari</label><input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })} /></div>
          <div><label>Expired</label><input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} /></div>
          <div><button type="submit">Buat Akun</button></div>
        </form>
      </div>

      <div className="card">
        <h2>Data User</h2>
        <div className="row head"><div>Username</div><div>Password</div><div>Aktif</div><div>VIP</div><div>Durasi</div><div>Expired</div><div>Aksi</div></div>
        {users.map((u) => (
          <div className="row" key={u.id}>
            <input defaultValue={u.username} onBlur={(e) => e.target.value !== u.username && patchUser(u.id, { username: e.target.value })} />
            <input defaultValue={u.password} onBlur={(e) => e.target.value !== u.password && patchUser(u.id, { password: e.target.value })} />
            <button className={u.is_active ? "ok" : "danger"} onClick={() => patchUser(u.id, { isActive: !u.is_active })}>{u.is_active ? "Aktif" : "Off"}</button>
            <button className={u.is_vip ? "ok" : "secondary"} onClick={() => patchUser(u.id, { isVip: !u.is_vip })}>{u.is_vip ? "VIP" : "Free"}</button>
            <input type="number" defaultValue={u.duration_days} onBlur={(e) => patchUser(u.id, { durationDays: Number(e.target.value || 30) })} />
            <input type="date" defaultValue={toInputDate(u.expires_at)} onBlur={(e) => patchUser(u.id, { expiresAt: e.target.value ? `${e.target.value}T00:00:00.000Z` : null })} />
            <div className="actions"><button className="danger" onClick={() => deleteUser(u.id)}>Hapus</button></div>
          </div>
        ))}
        {!users.length && <p>Belum ada user.</p>}
      </div>
    </main>
  );
}
