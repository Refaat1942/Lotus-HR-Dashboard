"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { UserRole } from "@/lib/types";
import { Users, Plus, Trash2, Shield } from "lucide-react";

interface UserItem {
  id: string;
  username: string;
  role: UserRole;
  nameAr: string;
  nameEn: string;
  createdAt: string;
}

interface UsersManagerProps {
  initialUsers: UserItem[];
}

export function UsersManager({ initialUsers }: UsersManagerProps) {
  const { t, locale } = useLanguage();
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "hr" as UserRole,
    nameAr: "",
    nameEn: "",
  });
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const data = await res.json();
      setUsers([data.user, ...users]);
      setForm({ username: "", password: "", role: "hr", nameAr: "", nameEn: "" });
      setShowForm(false);
    } else {
      const data = await res.json();
      setError(data.error || "Error");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    const res = await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    }
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    hr: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("users")}</h2>
          <p className="text-gray-500 mt-1">{users.length} {t("users").toLowerCase()}</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-lotus">
          <Plus className="h-4 w-4" />
          {t("createUser")}
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-scale-in">
          <h3 className="text-lg font-semibold text-lotus-green mb-4">{t("createUser")}</h3>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("username")}</label>
              <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("password")}</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("nameAr")}</label>
              <input type="text" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("nameEn")}</label>
              <input type="text" value={form.nameEn} onChange={(e) => setForm({ ...form, nameEn: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("role")}</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} className="select-field">
                <option value="admin">{t("admin")}</option>
                <option value="hr">{t("hr")}</option>
                <option value="viewer">{t("viewer")}</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="btn-lotus">{t("save")}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-lotus-outline">{t("cancel")}</button>
            </div>
          </form>
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("noUsers")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user, i) => (
            <div
              key={user.id}
              className={`flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm animate-slide-up stagger-${Math.min(i + 1, 6)}`}
              style={{ opacity: 0 }}
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lotus-green/10">
                  <Shield className="h-5 w-5 text-lotus-green" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{locale === "ar" ? user.nameAr || user.username : user.nameEn || user.username}</p>
                  <p className="text-sm text-gray-500">{user.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[user.role]}`}>
                  {t(user.role as "admin" | "hr" | "viewer")}
                </span>
                {user.username !== "admin" && (
                  <button onClick={() => handleDelete(user.id)} className="rounded-lg p-2 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
