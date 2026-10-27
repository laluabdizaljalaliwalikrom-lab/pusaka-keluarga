"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserPlus, AlertCircle, CheckCircle2, User, Users, Mail, Lock } from "lucide-react";
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
          setErrorMessage("Kata sandi minimal 6 karakter.");
        } else {
          setErrorMessage(error.message);
        }
        setLoading(false);
        return;
      }

      if (data.session && data.user) {
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
            // Abaikan jika trigger/RLS sudah menangani
          }
        }

        router.push("/dashboard");
        router.refresh();
      } else if (data.user && !data.session) {
        setSuccessMessage(
          `Pendaftaran berhasil! Tautan konfirmasi telah dikirimkan ke ${email}. Silakan verifikasi email Anda untuk mengaktifkan akun.`
        );
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Terjadi kesalahan saat pendaftaran akun.");
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
            Pendaftaran Trah Keluarga
          </h1>
          <p className="text-xs text-slate-500">
            Mulai bangun dan dokumentasikan silsilah keluarga besar secara kolaboratif
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2.5 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage ? (
          <div className="p-5 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
            <p className="text-xs font-semibold text-emerald-900 leading-relaxed">
              {successMessage}
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-xs"
            >
              Ke Halaman Masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Nama Lengkap Anda</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Bambang Soedirjo"
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Nama Trah / Keluarga Besar</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="Contoh: Bani Kartosoedirjo, Trah Sastrodiningrat"
                  className="w-full rounded-lg border border-stroke bg-transparent py-2.5 pl-10 pr-4 text-xs text-slate-800 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
                <Users className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

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
              <label className="block font-medium text-slate-700 mb-1.5">Kata Sandi</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
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
              <UserPlus className="w-4 h-4" />
              <span>{loading ? "Mendaftarkan..." : "Daftarkan Trah Keluarga"}</span>
            </button>
          </form>
        )}

        <div className="pt-4 border-t border-stroke text-center text-xs text-slate-500">
          Sudah memiliki akun terdaftar?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    </div>
  );
}
