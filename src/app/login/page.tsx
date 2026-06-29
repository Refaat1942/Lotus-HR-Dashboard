"use client";

import { useState } from "react";
import { LotusLogo } from "@/components/LotusLogo";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Lock, User, AlertCircle, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username: username.trim(), password }),
      });

      if (!res.ok) {
        setError(t("loginError"));
        return;
      }

      // Full page navigation ensures the session cookie is sent to the server
      window.location.href = "/dashboard";
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#083f23]">
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -start-24 h-96 w-96 rounded-full bg-[#8dc63f]/10 blur-3xl" />
        <div className="absolute top-1/3 -end-32 h-80 w-80 rounded-full bg-[#8dc63f]/15 blur-3xl" />
        <div className="absolute -bottom-32 start-1/4 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      {/* Language switcher */}
      <div className="absolute top-5 end-5 z-20">
        <LanguageSwitcher />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[420px]">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-6 rounded-2xl bg-white/10 p-5 backdrop-blur-sm ring-1 ring-white/20">
              <LotusLogo variant="white" className="h-14 w-auto" width={220} height={56} />
            </div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">{t("appName")}</h1>
            <p className="mt-2 text-sm text-white/60">{t("appSubtitle")}</p>
          </div>

          {/* Login card */}
          <div className="rounded-2xl bg-white p-8 shadow-2xl shadow-black/20 ring-1 ring-white/10">
            <h2 className="mb-1 text-xl font-bold text-[#083f23]">{t("login")}</h2>
            <p className="mb-6 text-sm text-gray-500">{t("lotusPharmacies")}</p>

            {error && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t("username")}
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field input-field-icon-start"
                    placeholder={t("username")}
                    required
                    autoFocus
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  {t("password")}
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field input-field-icon-start input-field-icon-end"
                    placeholder={t("password")}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-lotus w-full py-3.5 text-base font-semibold rounded-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("login")}...
                  </span>
                ) : (
                  t("login")
                )}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-xs text-white/40">
            Lotus Pharmacies &copy; 2026
          </p>
        </div>
      </div>
    </div>
  );
}
