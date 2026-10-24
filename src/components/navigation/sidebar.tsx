"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  GitFork,
  Users,
  FileText,
  ShieldAlert,
  Settings,
  LayoutDashboard,
  FolderArchive,
  UserCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
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
  {
    name: "Usulan & Review",
    href: "/kontribusi",
    icon: ShieldAlert,
  },
  {
    name: "Anggota Keluarga",
    href: "/anggota",
    icon: UserCheck,
  },
  {
    name: "Pengaturan",
    href: "/pengaturan",
    icon: Settings,
  },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "w-64 border-r border-pusaka-200 bg-white/95 backdrop-blur flex flex-col shrink-0 h-screen sticky top-0",
        className
      )}
    >
      {/* Brand Header */}
      <div className="p-5 border-b border-pusaka-200 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-pusaka-800 flex items-center justify-center text-white font-bold text-lg shadow-sm">
          PK
        </div>
        <div>
          <h1 className="font-bold text-base text-pusaka-900 leading-tight">Pusaka Keluarga</h1>
          <span className="text-xs text-pusaka-600 block">Silsilah Lintas Generasi</span>
        </div>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-pusaka-800 text-white shadow-sm"
                  : "text-pusaka-700 hover:bg-pusaka-100/70 hover:text-pusaka-900"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-pusaka-600")} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Trah Info Box */}
      <div className="p-4 border-t border-pusaka-200 bg-pusaka-50/50">
        <div className="rounded-xl border border-pusaka-200 p-3 bg-white">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-pusaka-600 block">
            Keluarga Aktif
          </span>
          <p className="text-sm font-bold text-pusaka-900 truncate mt-0.5">
            Bani Kartosoedirjo
          </p>
          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-medium rounded-full">
            Peran: Family Admin
          </span>
        </div>
      </div>
    </aside>
  );
}

