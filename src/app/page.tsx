import Link from "next/link";
import { GitFork, ShieldCheck, FileText, Users, ArrowRight, BookOpen } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pusaka-50 via-background to-background">
      {/* Navigation */}
      <header className="border-b border-pusaka-200/60 bg-white/70 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-pusaka-800 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              PK
            </div>
            <div>
              <span className="font-bold text-lg text-pusaka-900 tracking-tight block">
                Pusaka Keluarga
              </span>
              <span className="text-xs text-pusaka-600 block -mt-1">
                Silsilah Kolaboratif Lintas Generasi
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-pusaka-800 hover:text-pusaka-900 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-pusaka-800 hover:bg-pusaka-900 rounded-lg shadow-sm transition-all"
            >
              Daftar Keluarga
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-pusaka-100/80 border border-pusaka-200 text-pusaka-800 text-xs font-semibold mb-8">
          <ShieldCheck className="w-4 h-4 text-pusaka-700" />
          <span>Integritas Terjamin dengan Validasi Graf Anti-Siklus</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-pusaka-900 tracking-tight max-w-4xl">
          Menjaga Warisan Leluhur, Menyambung Tali Silaturahmi Lintas Generasi
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-pusaka-700 max-w-2xl leading-relaxed">
          Platform terpusat untuk mendokumentasikan pohon keluarga besar secara kolaboratif,
          didukung bukti dokumen autentik, verifikasi klaim independen, dan perlindungan privasi keluarga.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-white bg-pusaka-800 hover:bg-pusaka-900 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <span>Buka Pohon Silsilah</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/direktori"
            className="w-full sm:w-auto px-6 py-3.5 text-base font-medium text-pusaka-800 bg-white hover:bg-pusaka-50 border border-pusaka-300 rounded-xl shadow-sm transition-all flex items-center justify-center"
          >
            Telusuri Direktori Individu
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          <div className="bg-white/80 p-6 rounded-2xl border border-pusaka-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-pusaka-100 flex items-center justify-center text-pusaka-800 mb-4">
              <GitFork className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-pusaka-900 mb-2">Visualisasi Interaktif React Flow</h3>
            <p className="text-sm text-pusaka-700 leading-relaxed">
              Jelajahi cabang leluhur dan keturunan secara dinamis dengan visualisasi modular,
              kemampuan perluas/ciutkan nodus, dan kartu relasi pasangan yang jelas.
            </p>
          </div>

          <div className="bg-white/80 p-6 rounded-2xl border border-pusaka-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-pusaka-100 flex items-center justify-center text-pusaka-800 mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-pusaka-900 mb-2">Berbasis Klaim & Arsip Sumber</h3>
            <p className="text-sm text-pusaka-700 leading-relaxed">
              Setiap klaim tanggal dan relasi dipisahkan dari dokumen sumber pembuktian.
              Data yang diperdebatkan tetap dicatat secara transparan tanpa spekulasi fiktif.
            </p>
          </div>

          <div className="bg-white/80 p-6 rounded-2xl border border-pusaka-200/80 shadow-sm hover:shadow transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-pusaka-100 flex items-center justify-center text-pusaka-800 mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-pusaka-900 mb-2">Kolaborasi Aman Multi-Peran</h3>
            <p className="text-sm text-pusaka-700 leading-relaxed">
              Didukung 5 tingkat peran pengguna (Owner, Admin, Editor, Contributor, Reader)
              dengan proteksi data Row Level Security (RLS) di tingkat database PostgreSQL.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-pusaka-200 bg-white/50 py-8 text-center text-xs text-pusaka-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Pusaka Keluarga. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center space-x-4">
            <Link href="/panduan" className="hover:underline flex items-center space-x-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan Penggunaan</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

