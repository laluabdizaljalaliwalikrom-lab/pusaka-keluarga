"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertTriangle, ShieldCheck } from "lucide-react";
import { findPotentialDuplicates, type CandidatePerson } from "@/features/persons/duplicate-detector";

const EXISTING_PERSONS: CandidatePerson[] = [
  {
    id: "b0000000-0000-0000-0000-000000000001",
    primary_name: "Raden Mas Kartosoedirjo",
    nickname: "Mbah Karto",
    gender: "male",
    birth_date_year: 1885,
    alternate_names: ["K. R. T. Kartodiningrat", "Kartopawiro"],
  },
  {
    id: "b0000000-0000-0000-0000-000000000004",
    primary_name: "Bambang Soedirjo",
    nickname: "Bambang",
    gender: "male",
    birth_date_year: 1915,
  },
];

export default function TambahIndividuPage() {
  const router = useRouter();

  const [primaryName, setPrimaryName] = useState("");
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState("male");
  const [isLiving, setIsLiving] = useState(false);
  const [birthYear, setBirthYear] = useState<number | "">(1900);
  const [birthType, setBirthType] = useState("APPROXIMATE");
  const [birthText, setBirthText] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Live duplicate detection
  const duplicateMatches = primaryName.trim().length >= 3
    ? findPotentialDuplicates(
        {
          primary_name: primaryName,
          nickname: nickname || null,
          gender,
          birth_date_year: typeof birthYear === "number" ? birthYear : null,
        },
        EXISTING_PERSONS,
        50
      )
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/direktori");
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/direktori"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Direktori Individu</span>
        </Link>
      </div>

      <div className="rounded-xl border border-stroke bg-white p-6 md:p-8 shadow-default">
        {/* Page Title */}
        <div className="border-b border-stroke pb-4 mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Tambah Profil Anggota Silsilah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Catatkan individu baru ke dalam silsilah keluarga besar dengan verifikasi data yang akurat
          </p>
        </div>

        {/* Live Duplicate Warning Banner */}
        {duplicateMatches.length > 0 && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Terdeteksi Kemungkinan Profil Duplikat dalam Trah!</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Sistem menemukan profil dengan kemiripan nama / tahun kelahiran tinggi. Pastikan individu ini belum pernah dicatat sebelumnya.
            </p>
            <div className="space-y-1.5 pt-1">
              {duplicateMatches.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900">{m.candidate.primary_name}</span>
                    <span className="text-[11px] text-slate-500 ml-2">
                      ({m.candidate.birth_date_year || "Tahun tidak ada"})
                    </span>
                    <div className="text-[10px] text-amber-700 mt-0.5">
                      Faktor: {m.reasons.join(", ")}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                    Skor: {m.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Primary Name */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              Nama Lengkap Primer <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={primaryName}
              onChange={(e) => setPrimaryName(e.target.value)}
              placeholder="Contoh: Bambang Soedirjo"
              className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Gunakan nama resmi atau nama yang paling umum dikenal. Nama gelar dapat dicatat dalam biografi.
            </span>
          </div>

          {/* Nickname & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1.5">Nama Panggilan / Alias</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Contoh: Bambang"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1.5">
                Jenis Kelamin <span className="text-rose-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-white text-slate-800 outline-none focus:border-primary cursor-pointer"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="unknown">Tidak Diketahui</option>
              </select>
            </div>
          </div>

          {/* Status Hidup */}
          <div className="p-4 rounded-lg border border-stroke bg-slate-50 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block">Status Kehidupan</span>
              <span className="text-slate-500 text-[11px]">
                Apakah individu saat ini masih hidup?
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isLiving}
                onChange={(e) => setIsLiving(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Flexible Birth Info */}
          <div className="border border-stroke p-4 rounded-lg space-y-3 bg-white">
            <span className="font-bold text-slate-800 block text-xs">
              Pencatatan Kelahiran (Fleksibel & Historis)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Tahun Kelahiran
                </label>
                <input
                  type="number"
                  min="1000"
                  max="2100"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="Contoh: 1895"
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Ketepatan Tanggal
                </label>
                <select
                  value={birthType}
                  onChange={(e) => setBirthType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-white text-slate-800 outline-none focus:border-primary cursor-pointer"
                >
                  <option value="EXACT">Pasti / Eksak (Sesuai Akta)</option>
                  <option value="APPROXIMATE">Perkiraan / Sekitar (Kira-kira)</option>
                  <option value="BEFORE">Sebelum Tahun Tertentu</option>
                  <option value="AFTER">Sesudah Tahun Tertentu</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Keterangan Tanggal Asli / Historis (Opsional)
              </label>
              <input
                type="text"
                value={birthText}
                onChange={(e) => setBirthText(e.target.value)}
                placeholder="Misal: 'Sekitar bulan Suro tahun Wawu' atau penanggalan Jawa"
                className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Biografi */}
          <div>
            <label className="block font-medium text-slate-700 mb-1.5">
              Catatan Biografi & Keterangan Tambahan
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Catatan riwayat hidup, gelar kehormatan, tempat pemakaman, dll..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-stroke">
            <Link
              href="/direktori"
              className="px-4 py-2 rounded-lg border border-stroke bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-colors"
            >
              Batal
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan Data..." : "Simpan Anggota Baru"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
