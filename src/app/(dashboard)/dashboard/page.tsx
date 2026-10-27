import Link from "next/link";
import {
  Users,
  GitFork,
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  Sparkles,
  Award,
  CheckCircle2,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Silsilah
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Ringkasan data keturunan, verifikasi sumber, dan struktur pohon keluarga
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span>Trah</span>
          <span>/</span>
          <span className="text-primary font-semibold">Bani Kartosoedirjo</span>
        </div>
      </div>

      {/* Welcome Banner Card (TailAdmin Style) */}
      <div className="rounded-xl border border-stroke bg-white p-6 shadow-default relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Trah Terverifikasi Resmi • 4 Generasi</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-800">
              Keluarga Besar Bani Kartosoedirjo
            </h2>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              Arsip silsilah terpusat yang didokumentasikan berdasarkan naskah Kasunanan Surakarta dan akta Burgerlijke Stand.
              Dilengkapi perlindungan integritas graf anti-siklus dan bukti klaim primer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/pohon"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors"
            >
              <GitFork className="w-4 h-4" />
              <span>Buka Pohon Silsilah</span>
            </Link>
            <Link
              href="/individu/baru"
              className="inline-flex items-center gap-2 rounded-lg border border-stroke bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              <Plus className="w-4 h-4 text-slate-500" />
              <span>Tambah Anggota</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 TailAdmin Stat Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {/* Metric 1 */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Individu
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-primary">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">13</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span>4 Generasi tercatat lengkap</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Serikat Pernikahan
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <GitFork className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">5</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Poligini & Monogami tercatat</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Arsip & Dokumen Sumber
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FolderArchive className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">2</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-700 font-semibold">
              <span>Buku Trah & Akta Kelahiran</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-stroke bg-white p-5 shadow-default flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Validasi Bukti Klaim
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-800">100%</h3>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
              <span>Konsensus bukti terverifikasi</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Column TailAdmin Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Data Table of Key Ancestors */}
        <div className="lg:col-span-2 rounded-xl border border-stroke bg-white shadow-default overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-stroke">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Tokoh Leluhur & Akar Generasi
              </h3>
              <p className="text-xs text-slate-500">
                Data generasi awal yang menjadi fondasi utama keluarga besar
              </p>
            </div>
            <Link
              href="/direktori"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary-hover"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Clean Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-stroke text-slate-600 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap</th>
                  <th className="py-3 px-4">Generasi</th>
                  <th className="py-3 px-4">Masa Hidup</th>
                  <th className="py-3 px-4">Tempat Lahir</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stroke text-slate-700">
                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        RM
                      </div>
                      <div>
                        <span>Raden Mas Kartosoedirjo</span>
                        <span className="block text-[11px] text-slate-400 font-normal">Mbah Karto</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-primary/10 text-primary">
                      Gen 1 (Pancer)
                    </span>
                  </td>
                  <td className="py-3 px-4">1885 – 1952</td>
                  <td className="py-3 px-4 text-slate-500">Surakarta (Solo)</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000001"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <span>Profil</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-[10px]">
                        RA
                      </div>
                      <div>
                        <span>Raden Ajeng Siti Aminah</span>
                        <span className="block text-[11px] text-slate-400 font-normal">Istri Pertama</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Gen 1
                    </span>
                  </td>
                  <td className="py-3 px-4">1890 – 1940</td>
                  <td className="py-3 px-4 text-slate-500">Surakarta (Solo)</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000002"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <span>Profil</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-700 flex items-center justify-center font-bold text-[10px]">
                        NR
                      </div>
                      <div>
                        <span>Nyi Mas Rukmini</span>
                        <span className="block text-[11px] text-slate-400 font-normal">Istri Kedua</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Gen 1
                    </span>
                  </td>
                  <td className="py-3 px-4">1905 – 1975</td>
                  <td className="py-3 px-4 text-slate-500">Yogyakarta</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000003"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <span>Profil</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        BS
                      </div>
                      <div>
                        <span>Bambang Soedirjo</span>
                        <span className="block text-[11px] text-slate-400 font-normal">Anak Sulung</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Gen 2
                    </span>
                  </td>
                  <td className="py-3 px-4">1915 – 1988</td>
                  <td className="py-3 px-4 text-slate-500">Surakarta (Solo)</td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000004"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <span>Profil</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Generation Breakdown & Integrity */}
        <div className="space-y-6">
          {/* Generation Progress Card */}
          <div className="rounded-xl border border-stroke bg-white p-5 shadow-default">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Komposisi Generasi
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Penyebaran anggota trah per tingkat generasi
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span className="text-slate-700">Gen 1: Kakek Buyut & Nenek</span>
                  <span className="font-bold text-slate-900">3 orang (23%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "23%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span className="text-slate-700">Gen 2: Putra & Putri</span>
                  <span className="font-bold text-slate-900">5 orang (38%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "38%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span className="text-slate-700">Gen 3: Cucu</span>
                  <span className="font-bold text-slate-900">3 orang (23%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-2 rounded-full" style={{ width: "23%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1 font-medium">
                  <span className="text-slate-700">Gen 4: Cicit (Generasi Muda)</span>
                  <span className="font-bold text-slate-900">2 orang (16%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-2 rounded-full" style={{ width: "16%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick System Integrity Status */}
          <div className="rounded-xl border border-stroke bg-white p-5 shadow-default">
            <h3 className="text-sm font-bold text-slate-800 mb-1">
              Integritas & Audit Trah
            </h3>
            <p className="text-xs text-slate-500 mb-3">
              Status verifikasi graf dan konsistensi silsilah
            </p>

            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Validasi Siklus (DAG)</span>
                <span className="font-semibold text-emerald-600">Bebas Siklus (Acyclic)</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Usulan Menunggu Review</span>
                <span className="font-semibold text-slate-700">0 usulan baru</span>
              </li>
              <li className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                <span className="text-slate-600">Hak Akses Trah</span>
                <span className="font-semibold text-primary">Private (Enkripsi RLS)</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
