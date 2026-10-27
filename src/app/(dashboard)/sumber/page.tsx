"use client";

import { useState } from "react";
import {
  FolderArchive,
  Search,
  Plus,
  BookOpen,
  FileCheck,
  Calendar,
  MapPin,
  X,
} from "lucide-react";

const INITIAL_SOURCES = [
  {
    id: "e0000000-0000-0000-0000-000000000001",
    title: "Buku Silsilah Kulawarga Kasunanan Surakarta",
    author: "Sasana Pustaka Karaton Surakarta",
    publication_date: "1935",
    repository: "Perpustakaan Kraton Surakarta No. Reg 442/S",
    source_type: "Buku Silsilah (Family Book)",
    citation_text: "Halaman 112-114 mencatat silsilah R. M. Kartosoedirjo dan keturunan pertamanya.",
    claims_count: 2,
  },
  {
    id: "e0000000-0000-0000-0000-000000000002",
    title: "Akta Catatan Sipil Hindia Belanda (Burgerlijke Stand)",
    author: "Gemeente Soerabaja",
    publication_date: "1915",
    repository: "Arsip Nasional Republik Indonesia (ANRI)",
    source_type: "Akta Kelahiran (Birth Certificate)",
    citation_text: "Kutipan akta kelahiran Bambang Soedirjo No. 89/1915 tertanggal 12 Mei 1915.",
    claims_count: 1,
  },
];

export default function SumberPage() {
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState(INITIAL_SOURCES);
  const [showAddModal, setShowAddModal] = useState(false);

  // New source form state
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [pubDate, setPubDate] = useState("");
  const [repository, setRepository] = useState("");
  const [sourceType, setSourceType] = useState("Buku Silsilah (Family Book)");
  const [citation, setCitation] = useState("");

  const filteredSources = sources.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      (s.author && s.author.toLowerCase().includes(search.toLowerCase())) ||
      (s.repository && s.repository.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newSource = {
      id: "e0000000-0000-0000-0000-" + String(Date.now()).slice(-12),
      title,
      author,
      publication_date: pubDate,
      repository,
      source_type: sourceType,
      citation_text: citation,
      claims_count: 0,
    };

    setSources([newSource, ...sources]);
    setShowAddModal(false);
    setTitle("");
    setAuthor("");
    setPubDate("");
    setRepository("");
    setCitation("");
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Repositori Sumber & Arsip Bukti
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dokumentasi akta kelahiran, naskah trah, surat nikah, dan kutipan rujukan fakta otentik
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sumber Baru</span>
        </button>
      </div>

      {/* Search Bar (TailAdmin Card) */}
      <div className="rounded-xl border border-stroke bg-white p-4 shadow-default flex items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul dokumen sumber, penulis, atau repositori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-stroke bg-transparent text-slate-800 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="rounded-xl border border-stroke bg-white p-6 shadow-default hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-semibold">
                  {source.source_type}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Mendukung {source.claims_count} klaim
                </span>
              </div>

              <h2 className="text-sm md:text-base font-bold text-slate-900 leading-snug">{source.title}</h2>

              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Pencatat / Penulis: <strong className="text-slate-800">{source.author || "Tidak disebutkan"}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Tahun Dokumen: <strong className="text-slate-800">{source.publication_date || "Tidak diketahui"}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Lokasi Arsip: <strong className="text-slate-800">{source.repository}</strong></span>
                </div>
              </div>

              {source.citation_text && (
                <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-stroke text-xs text-slate-700">
                  <span className="font-semibold block text-[11px] text-slate-500 mb-0.5">
                    Catatan Kutipan Rujukan:
                  </span>
                  <p className="leading-relaxed">{source.citation_text}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-stroke flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="text-emerald-600 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                <span>Dokumen Sah & Terverifikasi</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stroke max-w-lg w-full p-6 shadow-dropdown space-y-4">
            <div className="flex items-center justify-between border-b border-stroke pb-3">
              <h3 className="text-sm font-bold text-slate-800">Catat Dokumen Sumber Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Judul Sumber / Dokumen <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Buku Silsilah Trah, Akta Kelahiran No..."
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Penulis / Pencatat</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nama pencatat atau instansi"
                    className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tahun Dokumen</label>
                  <input
                    type="text"
                    value={pubDate}
                    onChange={(e) => setPubDate(e.target.value)}
                    placeholder="Contoh: 1935"
                    className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Jenis Sumber</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-white text-slate-800 outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Buku Silsilah (Family Book)">Buku Silsilah (Family Book)</option>
                  <option value="Akta Kelahiran (Birth Certificate)">Akta Kelahiran (Birth Certificate)</option>
                  <option value="Buku Nikah / Akta Perkawinan">Buku Nikah / Akta Perkawinan</option>
                  <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
                  <option value="Wawancara Lisan">Wawancara Lisan (Oral History)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Lokasi Repositori / Penyimpanan</label>
                <input
                  type="text"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="Contoh: Arsip Nasional, Lemari Keluarga Solo"
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Teks Kutipan / Penjelasan</label>
                <textarea
                  rows={3}
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="Kutipan relevan yang membuktikan hubungan kekeluargaan..."
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stroke">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-stroke bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-xs"
                >
                  Simpan Sumber
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
