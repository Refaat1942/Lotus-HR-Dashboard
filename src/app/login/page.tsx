"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LotusLogo } from "@/components/LotusLogo";
import { useLanguage } from "@/components/LanguageProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError(t("loginError"));
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError(t("loginError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-lotus-green relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 start-20 h-64 w-64 rounded-full bg-lotus-lime animate-pulse-soft" />
          <div className="absolute bottom-20 end-20 h-48 w-48 rounded-full bg-lotus-lime animate-pulse-soft" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 start-1/3 h-32 w-32 rounded-full bg-white/20 animate-pulse-soft" style={{ animationDelay: "0.5s" }} />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="rounded-2xl bg-white p-6 mb-8 animate-scale-in shadow-2xl">
            <LotusLogo className="h-16" />
          </div>
          <h1 className="text-3xl font-bold mb-3 animate-slide-up">{t("appName")}</h1>
          <p className="text-lg text-white/80 text-center animate-slide-up stagger-2">{t("appSubtitle")}</p>
          <div className="mt-12 flex items-center gap-2 text-sm text-lotus-lime animate-slide-up stagger-3">
            <div className="h-2 w-2 rounded-full bg-lotus-lime animate-pulse-soft" />
            Lotus Pharmacies &copy; 2026
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4">
          <div className="rounded-lg bg-lotus-green px-1">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md animate-slide-up">
            <div className="lg:hidden flex justify-center mb-8">
              <div className="rounded-xl bg-white p-4 shadow-lg border border-gray-100">
                <LotusLogo className="h-12" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-lotus-green mb-2">{t("login")}</h2>
            <p className="text-gray-500 mb-8">{t("appSubtitle")}</p>

            {error && (
              <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700 animate-scale-in">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("username")}</label>
                <div className="relative">
                  <User className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input-field ps-10"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">{t("password")}</label>
                <div className="relative">
                  <Lock className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field ps-10"
                    required
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-lotus w-full py-3 text-base">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("login")}...
                  </span>
                ) : (
                  t("login")
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
