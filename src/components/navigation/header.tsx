"use client";

import Link from "next/link";
import { User, LogOut, Bell, PlusCircle } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-pusaka-200 bg-white/80 backdrop-blur sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <span className="text-sm text-pusaka-600 font-medium">Ruang Kerja Silsilah</span>
      </div>

      <div className="flex items-center space-x-3">
        <Link
          href="/individu/baru"
          className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-pusaka-800 hover:bg-pusaka-900 transition-all shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tambah Individu</span>
        </Link>

        {/* User Badge */}
        <div className="flex items-center space-x-2 pl-3 border-l border-pusaka-200">
          <div className="w-8 h-8 rounded-full bg-pusaka-200 flex items-center justify-center text-pusaka-800 font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-bold text-pusaka-900 block leading-none">
              Kuncoro Adiwijaya
            </span>
            <span className="text-[10px] text-pusaka-600">admin@pusakakeluarga.id</span>
          </div>
        </div>
      </div>
    </header>
  );
}

