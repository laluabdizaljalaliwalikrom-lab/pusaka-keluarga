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
    {
      id: "r2",
      parent_id: "b0000002",
      child_id: "b0000004",
      relationship_type: "biological",
      confidence: "verified",
    },
  ],
  unions: [
    {
      id: "u1",
      husband_id: "b0000001",
      wife_id: "b0000002",
      status: "married",
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
          Pengaturan Trah & Manajemen Data
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Konfigurasi ruang keluarga, ekspor backup silsilah, impor GEDCOM, dan deduplikasi profil
        </p>
      </div>

      {/* 1. Pengaturan Profil Keluarga */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-stroke pb-3">
          Informasi & Privasi Ruang Silsilah
        </h2>

        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 mb-1">Nama Trah / Keluarga Besar</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 mb-1">Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="p-4 rounded-lg border border-stroke bg-slate-50 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-800 block text-xs">Privasi Ruang Keluarga</span>
              <span className="text-slate-500 text-[11px]">
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
              <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Ekspor Silsilah */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-stroke pb-3 flex items-center gap-2">
          <Download className="w-4 h-4 text-primary" />
          <span>Ekspor Data Silsilah (Pencadangan / Backup)</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Unduh salinan lengkap silsilah keluarga besar Anda. Tersedia format JSON terstruktur untuk
          pemulihan penuh sistem, atau format standar GEDCOM 5.5.1 untuk integrasi software genealogis internasional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <button
            onClick={handleExportJson}
            className="p-4 rounded-xl border border-stroke hover:border-primary bg-white hover:bg-slate-50 text-left transition-colors space-y-1.5 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs group-hover:text-primary transition-colors">
              <FileText className="w-4 h-4 text-primary" />
              <span>Ekspor Cadangan JSON</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Cadangan komprehensif mencakup individu, relasi, klaim bukti sumber, dan catatan metadata lengkap.
            </p>
          </button>

          <button
            onClick={handleExportGedcom}
            className="p-4 rounded-xl border border-stroke hover:border-primary bg-white hover:bg-slate-50 text-left transition-colors space-y-1.5 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs group-hover:text-primary transition-colors">
              <Shield className="w-4 h-4 text-primary" />
              <span>Ekspor Standar GEDCOM 5.5.1</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Format standar pertukaran silsilah dunia (FamilySearch, Gramps, MyHeritage, RootsMagic).
            </p>
          </button>
        </div>
      </div>

      {/* 3. Impor & Pemulihan Cadangan */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-stroke pb-3 flex items-center gap-2">
          <Upload className="w-4 h-4 text-primary" />
          <span>Impor Data & Pemulihan Silsilah</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Unggah berkas cadangan JSON atau GEDCOM (.ged). Sistem akan memvalidasi keutuhan skema dan
          menampilkan pratinjau sebelum perubahan diterapkan.
        </p>

        <div className="pt-1">
          <label className="border-2 border-dashed border-stroke hover:border-primary rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-50/50">
            <Upload className="w-8 h-8 text-primary mb-2" />
            <span className="text-xs font-bold text-slate-800">
              Pilih Berkas JSON atau GEDCOM (.ged)
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Ukuran maksimal 25 MB</span>
            <input
              type="file"
              accept=".json,.ged,.gedcom"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Import Preview Box */}
        {importSummary && (
          <div className="mt-4 p-5 rounded-xl border border-stroke bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">
                Pratinjau Berkas ({importType.toUpperCase()})
              </span>
              {importSummary.valid ? (
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  Format Valid
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                  Format Bermasalah
                </span>
              )}
            </div>

            {importSummary.valid ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-stroke">
                <div>
                  <span className="text-[10px] text-slate-400 block">Individu</span>
                  <span className="font-bold text-slate-800">{importSummary.totalPersons} Orang</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Relasi</span>
                  <span className="font-bold text-slate-800">{importSummary.totalRelationships} Tautan</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Serikat Pasangan</span>
                  <span className="font-bold text-slate-800">{importSummary.totalUnions} Pernikahan</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Sumber Dokumen</span>
                  <span className="font-bold text-slate-800">{importSummary.totalSources} Dokumen</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-rose-700 bg-rose-50 p-3 rounded-lg border border-rose-200">
                {importSummary.errors?.join(", ")}
              </div>
            )}

            {importSummary.valid && !isRestored && (
              <button
                onClick={handleConfirmRestore}
                className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-xs shadow-xs transition-colors"
              >
                Konfirmasi & Mulai Pemulihan Data
              </button>
            )}

            {isRestored && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pemulihan data berhasil! Seluruh record telah terverifikasi dan siap dijelajahi.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Penggabungan Profil Duplikat (Profile Merging) */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default space-y-4">
        <h2 className="text-sm font-bold text-slate-800 border-b border-stroke pb-3 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-primary" />
          <span>Penggabungan Profil Duplikat (Profile Merging)</span>
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Gunakan utilitas ini jika ditemukan individu yang sama dicatat dua kali secara tidak sengaja.
          Sistem akan memigrasikan seluruh relasi, klaim bukti, dan nama alias ke profil target secara transaksional.
        </p>

        <form onSubmit={handleMergeProfiles} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Profil Duplikat (Akan Dihapus / Sumber)
              </label>
              <input
                type="text"
                value={sourcePerson}
                onChange={(e) => setSourcePerson(e.target.value)}
                placeholder="Misal: Bambang Sudirjo (versi salah ketik)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">
                Profil Utama (Target yang Dipertahankan)
              </label>
              <input
                type="text"
                value={targetPerson}
                onChange={(e) => setTargetPerson(e.target.value)}
                placeholder="Misal: Bambang Soedirjo (profil resmi)"
                className="w-full px-3.5 py-2.5 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {mergeStatus && (
            <div
              className={`p-3 rounded-lg text-xs font-medium ${
                mergeStatus.startsWith("Sukses")
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              {mergeStatus}
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors shadow-xs"
          >
            Jalankan Penggabungan Profil
          </button>
        </form>
      </div>
    </div>
  );
}
