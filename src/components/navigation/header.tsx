"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/context/SidebarContext";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import {
  MenuToggleIcon,
  SearchIcon,
  BellIcon,
  ChevronDownIcon,
  UserCircleIcon,
  PlugInIcon,
  CloseIcon,
  CheckCircleIcon,
} from "@/components/icons/tailadmin-icons";

export function Header() {
  const { toggleSidebar, toggleMobileSidebar, isMobileOpen } = useSidebar();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("admin@pusakakeluarga.id");
  const [userName, setUserName] = useState<string>("Taufik Hidayat");
  const [userRole, setUserRole] = useState<string>("Ketua Trah");

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load active user info from Supabase client
  useEffect(() => {
    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserEmail(user.email || "keluarga@pusakakeluarga.id");
          const fullName = user.user_metadata?.full_name;
          if (fullName) setUserName(fullName);
        }
      } catch (err) {
        console.error("Failed to load user profile in header:", err);
      }
    }
    loadUser();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (typeof window !== "undefined" && window.innerWidth >= 1280) {
      toggleSidebar();
    } else {
      toggleMobileSidebar();
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 flex w-full border-b border-gray-200 bg-white">
      <div className="flex grow items-center justify-between px-4 py-3.5 sm:px-6 md:py-4">
        {/* Left Section: Sidebar Toggle & Search with TailAdmin icons */}
        <div className="flex items-center gap-3 sm:gap-4 flex-1">
          <button
            onClick={handleToggle}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
            aria-label="Toggle Sidebar"
          >
            {isMobileOpen ? (
              <CloseIcon className="h-5 w-5 text-gray-500" />
            ) : (
              <MenuToggleIcon className="h-4 w-3.5 text-gray-500" />
            )}
          </button>

          {/* Search Bar - TailAdmin 2.4 Style */}
          <div className="hidden sm:block relative max-w-md w-full">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Cari anggota, trah, dokumen bukti..."
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2.5 pl-11 pr-14 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:bg-white focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 transition"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-2.5">
              <span className="inline-flex items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs text-gray-500">
                ⌘ K
              </span>
            </div>
          </div>
        </div>

        {/* Right Section: Trah Selector, Notification, User Dropdown */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Active Trah Pill */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3.5 py-1 text-xs font-medium text-brand-600">
            <span className="h-2 w-2 rounded-full bg-brand-500 animate-pulse" />
            <span>Trah Kartowidjojo</span>
          </div>

          {/* Notification Dropdown with TailAdmin Icon */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Notifikasi"
            >
              <BellIcon className="h-5 w-5 text-gray-500" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error-500 text-[10px] font-bold text-white ring-2 ring-white">
                2
              </span>
            </button>

            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-gray-200 bg-white p-4 shadow-theme-lg">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <h4 className="text-sm font-semibold text-gray-900">
                    Notifikasi Trah
                  </h4>
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-600">
                    2 Baru
                  </span>
                </div>
                <div className="mt-3 space-y-2.5">
                  <Link
                    href="/kontribusi"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="block rounded-lg p-2.5 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-warning-50 text-warning-600">
                        <CheckCircleIcon className="h-4 w-4 text-warning-600" />
                      </span>
                      <div>
                        <p className="text-xs font-medium text-gray-800">
                          Usulan perubahan data Mas Bambang
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Menunggu review pengurus • 10 menit lalu
                        </p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/sumber"
                    onClick={() => setNotifDropdownOpen(false)}
                    className="block rounded-lg p-2.5 hover:bg-gray-50 transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600">
                        <CheckCircleIcon className="h-4 w-4 text-success-600" />
                      </span>
                      <div>
                        <p className="text-xs font-medium text-gray-800">
                          Dokumen Akta Kelahiran diverifikasi
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Oleh Admin Trah • 1 jam lalu
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Dropdown - TailAdmin 2.4 Style */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2.5 rounded-lg py-1 px-1.5 hover:bg-gray-50 transition"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white font-semibold text-sm shadow-theme-xs">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-sm font-medium text-gray-800 leading-tight">
                  {userName}
                </span>
                <span className="block text-xs text-gray-500 leading-tight">
                  {userRole}
                </span>
              </div>
              <ChevronDownIcon
                className={cn(
                  "h-5 w-5 text-gray-400 transition-transform duration-200",
                  userDropdownOpen ? "rotate-180" : ""
                )}
              />
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg">
                <div className="px-2 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {userEmail}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-medium text-brand-600">
                    <CheckCircleIcon className="h-3 w-3" />
                    {userRole}
                  </span>
                </div>

                <div className="py-2 space-y-0.5">
                  <Link
                    href="/pengaturan"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                    <UserCircleIcon className="h-5 w-5 text-gray-500" />
                    Profil Saya
                  </Link>
                  <Link
                    href="/pengaturan"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                  >
                    <PlugInIcon className="h-5 w-5 text-gray-500" />
                    Pengaturan Trah
                  </Link>
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-error-600 hover:bg-error-50 transition"
                  >
                    <CloseIcon className="h-5 w-5 text-error-500" />
                    Keluar (Sign Out)
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
