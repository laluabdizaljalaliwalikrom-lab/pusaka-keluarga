"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, AlertCircle, Mail, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          setErrorMessage("Email atau kata sandi salah. Silakan periksa kembali.");
        } else if (error.message.toLowerCase().includes("email not confirmed")) {
          setErrorMessage("Email Anda belum diverifikasi. Silakan periksa kotak masuk/spam email Anda.");
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat proses login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-whiten">
      <div className="max-w-md w-full bg-white rounded-xl border border-stroke p-6 sm:p-8 shadow-default space-y-6">
        <div className="text-center space-y-2">
          <div className="w-11 h-11 rounded-xl bg-primary text-white font-bold text-lg flex items-center justify-center mx-auto shadow-xs">
            PK
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
            Masuk ke Pusaka Keluarga
          </h1>
          <p className="text-xs text-slate-500">
            Akses silsilah trah dan arsip dokumen keluarga besar
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">Alamat Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-medium text-slate-700">Kata Sandi</label>
              <Link
                href="/forgot-password"
                className="text-[11px] text-primary hover:underline font-semibold"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-60 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? "Memproses Masuk..." : "Masuk ke Ruang Trah"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-stroke text-center text-xs text-slate-500">
          Belum terdaftar dalam ruang keluarga?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
