"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
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
            Pendaftaran Keluarga Besar
          </h1>
          <p className="text-xs text-pusaka-600">
            Mulai bangun dan dokumentasikan silsilah keluarga Anda secara kolaboratif
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-pusaka-900 mb-1">Nama Lengkap Anda</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Bambang Soedirjo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-pusaka-900 mb-1">Nama Trah / Keluarga Besar</label>
            <input
              type="text"
              required
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              placeholder="Contoh: Bani Kartosoedirjo, Trah Sastrodiningrat"
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
          </div>

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
            <label className="block font-semibold text-pusaka-900 mb-1">Kata Sandi</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white font-bold shadow transition-all flex items-center justify-center space-x-2 text-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? "Mendaftarkan..." : "Daftarkan Trah Keluarga"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-pusaka-100 text-center text-xs text-pusaka-600">
          Sudah memiliki akun?{" "}
          <Link href="/login" className="font-bold text-pusaka-800 hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}

