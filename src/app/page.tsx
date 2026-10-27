import Link from "next/link";
import { GitFork, ShieldCheck, FileText, Users, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-whiten">
      {/* Navigation */}
      <header className="border-b border-stroke bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold text-lg shadow-xs">
              PK
            </div>
            <div>
              <span className="font-bold text-base text-slate-800 tracking-tight block leading-tight">
                Pusaka Keluarga
              </span>
              <span className="text-[11px] text-slate-400 block">
                Silsilah Kolaboratif Lintas Generasi
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-xs transition-colors"
            >
              Daftar Trah
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-6">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Integritas Terjamin dengan Validasi Graf Anti-Siklus (DAG)</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          Menjaga Warisan Leluhur, Menyambung Silaturahmi Lintas Generasi
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          Platform modern terpusat untuk mendokumentasikan pohon keluarga besar secara kolaboratif,
          didukung bukti dokumen autentik, verifikasi klaim independen, dan hak akses bertingkat.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <span>Buka Ruang Kerja Silsilah</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/direktori"
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-stroke rounded-lg shadow-xs transition-colors flex items-center justify-center"
          >
            Telusuri Direktori Anggota
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white p-6 rounded-xl border border-stroke shadow-default hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center text-primary mb-4 border border-blue-100">
              <GitFork className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Visualisasi Graf Pohon Interaktif</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Jelajahi cabang leluhur dan keturunan secara dinamis dengan diagram modular React Flow,
              kemampuan perluas/ciutkan nodus, dan kartu relasi pasangan yang jelas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stroke shadow-default hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600 mb-4 border border-amber-100">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Berbasis Klaim & Arsip Dokumen</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Setiap klaim tanggal dan relasi dipisahkan dari dokumen sumber pembuktian.
              Data yang diperdebatkan tetap dicatat secara transparan tanpa spekulasi fiktif.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-stroke shadow-default hover:shadow-md transition-shadow">
            <div className="w-11 h-11 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 mb-1.5">Kolaborasi Aman Multi-Peran</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Beri wewenang berbeda untuk Family Admin, Editor, dan Kontributor.
              Setiap perubahan melalui alur persetujuan kurasi sebelum tercatat permanen.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stroke bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 Pusaka Keluarga. Platform Silsilah & Arsip Trah Lintas Generasi.</p>
      </footer>
    </div>
  );
}
