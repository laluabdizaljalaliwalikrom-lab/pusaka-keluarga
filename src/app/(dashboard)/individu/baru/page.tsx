"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, AlertTriangle, ShieldCheck, UserCheck } from "lucide-react";
import { findPotentialDuplicates, type CandidatePerson } from "@/features/persons/duplicate-detector";

// Data existing untuk simulasi deteksi duplikat instan
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
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/direktori"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-pusaka-700 hover:text-pusaka-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl border border-pusaka-200/80 p-6 md:p-8 shadow-sm">
        <div className="border-b border-pusaka-100 pb-4 mb-6">
          <h1 className="text-xl font-extrabold text-pusaka-900 tracking-tight">
            Tambah Profil Individu Silsilah
          </h1>
          <p className="text-xs text-pusaka-600 mt-1">
            Catatkan individu baru ke dalam trah keluarga besar dengan data yang akurat.
          </p>
        </div>

        {/* Live Duplicate Warning Banner */}
        {duplicateMatches.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Peringatan: Terdeteksi Kemungkinan Profil Duplikat!</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Sistem menemukan individu yang sudah ada dalam database dengan kemiripan tinggi.
              Pastikan Anda tidak membuat orang yang sama dua kali.
            </p>
            <div className="space-y-1.5 pt-1">
              {duplicateMatches.map((m, idx) => (
                <div
                  key={idx}
                  className="bg-white/80 p-2.5 rounded-xl border border-amber-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-pusaka-900">{m.candidate.primary_name}</span>
                    <span className="text-[11px] text-pusaka-600 ml-2">
                      ({m.candidate.birth_date_year || "Tahun tidak ada"})
                    </span>
                    <div className="text-[10px] text-amber-800 mt-0.5">
                      Alasan: {m.reasons.join(", ")}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-amber-200 font-bold text-[10px]">
                    Skor: {m.score}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Primer */}
          <div>
            <label className="block text-xs font-bold text-pusaka-900 mb-1">
              Nama Lengkap Primer <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={primaryName}
              onChange={(e) => setPrimaryName(e.target.value)}
              placeholder="Contoh: Bambang Soedirjo"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
            <span className="text-[10px] text-pusaka-500 mt-1 block">
              Gunakan nama resmi atau nama yang paling umum dikenal. Nama gelar dapat dicatat terpisah.
            </span>
          </div>

          {/* Nama Panggilan & Jenis Kelamin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-pusaka-900 mb-1">Nama Panggilan</label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="Contoh: Bambang"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-pusaka-900 mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pusaka-200 bg-white focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
              >
                <option value="male">Laki-laki</option>
                <option value="female">Perempuan</option>
                <option value="unknown">Tidak Diketahui</option>
              </select>
            </div>
          </div>

          {/* Status Hidup */}
          <div className="p-3.5 rounded-xl border border-pusaka-200 bg-pusaka-50/50 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-pusaka-900 block">Status Kehidupan</span>
              <span className="text-[11px] text-pusaka-600">
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
              <div className="w-11 h-6 bg-pusaka-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pusaka-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Informasi Kelahiran Fleksibel */}
          <div className="border border-pusaka-200 p-4 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-pusaka-900 block">
              Pencatatan Kelahiran (Fleksibel & Historis)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-pusaka-700 mb-1">
                  Tahun Kelahiran
                </label>
                <input
                  type="number"
                  min="1000"
                  max="2100"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value ? parseInt(e.target.value) : "")}
                  placeholder="Contoh: 1895"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-pusaka-200"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-pusaka-700 mb-1">
                  Ketepatan Tanggal
                </label>
                <select
                  value={birthType}
                  onChange={(e) => setBirthType(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-pusaka-200 bg-white"
                >
                  <option value="APPROXIMATE">Perkiraan (Sekitar tahun...)</option>
                  <option value="EXACT">Pasti (Tepat)</option>
                  <option value="BEFORE">Sebelum (Sebelum tahun...)</option>
                  <option value="AFTER">Setelah (Setelah tahun...)</option>
                  <option value="UNKNOWN">Tidak Diketahui</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-pusaka-700 mb-1">
                Catatan Tekstual Tanggal (Dari Sumber Lisan/Arsip)
              </label>
              <input
                type="text"
                value={birthText}
                onChange={(e) => setBirthText(e.target.value)}
                placeholder="Contoh: Kira-kira sebelum zaman pendudukan Jepang"
                className="w-full px-3 py-2 text-xs rounded-xl border border-pusaka-200"
              />
            </div>
          </div>

          {/* Biografi */}
          <div>
            <label className="block text-xs font-bold text-pusaka-900 mb-1">Biografi Singkat</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Catatan kisah hidup, peranan keluarga, atau riwayat pengabdian..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-pusaka-100 flex items-center justify-end space-x-3">
            <Link
              href="/direktori"
              className="px-4 py-2.5 rounded-xl border border-pusaka-300 text-pusaka-700 hover:bg-pusaka-50 text-xs font-semibold"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white text-xs font-bold shadow transition-all inline-flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Menyimpan..." : "Simpan Individu"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

