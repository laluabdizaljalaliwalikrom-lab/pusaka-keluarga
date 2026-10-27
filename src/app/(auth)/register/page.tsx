"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  MailLineIcon,
  LockIcon,
  UserCircleIcon,
  GroupIcon,
  CloseIcon,
  CheckCircleIcon,
} from "@/components/icons/tailadmin-icons";

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-theme-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500 text-white font-bold mx-auto shadow-theme-xs">
            <span className="text-xl font-bold tracking-tight">PK</span>
          </div>
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
            Pendaftaran Trah Keluarga
          </h1>
          <p className="text-theme-sm text-gray-500">
            Mulai bangun dan dokumentasikan silsilah keluarga besar secara kolaboratif
          </p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-error-50 border border-error-100 text-error-700 flex items-start gap-2.5 text-sm">
            <CloseIcon className="w-5 h-5 shrink-0 text-error-500 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-xl bg-success-50 border border-success-100 text-success-700 flex items-start gap-2.5 text-sm">
            <CheckCircleIcon className="w-5 h-5 shrink-0 text-success-500 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-theme-sm font-medium text-gray-700">
              Nama Lengkap Anda <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="cth. Bambang Trihatmojo"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
              <UserCircleIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-theme-sm font-medium text-gray-700">
              Nama Trah / Keluarga Besar <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="cth. Trah Kartowidjojo"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
              <GroupIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            </div>
            <p className="mt-1 text-xs text-gray-400">
              Nama trah yang akan dikelola sebagai ruang keluarga pertama Anda
            </p>
          </div>

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
            <label className="mb-1.5 block text-theme-sm font-medium text-gray-700">
              Kata Sandi <span className="text-error-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
              <LockIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 transition cursor-pointer"
          >
            <span>{loading ? "Mendaftarkan Trah..." : "Daftar & Buat Ruang Trah"}</span>
          </button>
        </form>

        <div className="pt-4 border-t border-gray-200 text-center text-theme-sm text-gray-500">
          Sudah memiliki akun trah?{" "}
          <Link href="/login" className="font-semibold text-brand-500 hover:text-brand-600">
            Masuk di Sini
          </Link>
        </div>
      </div>
    </div>
  );
}
