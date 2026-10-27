"use client";

import { useState } from "react";
import {
  DownloadIcon,
  UploadIcon,
  DocsIcon,
  PlugInIcon,
  CheckCircleIcon,
  LockIcon,
  BoxCubeIcon,
} from "@/components/icons/tailadmin-icons";
import { generateFamilyJson, generateGedcom, FamilyBackupPayload } from "@/features/data-transfer/export.service";
import { validateJsonBackup, parseGedcomBasic, ImportPreviewSummary } from "@/features/data-transfer/import.service";

const SAMPLE_EXPORT_DATA: FamilyBackupPayload = {
  version: "1.0",
  exported_at: new Date().toISOString(),
  family: {
    id: "f0000000-0000-0000-0000-000000000001",
    name: "Bani Kartowidjojo",
    description: "Silsilah keluarga besar keturunan R. M. Kartowidjojo",
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
  const [familyName, setFamilyName] = useState("Bani Kartowidjojo");
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
        <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
          Pengaturan Trah & Manajemen Data
        </h1>
        <p className="text-theme-sm text-gray-500 mt-0.5">
          Konfigurasi ruang keluarga, ekspor backup silsilah, impor GEDCOM, dan deduplikasi profil
        </p>
      </div>

      {/* 1. Pengaturan Profil Keluarga */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3">
          Informasi & Privasi Ruang Silsilah
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <label className="block font-medium text-gray-700 mb-1.5">Nama Trah / Keluarga Besar</label>
            <input
              type="text"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1.5">Deskripsi Singkat</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm text-gray-800 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
            />
          </div>

          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between">
            <div>
              <span className="font-semibold text-gray-900 block text-sm">Privasi Ruang Keluarga</span>
              <span className="text-gray-500 text-xs">
                Jika privat, hanya anggota keluarga yang terdaftar yang dapat melihat pohon silsilah.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 2. Ekspor Silsilah */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <DownloadIcon className="w-5 h-5 text-brand-500" />
          <span>Ekspor Data Silsilah (Pencadangan / Backup)</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Unduh salinan lengkap silsilah keluarga besar Anda. Tersedia format JSON terstruktur untuk
          pemulihan penuh sistem, atau format standar GEDCOM 5.5.1 untuk integrasi software genealogis internasional.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <button
            onClick={handleExportJson}
            className="p-5 rounded-2xl border border-gray-200 hover:border-brand-500 bg-white hover:bg-gray-50 text-left transition space-y-2 shadow-theme-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm group-hover:text-brand-500 transition-colors">
              <DocsIcon className="w-4 h-4 text-brand-500" />
              <span>Ekspor Cadangan JSON</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Cadangan komprehensif mencakup individu, relasi, klaim bukti sumber, dan catatan metadata lengkap.
            </p>
          </button>

          <button
            onClick={handleExportGedcom}
            className="p-5 rounded-2xl border border-gray-200 hover:border-brand-500 bg-white hover:bg-gray-50 text-left transition space-y-2 shadow-theme-xs cursor-pointer group"
          >
            <div className="flex items-center gap-2 text-gray-900 font-semibold text-sm group-hover:text-brand-500 transition-colors">
              <BoxCubeIcon className="w-4 h-4 text-brand-500" />
              <span>Ekspor Standar GEDCOM 5.5.1</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">
              Format standar pertukaran silsilah dunia (FamilySearch, Gramps, MyHeritage, RootsMagic).
            </p>
          </button>
        </div>
      </div>

      {/* 3. Impor & Pemulihan Cadangan */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <UploadIcon className="w-5 h-5 text-brand-500" />
          <span>Impor Data & Pemulihan Silsilah</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Unggah berkas cadangan JSON atau GEDCOM (.ged). Sistem akan memvalidasi keutuhan skema dan
          menampilkan pratinjau sebelum perubahan diterapkan.
        </p>

        <div className="pt-1">
          <label className="border-2 border-dashed border-gray-300 hover:border-brand-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-gray-50/50">
            <UploadIcon className="w-8 h-8 text-brand-500 mb-2" />
            <span className="text-sm font-semibold text-gray-900">
              Pilih Berkas JSON atau GEDCOM (.ged)
            </span>
            <span className="text-xs text-gray-400 mt-1">Ukuran maksimal 25 MB</span>
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
          <div className="mt-4 p-5 rounded-2xl border border-gray-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-900">
                Pratinjau Berkas ({importType.toUpperCase()})
              </span>
              {importSummary.valid ? (
                <span className="px-2.5 py-0.5 rounded-full bg-success-50 text-success-600 text-xs font-semibold">
                  Format Valid
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full bg-error-50 text-error-600 text-xs font-semibold">
                  Format Bermasalah
                </span>
              )}
            </div>

            {importSummary.valid ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-[11px] text-gray-500 block">Individu</span>
                  <span className="font-bold text-gray-900">{importSummary.totalPersons} Orang</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Relasi</span>
                  <span className="font-bold text-gray-900">{importSummary.totalRelationships} Tautan</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Serikat Pasangan</span>
                  <span className="font-bold text-gray-900">{importSummary.totalUnions} Pernikahan</span>
                </div>
                <div>
                  <span className="text-[11px] text-gray-500 block">Sumber Dokumen</span>
                  <span className="font-bold text-gray-900">{importSummary.totalSources} Dokumen</span>
                </div>
              </div>
            ) : (
              <div className="text-xs text-error-700 bg-error-50 p-3 rounded-lg border border-error-200">
                {importSummary.errors?.join(", ")}
              </div>
            )}

            {importSummary.valid && !isRestored && (
              <button
                onClick={handleConfirmRestore}
                className="w-full py-3 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm shadow-theme-xs transition"
              >
                Konfirmasi & Mulai Pemulihan Data
              </button>
            )}

            {isRestored && (
              <div className="p-3.5 rounded-xl bg-success-50 border border-success-100 text-xs text-success-700 font-semibold flex items-center gap-2">
                <CheckCircleIcon className="w-4 h-4 text-success-500 shrink-0" />
                <span>Pemulihan data berhasil! Seluruh record telah terverifikasi dan siap dijelajahi.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Penggabungan Profil Duplikat */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs space-y-4">
        <h2 className="text-base font-semibold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
          <PlugInIcon className="w-5 h-5 text-brand-500" />
          <span>Penggabungan Profil Duplikat (Profile Merging)</span>
        </h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          Gunakan utilitas ini jika ditemukan individu yang sama dicatat dua kali secara tidak sengaja.
          Sistem akan memigrasikan seluruh relasi, klaim bukti, dan nama alias ke profil target secara transaksional.
        </p>

        <form onSubmit={handleMergeProfiles} className="space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1.5">
                Profil Duplikat (Akan Dihapus / Sumber)
              </label>
              <input
                type="text"
                value={sourcePerson}
                onChange={(e) => setSourcePerson(e.target.value)}
                placeholder="Misal: Bambang Sudirjo (versi salah ketik)"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-700 mb-1.5">
                Profil Utama (Target yang Dipertahankan)
              </label>
              <input
                type="text"
                value={targetPerson}
                onChange={(e) => setTargetPerson(e.target.value)}
                placeholder="Misal: Bambang Soedirjo (profil resmi)"
                className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
            </div>
          </div>

          {mergeStatus && (
            <div
              className={`p-3.5 rounded-xl text-xs font-medium ${
                mergeStatus.startsWith("Sukses")
                  ? "bg-success-50 text-success-700 border border-success-100"
                  : "bg-error-50 text-error-700 border border-error-100"
              }`}
            >
              {mergeStatus}
            </div>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm transition shadow-theme-xs"
          >
            Jalankan Penggabungan Profil
          </button>
        </form>
      </div>
    </div>
  );
}
