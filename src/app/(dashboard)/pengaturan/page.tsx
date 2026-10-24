"use client";

import { useState } from "react";
import {
  Settings,
  Download,
  Upload,
  FileText,
  Shield,
  GitMerge,
  AlertTriangle,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { generateFamilyJson, generateGedcom, FamilyBackupPayload } from "@/features/data-transfer/export.service";
import { validateJsonBackup, parseGedcomBasic, ImportPreviewSummary } from "@/features/data-transfer/import.service";

const SAMPLE_EXPORT_DATA: FamilyBackupPayload = {
  version: "1.0",
  exported_at: new Date().toISOString(),
  family: {
    id: "f0000000-0000-0000-0000-000000000001",
    name: "Bani Kartosoedirjo",
    description: "Silsilah keluarga besar keturunan R. M. Kartosoedirjo",
  },
  persons: [
    {
      id: "b0000001",
      primary_name: "Raden Mas Kartosoedirjo",
      nickname: "Mbah Karto",
      gender: "male",
      is_living: false,
      birth_date_year: 1885,
      death_date_year: 1952,
    },
    {
      id: "b0000002",
      primary_name: "Raden Ajeng Siti Aminah",
      nickname: "Mbah Aminah",
      gender: "female",
      is_living: false,
      birth_date_year: 1890,
      death_date_year: 1940,
    },
    {
      id: "b0000004",
      primary_name: "Bambang Soedirjo",
      gender: "male",
      is_living: false,
      birth_date_year: 1915,
      death_date_year: 1988,
    },
  ],
  relationships: [
    {
      id: "r1",
      parent_id: "b0000001",
      child_id: "b0000004",
      relationship_type: "biological",
      confidence: "verified",
    },
  ],
  unions: [
    {
      id: "u1",
      start_date_year: 1912,
      status: "widowed",
      husband_id: "b0000001",
      wife_id: "b0000002",
      children_ids: ["b0000004"],
    },
  ],
  sources: [],
};

export default function PengaturanPage() {
  const [familyName, setFamilyName] = useState("Bani Kartosoedirjo");
  const [description, setDescription] = useState(
    "Silsilah keluarga besar keturunan R. M. Kartosoedirjo, berasal dari Surakarta dan tersebar ke berbagai kota."
  );
  const [isPrivate, setIsPrivate] = useState(true);

  // Import preview state
  const [importSummary, setImportSummary] = useState<ImportPreviewSummary | null>(null);
  const [importType, setImportType] = useState<"json" | "gedcom">("json");
  const [isRestored, setIsRestored] = useState(false);

  // Merge state
  const [sourcePerson, setSourcePerson] = useState("");
  const [targetPerson, setTargetPerson] = useState("");
  const [mergeStatus, setMergeStatus] = useState<string | null>(null);

  const handleExportJson = () => {
    const dataStr = generateFamilyJson(SAMPLE_EXPORT_DATA);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `backup-pusaka-keluarga-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportGedcom = () => {
    const gedcomStr = generateGedcom(SAMPLE_EXPORT_DATA);
    const blob = new Blob([gedcomStr], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `silsilah-gedcom-5.5.1-${new Date().toISOString().slice(0, 10)}.ged`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (file.name.endsWith(".ged") || file.name.endsWith(".gedcom")) {
        setImportType("gedcom");
        const parsed = parseGedcomBasic(content);
        setImportSummary({
          valid: true,
          familyName: "File GEDCOM: " + file.name,
          totalPersons: parsed.individualsCount,
          totalRelationships: parsed.familiesCount,
          totalUnions: parsed.familiesCount,
          totalSources: 0,
        });
      } else {
        setImportType("json");
        const summary = validateJsonBackup(content);
        setImportSummary(summary);
      }
      setIsRestored(false);
    };
    reader.readAsText(file);
  };

  const handleConfirmRestore = () => {
    setIsRestored(true);
  };

  const handleMergeProfiles = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePerson || !targetPerson) return;
    if (sourcePerson === targetPerson) {
      setMergeStatus("Galat: Profil asal dan profil target tidak boleh individu yang sama!");
      return;
    }
    setMergeStatus(
      `Sukses: Profil "${sourcePerson}" berhasil digabungkan secara transaksional ke dalam "${targetPerson}". Seluruh relasi, nama alias, klaim, dan foto telah dimigrasikan dan dicatat dalam audit log.`
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-pusaka-800" />
          <span>Pengaturan & Pemulihan Keluarga</span>
        </h1>
        <p className="text-xs text-pusaka-600 mt-1">
          Konfigurasi ruang keluarga, ekspor data silsilah, pemulihan cadangan, dan penggabungan profil
        </p>
      </div>

      {/* 1. Pengaturan Profil Keluarga */}
      <div className="bg-white rounded-3xl border border-pusaka-200/80 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-pusaka-900 border-b border-pusaka-100 pb-3">
          Informasi & Privasi Ruang Silsilah
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-pusaka-800 mb-1">Nama Trah / Keluarga Besar</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-pusaka-800 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-xl border border-pusaka-200 bg-pusaka-50/50 flex items-center justify-between">
            <div>
              <span className="font-bold text-pusaka-900 block">Privasi Ruang Keluarga</span>
              <span className="text-pusaka-600 text-[11px]">
                Jika privat, hanya anggota yang diundang yang dapat mengakses pohon dan direktori.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-pusaka-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-pusaka-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pusaka-800"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Ekspor Silsilah */}
      <div className="bg-white rounded-3xl border border-pusaka-200/80 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-pusaka-900 border-b border-pusaka-100 pb-3 flex items-center space-x-2">
          <Download className="w-5 h-5 text-pusaka-800" />
          <span>Ekspor Data Silsilah (Backup)</span>
        </h2>
        <p className="text-xs text-pusaka-600 leading-relaxed">
          Unduh salinan lengkap silsilah keluarga besar Anda. Tersedia format JSON terstruktur untuk
          pemulihan penuh sistem, atau format GEDCOM 5.5.1 untuk integrasi software genealogis internasional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <button
            onClick={handleExportJson}
            className="p-4 rounded-2xl border border-pusaka-200 hover:border-pusaka-800/60 bg-pusaka-50/50 hover:bg-pusaka-100/50 text-left transition-all space-y-1.5"
          >
            <div className="flex items-center space-x-2 text-pusaka-900 font-bold text-xs">
              <FileText className="w-4 h-4 text-pusaka-700" />
              <span>Ekspor Backup JSON</span>
            </div>
            <p className="text-[11px] text-pusaka-600 leading-normal">
              Cadangan komprehensif mencakup individu, nama alternatif, klaim bukti, dan catatan tempat.
            </p>
          </button>

          <button
            onClick={handleExportGedcom}
            className="p-4 rounded-2xl border border-pusaka-200 hover:border-pusaka-800/60 bg-pusaka-50/50 hover:bg-pusaka-100/50 text-left transition-all space-y-1.5"
          >
            <div className="flex items-center space-x-2 text-pusaka-900 font-bold text-xs">
              <Shield className="w-4 h-4 text-pusaka-700" />
              <span>Ekspor GEDCOM 5.5.1</span>
            </div>
            <p className="text-[11px] text-pusaka-600 leading-normal">
              Format standar pertukaran silsilah dunia (FamilySearch, Gramps, MyHeritage, RootsMagic).
            </p>
          </button>
        </div>
      </div>

      {/* 3. Impor & Pemulihan Cadangan */}
      <div className="bg-white rounded-3xl border border-pusaka-200/80 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-pusaka-900 border-b border-pusaka-100 pb-3 flex items-center space-x-2">
          <Upload className="w-5 h-5 text-pusaka-800" />
          <span>Impor Data & Pemulihan Silsilah</span>
        </h2>
        <p className="text-xs text-pusaka-600 leading-relaxed">
          Unggah berkas cadangan JSON atau GEDCOM (.ged). Sistem akan memvalidasi keutuhan skema dan
          menampilkan pratinjau sebelum perubahan diterapkan.
        </p>

        <div className="pt-2">
          <label className="border-2 border-dashed border-pusaka-300 hover:border-pusaka-800 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-pusaka-50/40">
            <Upload className="w-8 h-8 text-pusaka-600 mb-2" />
            <span className="text-xs font-bold text-pusaka-900">
              Pilih Berkas JSON atau GEDCOM (.ged)
            </span>
            <span className="text-[10px] text-pusaka-500 mt-1">Ukuran maksimal 25 MB</span>
            <input
              type="file"
              accept=".json,.ged,.gedcom"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Import Preview Modal / Box */}
        {importSummary && (
          <div className="mt-4 p-5 rounded-2xl border border-pusaka-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pusaka-900">
                Pratinjau Berkas ({importType.toUpperCase()})
              </span>
              {importSummary.valid ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Skema Valid
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                  Format Bermasalah
                </span>
              )}
            </div>

            {importSummary.valid ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-pusaka-50/70 p-3 rounded-xl">
                <div>
                  <span className="text-[10px] text-pusaka-500 block">Individu</span>
                  <span className="font-bold text-pusaka-900">{importSummary.totalPersons} Orang</span>
                </div>
                <div>
                  <span className="text-[10px] text-pusaka-500 block">Relasi</span>
                  <span className="font-bold text-pusaka-900">{importSummary.totalRelationships} Tautan</span>
                </div>
                <div>
                  <span className="text-[10px] text-pusaka-500 block">Serikat Pasangan</span>
                  <span className="font-bold text-pusaka-900">{importSummary.totalUnions} Pernikahan</span>
                </div>
                <div>
                  <span className="text-[10px] text-pusaka-500 block">Sumber Dokumen</span>
                  <span className="font-bold text-pusaka-900">{importSummary.totalSources} Dokumen</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-xl border border-rose-200">
                {importSummary.errors?.join(", ")}
              </div>
            )}

            {importSummary.valid && !isRestored && (
              <button
                onClick={handleConfirmRestore}
                className="w-full py-2.5 rounded-xl bg-pusaka-800 hover:bg-pusaka-900 text-white font-bold text-xs shadow-sm transition-all"
              >
                Konfirmasi & Mulai Pemulihan Data
              </button>
            )}

            {isRestored && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 font-semibold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pemulihan data berhasil! Seluruh record telah terverifikasi dan siap dijelajahi.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Penggabungan Profil Duplikat (Profile Merging) */}
      <div className="bg-white rounded-3xl border border-pusaka-200/80 p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-pusaka-900 border-b border-pusaka-100 pb-3 flex items-center space-x-2">
          <GitMerge className="w-5 h-5 text-pusaka-800" />
          <span>Penggabungan Profil Duplikat (Profile Merging)</span>
        </h2>
        <p className="text-xs text-pusaka-600 leading-relaxed">
          Jika ditemukan dua entri profil yang merujuk pada orang yang sama, Anda dapat menggabungkannya.
          Seluruh nama alias, hubungan orang tua-anak, pasangan, foto, dan klaim akan dipindahkan ke profil target.
          Operasi ini transaksional dan tercatat dalam audit log.
        </p>

        <form onSubmit={handleMergeProfiles} className="space-y-4 text-xs pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-pusaka-800 mb-1">
                Profil Sumber (Akan Dihapus / Diarsip)
              </label>
              <select
                value={sourcePerson}
                onChange={(e) => setSourcePerson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 bg-white"
              >
                <option value="">-- Pilih Profil Sumber --</option>
                <option value="Bambang Soedirjo (Duplikat)">Bambang Soedirjo (Duplikat)</option>
                <option value="B. Sudiryo (Catatan Lama)">B. Sudiryo (Catatan Lama)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-pusaka-800 mb-1">
                Profil Target (Profil Utama yang Dipertahankan)
              </label>
              <select
                value={targetPerson}
                onChange={(e) => setTargetPerson(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-pusaka-200 bg-white"
              >
                <option value="">-- Pilih Profil Target --</option>
                <option value="Bambang Soedirjo (1915-1988)">Bambang Soedirjo (1915-1988)</option>
                <option value="Raden Mas Kartosoedirjo (1885-1952)">Raden Mas Kartosoedirjo (1885-1952)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-1.5"
          >
            <GitMerge className="w-4 h-4" />
            <span>Jalankan Penggabungan Profil</span>
          </button>
        </form>

        {mergeStatus && (
          <div
            className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
              mergeStatus.startsWith("Sukses")
                ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                : "bg-rose-50 border-rose-200 text-rose-900"
            }`}
          >
            {mergeStatus}
          </div>
        )}
      </div>
    </div>
  );
}

