"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LotusLogo } from "./LotusLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "./LanguageProvider";
import {
  LayoutDashboard,
  Users,
  UserCircle,
  Link2,
  LogOut,
  Menu,
  X,
  Settings,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import type { SessionUser } from "@/lib/types";
import { hasSessionPermission } from "@/lib/constants";

interface DashboardLayoutProps {
  user: SessionUser;
  children: React.ReactNode;
}

export function DashboardLayout({ user, children }: DashboardLayoutProps) {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { href: "/dashboard", icon: LayoutDashboard, label: t("dashboard"), show: true },
    { href: "/dashboard/candidates", icon: UserCircle, label: t("candidates"), show: hasSessionPermission(user, "view_candidates") },
    { href: "/dashboard/links", icon: Link2, label: t("inviteLinks"), show: hasSessionPermission(user, "create_links") },
    { href: "/dashboard/reports", icon: BarChart3, label: t("reports"), show: hasSessionPermission(user, "view_reports") },
    { href: "/dashboard/settings", icon: Settings, label: t("settings"), show: hasSessionPermission(user, "manage_settings") },
    { href: "/dashboard/users", icon: Users, label: t("users"), show: hasSessionPermission(user, "manage_users") },
  ];

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const displayName = locale === "ar" ? user.nameAr : user.nameEn;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 z-50 h-full w-64 bg-lotus-green transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen
            ? "translate-x-0"
            : locale === "ar"
              ? "translate-x-full lg:translate-x-0"
              : "-translate-x-full lg:translate-x-0"
        } ${locale === "ar" ? "right-0" : "left-0"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-5 border-b border-white/10">
            <div className="rounded-xl bg-white p-3 logo-animated shadow-md">
              <LotusLogo variant="official" className="h-20 w-auto" width={80} height={80} />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/70 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navItems
              .filter((item) => item.show)
              .map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-lotus-lime text-lotus-green shadow-md"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
          </nav>

          <div className="border-t border-white/10 p-4">
            <div className="mb-3 rounded-lg bg-white/10 px-4 py-3">
              <p className="text-xs text-white/60">{t("welcome")}</p>
              <p className="text-sm font-medium text-white">{displayName || user.username}</p>
              <p className="text-xs text-lotus-lime capitalize">{t(user.role as "admin" | "hr" | "viewer")}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-white/80 transition-all duration-300 hover:bg-red-500/20 hover:text-red-200"
            >
              <LogOut className="h-5 w-5" />
              {t("logout")}
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className={locale === "ar" ? "lg:mr-64" : "lg:ml-64"}>

        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-4 py-3 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-lotus-green">{t("appName")}</h1>
              <p className="text-xs text-gray-500">{t("appSubtitle")}</p>
            </div>
          </div>
          <LanguageSwitcher />
        </header>

        <main className="p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
