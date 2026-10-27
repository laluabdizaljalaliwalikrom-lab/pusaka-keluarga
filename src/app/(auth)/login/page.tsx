"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MailLineIcon,
  LockIcon,
  EyeIcon,
  EyeCloseIcon,
  CloseIcon,
  ChevronLeftIcon,
} from "@/components/icons/tailadmin-icons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          setErrorMessage("Email Anda belum diverifikasi. Silakan periksa kotak masuk email Anda.");
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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-theme-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white font-bold mx-auto shadow-theme-xs">
            <span className="text-xl font-bold tracking-tight">PK</span>
          </div>
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
            Masuk ke Pusaka Keluarga
          </h1>
          <p className="text-theme-sm text-gray-500">
            Akses silsilah trah dan arsip dokumen keluarga besar
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-50 border border-error-100 text-error-700 flex items-start gap-2.5 text-sm">
            <CloseIcon className="w-5 h-5 shrink-0 text-error-500 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-theme-sm font-medium text-gray-700">
              Alamat Email <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
              <MailLineIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-theme-sm font-medium text-gray-700">
                Kata Sandi <span className="text-error-500">*</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand-500 hover:text-brand-600 font-medium"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-11 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
              <LockIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeCloseIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 transition cursor-pointer"
          >
            <span>{loading ? "Memproses Masuk..." : "Masuk ke Ruang Trah"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-gray-200 text-center text-theme-sm text-gray-500">
          Belum terdaftar dalam keluarga?{" "}
          <Link href="/register" className="font-semibold text-brand-500 hover:text-brand-600">
            Daftar Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
