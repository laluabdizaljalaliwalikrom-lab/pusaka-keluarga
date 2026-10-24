"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const origin = typeof window !== "undefined" ? window.location.origin : "";
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${origin}/login`,
      });

      if (error) {
        setErrorMessage(error.message);
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat meminta pemulihan sandi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-pusaka-50 via-background to-background">
      <div className="max-w-md w-full bg-white rounded-3xl border border-pusaka-200/80 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight">
            Pemulihan Kata Sandi
          </h1>
          <p className="text-xs text-pusaka-600">
            Masukkan email akun Anda untuk menerima tautan pemulihan
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <MailCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
              Tautan pemulihan kata sandi telah dikirimkan ke <strong>{email}</strong>. Silakan periksa kotak masuk atau spam email Anda.
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 text-xs font-bold text-emerald-800 hover:underline"
            >
              Kembali ke Halaman Masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-pusaka-900 mb-1">Alamat Email Terdaftar</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white font-bold shadow transition-all text-xs disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Mengirim Tautan..." : "Kirim Tautan Pemulihan"}
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-pusaka-100 text-center">
          <Link
            href="/login"
            className="inline-flex items-center space-x-1.5 text-xs text-pusaka-700 hover:text-pusaka-900 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Masuk</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
