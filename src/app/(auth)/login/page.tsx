"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, LogIn } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pusaka-50 via-background to-background">
      <div className="max-w-md w-full bg-white rounded-3xl border border-pusaka-200/80 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-pusaka-800 text-white font-bold text-xl flex items-center justify-center mx-auto shadow-sm">
            PK
          </div>
          <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight">
            Masuk ke Pusaka Keluarga
          </h1>
          <p className="text-xs text-pusaka-600">
            Akses silsilah trah dan arsip keluarga besar Anda
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-pusaka-900 mb-1">Alamat Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-semibold text-pusaka-900">Kata Sandi</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-pusaka-600 hover:text-pusaka-900 underline"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white font-bold shadow transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Memproses..." : "Masuk ke Silsilah"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-pusaka-100 text-center text-xs text-pusaka-600">
          Belum terdaftar dalam ruang keluarga?{" "}
          <Link href="/register" className="font-bold text-pusaka-800 hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

