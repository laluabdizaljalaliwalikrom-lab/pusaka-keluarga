"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  LogOut,
  Plus,
  Menu,
  Bell,
  Search,
  ChevronDown,
  Settings,
  ShieldCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Memuat...");
  const [userEmail, setUserEmail] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then((res: any) => {
      const user = res?.data?.session?.user;
      if (user) {
        setUserEmail(user.email || "");
        setUserName(
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Kuncoro Adiwijaya"
        );
      } else {
        setUserName("Pengguna Trah");
      }
    });

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full bg-white border-b border-stroke shadow-xs">
      <div className="flex flex-grow items-center justify-between px-4 md:px-6 2xl:px-8">
        {/* Left Side: Mobile Hamburger & Search */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              setSidebarOpen(!sidebarOpen);
            }}
            className="z-50 block rounded-lg border border-stroke bg-white p-2 shadow-xs lg:hidden hover:bg-slate-50"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>

          {/* Quick Trah indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <span>Keluarga:</span>
            <span className="font-semibold text-slate-800">Bani Kartosoedirjo</span>
          </div>
        </div>

        {/* Right Side: Quick Action, Notif, User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/individu/baru"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tambah Individu</span>
          </Link>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs border border-primary/20">
                {getInitials(userName)}
              </div>
              <div className="hidden text-left md:block">
                <span className="block text-xs font-bold text-slate-800 leading-tight">
                  {userName}
                </span>
                <span className="block text-[11px] font-medium text-slate-500">
                  Family Admin
                </span>
              </div>
              <ChevronDown className="hidden md:block w-4 h-4 text-slate-400" />
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-stroke bg-white p-2 shadow-dropdown z-50">
                <div className="px-3 py-2.5 border-b border-stroke mb-1">
                  <p className="text-xs font-bold text-slate-800 truncate">{userName}</p>
                  <p className="text-[11px] text-slate-500 truncate">{userEmail || "admin@pusakakeluarga.id"}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                    Superadmin / Owner
                  </span>
                </div>

                <ul className="space-y-0.5 text-xs font-medium text-slate-700">
                  <li>
                    <Link
                      href="/pengaturan"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span>Pengaturan Akun & Trah</span>
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/kontribusi"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-lg px-3 py-2 hover:bg-slate-100 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-slate-500" />
                      <span>Review Usulan Data</span>
                    </Link>
                  </li>
                </ul>

                <div className="mt-1 pt-1 border-t border-stroke">
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{loggingOut ? "Keluar..." : "Keluar dari Akun"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
