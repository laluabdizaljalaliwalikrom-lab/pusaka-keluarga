import Link from "next/link";
import {
  GroupIcon,
  BoxIconLine,
  BoxCubeIcon,
  FolderIcon,
  CheckCircleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  ChevronDownIcon,
} from "@/components/icons/tailadmin-icons";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header / Breadcrumb - TailAdmin Style */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
            Dashboard Silsilah
          </h1>
          <p className="text-theme-sm text-gray-500 mt-0.5">
            Ringkasan data keturunan, verifikasi sumber dokumen, dan struktur pohon keluarga
          </p>
        </div>
        <div className="flex items-center gap-2 text-theme-xs font-medium text-gray-500">
          <Link href="/dashboard" className="hover:text-brand-500 transition">
            Trah
          </Link>
          <span>/</span>
          <span className="text-brand-500 font-semibold">
            Bani Kartowidjojo
          </span>
        </div>
      </div>

      {/* Welcome Banner Card - TailAdmin 2.4 Style */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-success-50 text-success-600 border border-success-100 text-xs font-semibold mb-3">
              <CheckCircleIcon className="w-4 h-4 text-success-600" />
              <span>Trah Terverifikasi Resmi • 4 Generasi</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Keluarga Besar Bani Kartowidjojo
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed">
              Arsip silsilah terpusat yang didokumentasikan berdasarkan naskah Kasunanan Surakarta dan akta Burgerlijke Stand.
              Dilengkapi perlindungan integritas graf anti-siklus (DAG) dan konsensus bukti primer.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/pohon"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
            >
              <BoxCubeIcon className="w-5 h-5 text-white" />
              <span>Buka Pohon Silsilah</span>
            </Link>
            <Link
              href="/individu/baru"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-900 transition"
            >
              <PlusIcon className="w-3.5 h-3.5 text-gray-500" />
              <span>Tambah Anggota</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 TailAdmin 2.4 Metric Cards (EcommerceMetrics replica) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
            <GroupIcon className="h-6 w-6 text-gray-800" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500">Total Anggota</span>
              <h4 className="mt-2 text-title-sm font-bold text-gray-900">13</h4>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-50 text-success-600">
              <ArrowUpIcon className="h-3 w-3 text-success-600" />
              4 Gen
            </span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
            <BoxIconLine className="h-6 w-6 text-gray-800" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500">Pernikahan Tercatat</span>
              <h4 className="mt-2 text-title-sm font-bold text-gray-900">5</h4>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-brand-50 text-brand-600">
              Monogami & Poligini
            </span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
            <FolderIcon className="h-6 w-6 text-gray-800" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500">Dokumen Sumber</span>
              <h4 className="mt-2 text-title-sm font-bold text-gray-900">2</h4>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-warning-50 text-warning-600">
              Arsip Resmi
            </span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-800">
            <CheckCircleIcon className="h-6 w-6 text-gray-800" />
          </div>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <span className="text-sm text-gray-500">Akurasi Verifikasi</span>
              <h4 className="mt-2 text-title-sm font-bold text-gray-900">100%</h4>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium bg-success-50 text-success-600">
              Konsensus Bukti
            </span>
          </div>
        </div>
      </div>

      {/* Main Two-Column TailAdmin Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Data Table of Key Ancestors (RecentOrders replica) */}
        <div className="lg:col-span-2 overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-5 pb-4 sm:px-6 shadow-theme-xs">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                Tokoh Leluhur & Generasi Pancer
              </h3>
              <p className="text-theme-xs text-gray-500">
                Generasi awal yang menjadi akar trah keluarga besar
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/direktori"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3.5 py-2 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-900 transition"
              >
                <span>Buka Direktori</span>
                <ArrowUpIcon className="w-3 h-3 rotate-45 text-gray-600" />
              </Link>
            </div>
          </div>

          {/* Clean Data Table */}
          <div className="max-w-full overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="border-y border-gray-100 bg-gray-50/50">
                <tr>
                  <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama Anggota
                  </th>
                  <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                    Generasi
                  </th>
                  <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masa Hidup
                  </th>
                  <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                    Asal Tempat
                  </th>
                  <th className="py-3 px-3 text-end text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                <tr className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-3 font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-semibold text-xs border border-brand-100">
                        RM
                      </div>
                      <div>
                        <span className="block leading-tight">Raden Mas Kartosoedirjo</span>
                        <span className="block text-xs text-gray-400 font-normal">Mbah Karto (Akar Trah)</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-brand-50 text-brand-600">
                      Gen 1 (Pancer)
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">1885 – 1952</td>
                  <td className="py-3.5 px-3 text-gray-500">Surakarta (Solo)</td>
                  <td className="py-3.5 px-3 text-end">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000001"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition"
                    >
                      <span>Profil</span>
                      <ArrowUpIcon className="w-3 h-3 rotate-45 text-brand-500" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-3 font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600 font-semibold text-xs border border-pink-100">
                        RA
                      </div>
                      <div>
                        <span className="block leading-tight">Raden Ajeng Siti Aminah</span>
                        <span className="block text-xs text-gray-400 font-normal">Istri Pertama</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Gen 1
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">1890 – 1940</td>
                  <td className="py-3.5 px-3 text-gray-500">Surakarta (Solo)</td>
                  <td className="py-3.5 px-3 text-end">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000002"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition"
                    >
                      <span>Profil</span>
                      <ArrowUpIcon className="w-3 h-3 rotate-45 text-brand-500" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-3 font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-600 font-semibold text-xs border border-pink-100">
                        NR
                      </div>
                      <div>
                        <span className="block leading-tight">Nyi Mas Rukmini</span>
                        <span className="block text-xs text-gray-400 font-normal">Istri Kedua</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Gen 1
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">1905 – 1975</td>
                  <td className="py-3.5 px-3 text-gray-500">Yogyakarta</td>
                  <td className="py-3.5 px-3 text-end">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000003"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition"
                    >
                      <span>Profil</span>
                      <ArrowUpIcon className="w-3 h-3 rotate-45 text-brand-500" />
                    </Link>
                  </td>
                </tr>

                <tr className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-3 font-semibold text-gray-900">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-semibold text-xs border border-blue-100">
                        BS
                      </div>
                      <div>
                        <span className="block leading-tight">Bambang Soedirjo</span>
                        <span className="block text-xs text-gray-400 font-normal">Anak Sulung</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      Gen 2
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-gray-600">1915 – 1988</td>
                  <td className="py-3.5 px-3 text-gray-500">Surakarta (Solo)</td>
                  <td className="py-3.5 px-3 text-end">
                    <Link
                      href="/individu/b0000000-0000-0000-0000-000000000004"
                      className="inline-flex items-center gap-1 text-sm font-medium text-brand-500 hover:text-brand-600 transition"
                    >
                      <span>Profil</span>
                      <ArrowUpIcon className="w-3 h-3 rotate-45 text-brand-500" />
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
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Komposisi Generasi
            </h3>
            <p className="text-theme-xs text-gray-500 mb-5">
              Penyebaran anggota trah per tingkat generasi
            </p>

            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between mb-1.5 font-medium text-xs">
                  <span className="text-gray-700">Gen 1: Kakek Buyut & Nenek</span>
                  <span className="font-semibold text-gray-900">3 orang (23%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-500 h-2 rounded-full" style={{ width: "23%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium text-xs">
                  <span className="text-gray-700">Gen 2: Putra & Putri</span>
                  <span className="font-semibold text-gray-900">5 orang (38%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-brand-600 h-2 rounded-full" style={{ width: "38%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium text-xs">
                  <span className="text-gray-700">Gen 3: Cucu</span>
                  <span className="font-semibold text-gray-900">3 orang (23%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-light-500 h-2 rounded-full" style={{ width: "23%" }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 font-medium text-xs">
                  <span className="text-gray-700">Gen 4: Cicit (Generasi Muda)</span>
                  <span className="font-semibold text-gray-900">2 orang (16%)</span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-success-500 h-2 rounded-full" style={{ width: "16%" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick System Integrity Status */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              Integritas & Audit Trah
            </h3>
            <p className="text-theme-xs text-gray-500 mb-4">
              Status verifikasi graf dan konsistensi silsilah
            </p>

            <ul className="space-y-2.5 text-xs">
              <li className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-600 font-medium">Validasi Siklus (DAG)</span>
                <span className="font-semibold text-success-600 bg-success-50 px-2.5 py-0.5 rounded-full">
                  Bebas Siklus (Acyclic)
                </span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-600 font-medium">Usulan Review</span>
                <span className="font-semibold text-warning-600 bg-warning-50 px-2.5 py-0.5 rounded-full">
                  2 Menunggu
                </span>
              </li>
              <li className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <span className="text-gray-600 font-medium">Hak Akses Trah</span>
                <span className="font-semibold text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-full">
                  Private (Supabase RLS)
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
