"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import {
  GridIcon,
  GroupIcon,
  CalenderIcon,
  DocsIcon,
  TaskIcon,
  UserCircleIcon,
  PlugInIcon,
  HorizontaLDots,
  CheckCircleIcon,
  BoxCubeIcon,
} from "@/components/icons/tailadmin-icons";

type MenuItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: "brand" | "success" | "warning";
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

const MENU_GROUPS: MenuGroup[] = [
  {
    title: "MENU UTAMA",
    items: [
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: GridIcon,
      },
      {
        name: "Pohon Silsilah",
        href: "/pohon",
        icon: BoxCubeIcon,
        badge: "Canvas",
        badgeType: "brand",
      },
      {
        name: "Direktori Anggota",
        href: "/direktori",
        icon: GroupIcon,
      },
      {
        name: "Sumber & Bukti",
        href: "/sumber",
        icon: DocsIcon,
      },
    ],
  },
  {
    title: "PENGELOLAAN TRAH",
    items: [
      {
        name: "Review Usulan",
        href: "/kontribusi",
        icon: TaskIcon,
        badge: "2",
        badgeType: "warning",
      },
      {
        name: "Anggota Keluarga",
        href: "/anggota",
        icon: UserCircleIcon,
      },
      {
        name: "Pengaturan Trah",
        href: "/pengaturan",
        icon: PlugInIcon,
      },
    ],
  },
];

export function Sidebar() {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(path);
  };

  const showFull = isExpanded || isHovered || isMobileOpen;

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 flex h-full flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-900",
        showFull ? "w-72.5" : "w-22.5",
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        "xl:translate-x-0"
      )}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Brand Header */}
      <div
        className={cn(
          "flex py-7 items-center border-b border-gray-100",
          !showFull ? "xl:justify-center" : "justify-start"
        )}
      >
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white font-bold shadow-theme-xs transition-transform group-hover:scale-105">
            <span className="text-base font-bold tracking-tight">PK</span>
          </div>
          {showFull && (
            <div className="flex flex-col">
              <span className="text-base font-bold text-gray-900 leading-tight">
                Pusaka Keluarga
              </span>
              <span className="text-xs text-gray-500 font-normal">
                Trah Silsilah Digital
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links with authentic TailAdmin Icons */}
      <div className="no-scrollbar flex flex-col flex-1 overflow-y-auto py-5 duration-300 ease-linear">
        <nav className="space-y-6">
          {MENU_GROUPS.map((group, groupIdx) => (
            <div key={groupIdx}>
              <h2
                className={cn(
                  "mb-3 flex text-xs font-semibold leading-5 text-gray-400 uppercase tracking-wider",
                  !showFull ? "xl:justify-center" : "justify-start"
                )}
              >
                {showFull ? (
                  group.title
                ) : (
                  <HorizontaLDots className="h-5 w-5 text-gray-400" />
                )}
              </h2>

              <ul className="flex flex-col gap-1.5">
                {group.items.map((item) => {
                  const active = isActive(item.href);
                  const Icon = item.icon;

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group menu-item",
                          active ? "menu-item-active" : "menu-item-inactive",
                          !showFull ? "xl:justify-center" : "justify-start"
                        )}
                        title={!showFull ? item.name : undefined}
                      >
                        <span
                          className={cn(
                            "shrink-0",
                            active
                              ? "menu-item-icon-active"
                              : "menu-item-icon-inactive"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        {showFull && (
                          <span className="flex-1 truncate text-sm font-medium">{item.name}</span>
                        )}

                        {showFull && item.badge && (
                          <span
                            className={cn(
                              "ms-auto rounded-full px-2 py-0.5 text-xs font-semibold uppercase",
                              item.badgeType === "warning"
                                ? "bg-warning-50 text-warning-600"
                                : item.badgeType === "success"
                                ? "bg-success-50 text-success-600"
                                : "bg-brand-50 text-brand-500"
                            )}
                          >
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Widget (TailAdmin Style) */}
        {showFull && (
          <div className="mt-auto pt-6">
            <div className="rounded-2xl border border-gray-200 bg-gray-50/75 p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-500 text-white">
                  <CheckCircleIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-semibold text-gray-800">
                  Trah Aktif
                </span>
              </div>
              <p className="text-xs font-medium text-gray-900 truncate">
                Kartowidjojo Mangunjayan
              </p>
              <div className="mt-3 flex items-center justify-between text-[11px] text-gray-500">
                <span className="inline-flex items-center gap-1 text-success-600 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
                  3 Generasi
                </span>
                <span className="text-gray-400">Verifikasi 100%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
