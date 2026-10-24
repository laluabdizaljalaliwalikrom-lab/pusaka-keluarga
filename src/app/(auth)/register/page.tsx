"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("user already registered")) {
          setErrorMessage("Alamat email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.");
        } else if (error.message.toLowerCase().includes("password")) {
          setErrorMessage("Kata sandi terlalu pendek atau tidak memenuhi syarat (minimal 6 karakter).");
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.session && data.user) {
        // Jika auto-confirm aktif dan session langsung terbentuk
        if (familyName.trim()) {
          try {
            const { data: family } = await supabase
              .from("families")
              .insert({
                name: familyName.trim(),
                description: `Silsilah keluarga besar ${familyName.trim()}`,
                created_by: data.user.id,
              })
              .select()
              .single();

            if (family) {
              await supabase.from("family_memberships").insert({
                family_id: family.id,
                profile_id: data.user.id,
                role: "owner",
                status: "active",
              });
            }
          } catch {
            // Abaikan jika trigger/RLS sudah mengurus keanggotaan
          }
        }

        router.push("/dashboard");
        router.refresh();
      } else if (data.user && !data.session) {
        // Supabase mengaktifkan verifikasi email
        setSuccessMessage(
          `Pendaftaran berhasil! Tautan konfirmasi telah dikirimkan ke ${email}. Silakan periksa kotak masuk atau spam email Anda untuk mengaktifkan akun.`
        );
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat pendaftaran akun.");
      setLoading(false);
    }
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

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start space-x-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
              {successMessage}
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm"
            >
              Ke Halaman Masuk
            </Link>
          </div>
        ) : (
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white font-bold shadow transition-all flex items-center justify-center space-x-2 text-xs disabled:opacity-60 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? "Mendaftarkan..." : "Daftarkan Trah Keluarga"}</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-pusaka-100 text-center text-xs text-pusaka-600">
          Sudah memiliki akun terdaftar?{" "}
          <Link href="/login" className="font-bold text-pusaka-800 hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
