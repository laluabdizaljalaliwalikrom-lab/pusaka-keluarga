"use client";

import { useState } from "react";
import {
  FolderIcon,
  SearchIcon,
  PlusIcon,
  DocsIcon,
  CheckCircleIcon,
  CalenderIcon,
  CloseIcon,
} from "@/components/icons/tailadmin-icons";

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
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
            Repositori Sumber & Arsip Bukti
          </h1>
          <p className="text-theme-sm text-gray-500 mt-0.5">
            Dokumentasi akta kelahiran, naskah trah, surat nikah, dan kutipan rujukan fakta otentik
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition self-start sm:self-auto cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Tambah Dokumen Sumber</span>
        </button>
      </div>

      {/* Search Bar (TailAdmin 2.4 Style) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-theme-xs flex items-center">
        <div className="relative flex-1">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul dokumen sumber, penulis, atau repositori..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
          />
        </div>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-theme-xs hover:shadow-theme-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-full bg-warning-50 text-warning-600 text-xs font-semibold">
                  {source.source_type}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  Mendukung {source.claims_count} klaim
                </span>
              </div>

              <h2 className="text-base font-bold text-gray-900 leading-snug">{source.title}</h2>

              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <DocsIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Pencatat / Penulis: <strong className="text-gray-800">{source.author || "Tidak disebutkan"}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalenderIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Tahun Dokumen: <strong className="text-gray-800">{source.publication_date || "Tidak diketahui"}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <FolderIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Lokasi Arsip: <strong className="text-gray-800">{source.repository}</strong></span>
                </div>
              </div>

              {source.citation_text && (
                <div className="mt-3 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700">
                  <span className="font-semibold block text-xs text-gray-500 mb-1">
                    Catatan Kutipan Rujukan:
                  </span>
                  <p className="leading-relaxed">{source.citation_text}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-700">
              <span className="text-success-600 flex items-center gap-1.5">
                <CheckCircleIcon className="w-4 h-4 text-success-500" />
                <span>Dokumen Sah & Terverifikasi</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-lg w-full p-6 shadow-theme-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Catat Dokumen Sumber Baru</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSource} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">
                  Judul Sumber / Dokumen <span className="text-error-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Buku Silsilah Trah, Akta Kelahiran No..."
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5">Penulis / Pencatat</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nama pencatat atau instansi"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 mb-1.5">Tahun Dokumen</label>
                  <input
                    type="text"
                    value={pubDate}
                    onChange={(e) => setPubDate(e.target.value)}
                    placeholder="Contoh: 1935"
                    className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Jenis Sumber</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 cursor-pointer"
                >
                  <option value="Buku Silsilah (Family Book)">Buku Silsilah (Family Book)</option>
                  <option value="Akta Kelahiran (Birth Certificate)">Akta Kelahiran (Birth Certificate)</option>
                  <option value="Buku Nikah / Akta Perkawinan">Buku Nikah / Akta Perkawinan</option>
                  <option value="Surat Keterangan Kematian">Surat Keterangan Kematian</option>
                  <option value="Wawancara Lisan">Wawancara Lisan (Oral History)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Lokasi Repositori / Penyimpanan</label>
                <input
                  type="text"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="Contoh: Arsip Nasional, Lemari Keluarga Solo"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Teks Kutipan / Penjelasan</label>
                <textarea
                  rows={3}
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="Kutipan relevan yang membuktikan hubungan kekeluargaan..."
                  className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
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
