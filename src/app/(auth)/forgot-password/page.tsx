"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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

        {submitted ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <MailCheck className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
              Tautan pemulihan kata sandi telah dikirimkan ke <strong>{email}</strong>. Silakan periksa kotak masuk email Anda.
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
              className="w-full py-3 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white font-bold shadow transition-all text-xs"
            >
              Kirim Tautan Pemulihan
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

