"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GitFork,
  Users,
  ShieldAlert,
  Settings,
  LayoutDashboard,
  FolderArchive,
  UserCheck,
  X,
  Shield,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const MENU_GROUPS = [
  {
    title: "MENU UTAMA",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        name: "Pohon Silsilah",
        href: "/pohon",
        icon: GitFork,
      },
      {
        name: "Direktori Individu",
        href: "/direktori",
        icon: Users,
      },
      {
        name: "Sumber & Arsip",
        href: "/sumber",
        icon: FolderArchive,
      },
    ],
  },
  {
    title: "PENGELOLAAN TRAH",
    items: [
      {
        name: "Review Usulan",
        href: "/kontribusi",
        icon: ShieldAlert,
      },
      {
        name: "Anggota Keluarga",
        href: "/anggota",
        icon: UserCheck,
      },
      {
        name: "Pengaturan Trah",
        href: "/pengaturan",
        icon: Settings,
      },
    ],
  },
];

export function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-[#1C2434] duration-300 ease-linear lg:static lg:translate-x-0 shadow-lg lg:shadow-none border-r border-slate-800",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6 border-b border-slate-800/80">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white font-bold text-lg shadow-sm">
              PK
            </div>
            <div>
              <span className="block text-base font-bold text-white tracking-tight leading-tight">
                Pusaka Keluarga
              </span>
              <span className="block text-[11px] font-medium text-slate-400">
                Silsilah Lintas Generasi
              </span>
            </div>
          </Link>

          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
            className="block text-slate-400 hover:text-white lg:hidden p-1.5 rounded-lg hover:bg-[#333A48]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear flex-1 px-4 py-4">
          <nav className="space-y-6">
            {MENU_GROUPS.map((group, groupIdx) => (
              <div key={groupIdx}>
                <h3 className="mb-2.5 ml-3 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
                  {group.title}
                </h3>

                <ul className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setSidebarOpen(false)}
                          className={cn(
                            "group relative flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all duration-150",
                            isActive
                              ? "bg-[#333A48] text-white shadow-xs"
                              : "text-slate-400 hover:bg-[#333A48]/70 hover:text-white"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-5 h-5 transition-colors",
                              isActive ? "text-primary-100" : "text-slate-400 group-hover:text-white"
                            )}
                          />
                          <span>{item.name}</span>

                          {isActive && (
                            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Active Trah Status Card (TailAdmin Pro Pill) */}
        <div className="p-4 border-t border-slate-800 bg-[#161D2A]">
          <div className="rounded-xl border border-slate-700/60 p-3.5 bg-[#1C2434]/80">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Trah Aktif
              </span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Verified Trah
              </span>
            </div>
            <p className="text-xs font-bold text-white truncate">
              Bani Kartosoedirjo
            </p>
            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
              <Shield className="w-3.5 h-3.5 text-primary" />
              <span>Peran: </span>
              <strong className="text-slate-200">Family Admin</strong>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
