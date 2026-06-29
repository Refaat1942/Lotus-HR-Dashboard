"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import type { UserRole, Permission } from "@/lib/types";
import { PERMISSION_GROUPS, ROLE_PERMISSIONS } from "@/lib/constants";
import { Users, Plus, Trash2, Shield, Pencil } from "lucide-react";

interface UserItem {
  id: string;
  username: string;
  role: UserRole;
  nameAr: string;
  nameEn: string;
  customPermissions: Permission[] | null;
  createdAt: string;
}

interface UsersManagerProps {
  initialUsers: UserItem[];
}

export function UsersManager({ initialUsers }: UsersManagerProps) {
  const { t, locale } = useLanguage();
  const [users, setUsers] = useState(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "hr" as UserRole,
    nameAr: "",
    nameEn: "",
    customPermissions: null as Permission[] | null,
    useCustomPermissions: false,
  });
  const [error, setError] = useState("");

  function resetForm() {
    setForm({
      username: "",
      password: "",
      role: "hr",
      nameAr: "",
      nameEn: "",
      customPermissions: null,
      useCustomPermissions: false,
    });
  }

  function openEdit(user: UserItem) {
    setEditingUser(user);
    setForm({
      username: user.username,
      password: "",
      role: user.role,
      nameAr: user.nameAr,
      nameEn: user.nameEn,
      customPermissions: user.customPermissions,
      useCustomPermissions: !!(user.customPermissions && user.customPermissions.length > 0),
    });
    setShowForm(false);
    setError("");
  }

  function closeEdit() {
    setEditingUser(null);
    resetForm();
    setError("");
  }

  function togglePermission(perm: Permission) {
    const current = form.useCustomPermissions
      ? form.customPermissions || []
      : [...ROLE_PERMISSIONS[form.role]] as Permission[];

    const next = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];

    setForm({
      ...form,
      useCustomPermissions: true,
      customPermissions: next,
    });
  }

  function applyRoleDefaults(role: UserRole) {
    setForm({
      ...form,
      role,
      useCustomPermissions: false,
      customPermissions: null,
    });
  }

  const activePermissions = form.useCustomPermissions
    ? form.customPermissions || []
    : ([...ROLE_PERMISSIONS[form.role]] as Permission[]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password,
        role: form.role,
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        customPermissions: form.useCustomPermissions ? form.customPermissions : null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setUsers([{ ...data.user, customPermissions: form.useCustomPermissions ? form.customPermissions : null }, ...users]);
      resetForm();
      setShowForm(false);
    } else {
      const data = await res.json();
      setError(data.error || "Error");
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    setError("");

    const res = await fetch(`/api/users/${editingUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.username,
        password: form.password || undefined,
        role: form.role,
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        customPermissions: form.useCustomPermissions ? form.customPermissions : null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setUsers(users.map((u) => (u.id === editingUser.id ? data.user : u)));
      closeEdit();
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
      if (editingUser?.id === id) closeEdit();
    }
  }

  const roleColors: Record<string, string> = {
    admin: "bg-red-100 text-red-800",
    hr: "bg-blue-100 text-blue-800",
    viewer: "bg-gray-100 text-gray-800",
  };

  function PermissionEditor() {
    return (
      <div className="md:col-span-2 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">{t("permissions")}</label>
          <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
            <input
              type="checkbox"
              checked={form.useCustomPermissions}
              onChange={(e) =>
                setForm({
                  ...form,
                  useCustomPermissions: e.target.checked,
                  customPermissions: e.target.checked
                    ? ([...ROLE_PERMISSIONS[form.role]] as Permission[])
                    : null,
                })
              }
              className="accent-lotus-green"
            />
            {t("customPermissions")}
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.id} className="rounded-lg border border-gray-200 p-3">
              <p className="text-xs font-semibold text-lotus-green mb-2">{t(group.labelKey as "candidates")}</p>
              <div className="space-y-1.5">
                {group.permissions.map((perm) => (
                  <label key={perm.id} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activePermissions.includes(perm.id)}
                      onChange={() => togglePermission(perm.id)}
                      disabled={!form.useCustomPermissions}
                      className="accent-lotus-green"
                    />
                    <span className="text-gray-700">{t(perm.labelKey as "permViewCandidates")}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function UserForm({ onSubmit, submitLabel }: { onSubmit: (e: React.FormEvent) => void; submitLabel: string }) {
    return (
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("username")}</label>
          <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="input-field" required />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {editingUser ? t("newPassword") : t("password")}
            {editingUser && <span className="text-gray-400 text-xs ms-1">({t("optional")})</span>}
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            required={!editingUser}
          />
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
          <select
            value={form.role}
            onChange={(e) => applyRoleDefaults(e.target.value as UserRole)}
            className="select-field"
            disabled={editingUser?.username === "admin"}
          >
            <option value="admin">{t("admin")}</option>
            <option value="hr">{t("hr")}</option>
            <option value="viewer">{t("viewer")}</option>
          </select>
        </div>
        <PermissionEditor />
        <div className="md:col-span-2 flex items-center gap-2">
          <button type="submit" className="btn-lotus">{submitLabel}</button>
          <button type="button" onClick={editingUser ? closeEdit : () => { setShowForm(false); resetForm(); }} className="btn-lotus-outline">
            {t("cancel")}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("users")}</h2>
          <p className="text-gray-500 mt-1">{users.length} {t("users").toLowerCase()}</p>
        </div>
        {!editingUser && (
          <button onClick={() => { setShowForm(!showForm); closeEdit(); }} className="btn-lotus">
            <Plus className="h-4 w-4" />
            {t("createUser")}
          </button>
        )}
      </div>

      {(showForm || editingUser) && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-lotus-green mb-4 flex items-center gap-2">
            {editingUser ? <Pencil className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            {editingUser ? t("editUser") : t("createUser")}
          </h3>
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
          <UserForm
            onSubmit={editingUser ? handleUpdate : handleCreate}
            submitLabel={editingUser ? t("save") : t("createUser")}
          />
        </div>
      )}

      {users.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-white p-12 text-center">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("noUsers")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lotus-green/10">
                  <Shield className="h-5 w-5 text-lotus-green" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{locale === "ar" ? user.nameAr || user.username : user.nameEn || user.username}</p>
                  <p className="text-sm text-gray-500">{user.username}</p>
                  {user.customPermissions && (
                    <p className="text-xs text-lotus-lime mt-0.5">{t("customPermissions")}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${roleColors[user.role]}`}>
                  {t(user.role as "admin" | "hr" | "viewer")}
                </span>
                <button onClick={() => openEdit(user)} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-lotus-green transition-colors">
                  <Pencil className="h-4 w-4" />
                </button>
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
