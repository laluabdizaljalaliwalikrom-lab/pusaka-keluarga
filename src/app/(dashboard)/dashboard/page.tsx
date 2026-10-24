import Link from "next/link";
import {
  Users,
  GitFork,
  FolderArchive,
  Clock,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileCheck,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pusaka-800 to-pusaka-900 rounded-3xl p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur inline-block mb-3">
            Trah Silsilah Aktif
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">Bani Kartosoedirjo</h1>
          <p className="mt-2 text-pusaka-100 text-sm leading-relaxed">
            Pohon silsilah keluarga besar telah terdokumentasi hingga 4 generasi.
            Lakukan verifikasi bukti sumber dan jelajahi hubungan kekeluargaan secara kolaboratif.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/pohon"
              className="px-5 py-2.5 rounded-xl bg-white text-pusaka-900 font-bold text-sm shadow hover:bg-pusaka-50 transition-all flex items-center space-x-2"
            >
              <GitFork className="w-4 h-4 text-pusaka-700" />
              <span>Buka Pohon Keluarga</span>
            </Link>
            <Link
              href="/individu/baru"
              className="px-5 py-2.5 rounded-xl bg-pusaka-700/80 hover:bg-pusaka-700 text-white font-semibold text-sm transition-all flex items-center space-x-2"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Tambah Individu Baru</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-pusaka-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-pusaka-600 font-medium">Total Anggota Silsilah</span>
            <p className="text-2xl font-bold text-pusaka-900">13</p>
            <span className="text-[11px] text-emerald-600 font-medium">4 Generasi tercatat</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pusaka-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0">
            <GitFork className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-pusaka-600 font-medium">Serikat Pernikahan</span>
            <p className="text-2xl font-bold text-pusaka-900">5</p>
            <span className="text-[11px] text-purple-600 font-medium">Terverifikasi akta/buku</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pusaka-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-pusaka-600 font-medium">Arsip Dokumen Sumber</span>
            <p className="text-2xl font-bold text-pusaka-900">2</p>
            <span className="text-[11px] text-amber-700 font-medium">Kraton & Catatan Sipil</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-pusaka-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-pusaka-600 font-medium">Klaim Terverifikasi</span>
            <p className="text-2xl font-bold text-pusaka-900">100%</p>
            <span className="text-[11px] text-emerald-600 font-medium">Status konsensus diterima</span>
          </div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Directory List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-pusaka-200/80 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-pusaka-900">Leluhur Utama & Tokoh Kunci</h2>
              <p className="text-xs text-pusaka-600">Generasi awal yang menjadi akar keluarga besar</p>
            </div>
            <Link
              href="/direktori"
              className="text-xs font-semibold text-pusaka-800 hover:text-pusaka-900 flex items-center space-x-1"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-pusaka-100">
            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-pusaka-100 flex items-center justify-center font-bold text-pusaka-800 text-sm">
                  MK
                </div>
                <div>
                  <h3 className="text-sm font-bold text-pusaka-900">Raden Mas Kartosoedirjo</h3>
                  <span className="text-xs text-pusaka-600">1885 – 1952 (Leluhur Utama / Akar Keluarga)</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pusaka-100 text-pusaka-800 text-[11px] font-semibold">
                Gen 1
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-pusaka-100 flex items-center justify-center font-bold text-pusaka-800 text-sm">
                  SA
                </div>
                <div>
                  <h3 className="text-sm font-bold text-pusaka-900">Raden Ajeng Siti Aminah</h3>
                  <span className="text-xs text-pusaka-600">1890 – 1940 (Istri Pertama)</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pusaka-100 text-pusaka-800 text-[11px] font-semibold">
                Gen 1
              </span>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-pusaka-100 flex items-center justify-center font-bold text-pusaka-800 text-sm">
                  BS
                </div>
                <div>
                  <h3 className="text-sm font-bold text-pusaka-900">Bambang Soedirjo</h3>
                  <span className="text-xs text-pusaka-600">1915 – 1988 (Anak Pertama)</span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-pusaka-100 text-pusaka-800 text-[11px] font-semibold">
                Gen 2
              </span>
            </div>
          </div>
        </div>

        {/* Info & Activity Sidebar */}
        <div className="bg-white rounded-2xl border border-pusaka-200/80 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-pusaka-900 mb-2">Panduan Pengisian Silsilah</h2>
            <p className="text-xs text-pusaka-700 leading-relaxed">
              Setiap penambahan data relasi orang tua-anak secara otomatis dilindungi validasi anti-siklus.
              Gunakan fitur Sumber Informasi untuk mengunggah salinan akta atau catatan buku trah keluarga.
            </p>

            <div className="mt-6 p-4 rounded-xl bg-pusaka-50 border border-pusaka-200 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-pusaka-800">
                <FileCheck className="w-4 h-4 text-pusaka-700" />
                <span>Pencatatan Berbasis Klaim</span>
              </div>
              <p className="text-[11px] text-pusaka-600 leading-normal">
                Bila ada keraguan tahun lahir, gunakan opsi &ldquo;Perkiraan&rdquo; tanpa mengarang tanggal pasti.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-pusaka-200">
            <Link
              href="/kontribusi"
              className="w-full py-2.5 px-4 rounded-xl border border-pusaka-300 text-pusaka-800 hover:bg-pusaka-50 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Tinjau Usulan Perubahan</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

