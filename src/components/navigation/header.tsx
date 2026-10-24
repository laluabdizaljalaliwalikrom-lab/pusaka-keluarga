"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, PlusCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>("Memuat...");
  const [userEmail, setUserEmail] = useState<string>("");
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then((res: any) => {
      const user = res?.data?.session?.user;
      if (user) {
        setUserEmail(user.email || "");
        setUserName(
          user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Pengguna"
        );
      } else {
        setUserName("Tamu");
      }
    });
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

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
              {userName}
            </span>
            <span className="text-[10px] text-pusaka-600">{userEmail}</span>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Keluar dari Akun"
            className="p-1.5 ml-1 text-pusaka-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
