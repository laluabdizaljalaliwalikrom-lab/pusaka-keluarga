"use client";

import { useState } from "react";
import {
  FolderArchive,
  Search,
  Plus,
  BookOpen,
  FileCheck,
  ExternalLink,
  MapPin,
  Calendar,
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
      s.author.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    const newSrc = {
      id: "src-" + Date.now(),
      title,
      author,
      publication_date: pubDate,
      repository,
      source_type: sourceType,
      citation_text: citation,
      claims_count: 0,
    };
    setSources([newSrc, ...sources]);
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
          <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight">
            Repositori Sumber Informasi & Arsip
          </h1>
          <p className="text-xs text-pusaka-600 mt-1">
            Dokumentasi akta, arsip buku silsilah, wawancara lisan, dan catatan bukti rujukan fakta
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-pusaka-800 text-white text-xs font-semibold shadow hover:bg-pusaka-900 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Sumber Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-pusaka-200/80 shadow-sm flex items-center">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-pusaka-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul dokumen sumber atau penulis/penerbit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
          />
        </div>
      </div>

      {/* Source Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="bg-white rounded-2xl border border-pusaka-200/80 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                  {source.source_type}
                </span>
                <span className="text-xs text-pusaka-500 font-medium">
                  Mendukung {source.claims_count} klaim
                </span>
              </div>

              <h2 className="text-base font-bold text-pusaka-900 leading-snug">{source.title}</h2>

              <div className="space-y-1.5 text-xs text-pusaka-700">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-pusaka-500" />
                  <span>Penulis / Penerbit: {source.author || "Tidak disebutkan"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-pusaka-500" />
                  <span>Tahun / Waktu Terbit: {source.publication_date || "Tidak diketahui"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-pusaka-500" />
                  <span>Lokasi Arsip / Repositori: {source.repository}</span>
                </div>
              </div>

              {source.citation_text && (
                <div className="mt-3 p-3 rounded-xl bg-pusaka-50 border border-pusaka-200/60 text-xs text-pusaka-800">
                  <span className="font-semibold block text-[11px] text-pusaka-600 mb-0.5">
                    Catatan Kutipan:
                  </span>
                  <p className="leading-relaxed">{source.citation_text}</p>
                </div>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-pusaka-100 flex items-center justify-between text-xs font-semibold text-pusaka-800">
              <span className="text-emerald-700 flex items-center space-x-1">
                <FileCheck className="w-4 h-4" />
                <span>Dokumen Sah & Terverifikasi</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-pusaka-900">Catat Dokumen Sumber Baru</h3>
            <form onSubmit={handleAddSource} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">
                  Judul Sumber / Dokumen <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Misal: Buku Silsilah Trah, Akta Kelahiran No..."
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-pusaka-800 mb-1">Penulis / Pencatat</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Nama pencatat atau instansi"
                    className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-pusaka-800 mb-1">Tahun Dokumen</label>
                  <input
                    type="text"
                    value={pubDate}
                    onChange={(e) => setPubDate(e.target.value)}
                    placeholder="Contoh: 1945"
                    className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">Tipe Sumber</label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 bg-white"
                >
                  <option value="Buku Silsilah (Family Book)">Buku Silsilah (Family Book)</option>
                  <option value="Akta Kelahiran (Birth Certificate)">Akta Kelahiran (Birth Certificate)</option>
                  <option value="Akta Kematian (Death Certificate)">Akta Kematian (Death Certificate)</option>
                  <option value="Surat Nikah (Marriage Certificate)">Surat Nikah (Marriage Certificate)</option>
                  <option value="Sejarah Lisan / Wawancara (Oral History)">Sejarah Lisan / Wawancara (Oral History)</option>
                  <option value="Foto / Prasasti Nisan (Grave Stone / Photo)">Foto / Prasasti Nisan (Grave Stone / Photo)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">Lokasi Fisik / Repositori Simpan</label>
                <input
                  type="text"
                  value={repository}
                  onChange={(e) => setRepository(e.target.value)}
                  placeholder="Misal: Lemari arsip keluarga di Solo, ANRI Jakarta"
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">Kutipan Rujukan / Halaman</label>
                <textarea
                  rows={2}
                  value={citation}
                  onChange={(e) => setCitation(e.target.value)}
                  placeholder="Halaman atau rincian teks kutipan yang relevan..."
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-pusaka-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-pusaka-200 text-pusaka-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pusaka-800 text-white font-bold"
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

