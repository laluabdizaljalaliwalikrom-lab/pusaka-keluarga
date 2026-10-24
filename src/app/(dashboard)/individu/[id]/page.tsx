"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  User,
  GitFork,
  FileText,
  Calendar,
  MapPin,
  Edit,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data detail tersinkronisasi dengan Trah Kartosoedirjo
const PERSON_DATA: Record<string, any> = {
  "b0000000-0000-0000-0000-000000000001": {
    id: "b0000000-0000-0000-0000-000000000001",
    primary_name: "Raden Mas Kartosoedirjo",
    nickname: "Mbah Karto",
    gender: "male",
    is_living: false,
    birth_date_year: 1885,
    birth_date_type: "APPROXIMATE",
    birth_date_text: "Sekitar tahun 1885 era Kasunanan Surakarta",
    birth_place: "Surakarta (Solo), Jawa Tengah",
    death_date_year: 1952,
    death_date_type: "EXACT",
    death_place: "Surakarta (Solo), Jawa Tengah",
    bio: "Tokoh pendidik dan sesepuh keluarga di Surakarta. Dikenal memegang teguh adat keraton serta mencatatkan silsilah keluarga besar secara cermat.",
    alternate_names: [
      { name: "K. R. T. Kartodiningrat", type: "Gelar Keraton", notes: "Gelar kehormatan keraton Kasunanan" },
      { name: "Kartopawiro", type: "Nama Masa Muda", notes: "Nama sebelum menikah" },
    ],
    parents: [], // Akar silsilah (belum ada data orang tua yang tercatat)
    spouses: [
      {
        id: "b0000000-0000-0000-0000-000000000002",
        name: "Raden Ajeng Siti Aminah",
        union_type: "Pernikahan Pertama",
        year: 1912,
        place: "Kraton Solo",
        children: [
          { id: "b0000000-0000-0000-0000-000000000004", name: "Bambang Soedirjo", year: 1915 },
          { id: "b0000000-0000-0000-0000-000000000006", name: "Sri Wahyuni", year: 1922 },
        ],
      },
      {
        id: "b0000000-0000-0000-0000-000000000003",
        name: "Nyi Mas Rukmini",
        union_type: "Pernikahan Kedua",
        year: 1941,
        place: "Yogyakarta",
        children: [
          { id: "b0000000-0000-0000-0000-000000000008", name: "Joko Pramono", year: 1942 },
        ],
      },
    ],
    claims: [
      {
        id: "clm-1",
        type: "Tahun Kelahiran",
        predicate: "Lahir sekitar tahun 1885 di Kasunanan Surakarta",
        status: "diterima",
        evidence_quality: "direct",
        source_title: "Buku Silsilah Kulawarga Kasunanan Surakarta (Sasana Pustaka, 1935)",
        source_ref: "Hal. 112 Kolom B",
      },
      {
        id: "clm-2",
        type: "Gelar Kehormatan",
        predicate: "Dianugerahi gelar K.R.T. Kartodiningrat oleh Sri Susuhunan Pakubuwana X",
        status: "diterima",
        evidence_quality: "direct",
        source_title: "Buku Silsilah Kulawarga Kasunanan Surakarta",
        source_ref: "Hal. 113",
      },
    ],
  },
};

export default function DetailIndividuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const person = PERSON_DATA[id] || PERSON_DATA["b0000000-0000-0000-0000-000000000001"];
  const [activeTab, setActiveTab] = useState<"relasi" | "klaim" | "linimasa">("relasi");

  return (
    <div className="space-y-6">
      {/* Top Bar Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/direktori"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-pusaka-700 hover:text-pusaka-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Direktori</span>
        </Link>

        <div className="flex items-center space-x-2">
          <Link
            href={`/pohon?focus=${person.id}`}
            className="px-3.5 py-2 rounded-xl border border-pusaka-300 text-pusaka-800 hover:bg-pusaka-50 text-xs font-semibold transition-all inline-flex items-center space-x-1.5"
          >
            <GitFork className="w-4 h-4 text-pusaka-700" />
            <span>Pusatkan di Pohon</span>
          </Link>
          <Link
            href={`/individu/${person.id}/edit`}
            className="px-3.5 py-2 rounded-xl bg-pusaka-800 text-white hover:bg-pusaka-900 text-xs font-semibold shadow-sm transition-all inline-flex items-center space-x-1.5"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Profil</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Header Card */}
      <div className="bg-white rounded-3xl border border-pusaka-200/80 p-6 md:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-pusaka-100 border border-pusaka-200 flex items-center justify-center font-bold text-pusaka-800 text-2xl shadow-inner shrink-0">
            {person.primary_name
              .split(" ")
              .map((n: string) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight">
                {person.primary_name}
              </h1>
              {person.nickname && (
                <span className="px-2.5 py-0.5 rounded-full bg-pusaka-100 text-pusaka-800 text-xs font-medium">
                  &ldquo;{person.nickname}&rdquo;
                </span>
              )}
            </div>

            {/* Alternates */}
            {person.alternate_names && person.alternate_names.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-pusaka-700">
                <span className="text-pusaka-500 font-medium">Nama/Gelar:</span>
                {person.alternate_names.map((alt: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 text-[11px]"
                  >
                    {alt.name} ({alt.type})
                  </span>
                ))}
              </div>
            )}

            {/* Meta facts */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-pusaka-700 pt-1">
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-pusaka-500" />
                <span>
                  Lahir: {formatDate(null, person.birth_date_year, person.birth_date_type, person.birth_date_text)}
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-pusaka-500" />
                <span>Tempat Lahir: {person.birth_place || "Tidak diketahui"}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Calendar className="w-4 h-4 text-pusaka-500" />
                <span>
                  Wafat: {person.is_living ? "Masih Hidup" : formatDate(null, person.death_date_year, person.death_date_type)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {person.bio && (
          <div className="mt-6 pt-6 border-t border-pusaka-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-pusaka-500 mb-1">
              Biografi & Catatan Sejarah
            </h3>
            <p className="text-sm text-pusaka-800 leading-relaxed">{person.bio}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-pusaka-200 space-x-6">
        <button
          onClick={() => setActiveTab("relasi")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "relasi"
              ? "border-pusaka-800 text-pusaka-900"
              : "border-transparent text-pusaka-500 hover:text-pusaka-800"
          }`}
        >
          Hubungan Keluarga ({person.spouses.length} Pasangan, {person.spouses.reduce((acc: number, s: any) => acc + s.children.length, 0)} Anak)
        </button>

        <button
          onClick={() => setActiveTab("klaim")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
            activeTab === "klaim"
              ? "border-pusaka-800 text-pusaka-900"
              : "border-transparent text-pusaka-500 hover:text-pusaka-800"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Klaim Fakta & Bukti Sumber ({person.claims.length})</span>
        </button>
      </div>

      {/* Tab 1: Relasi Keluarga */}
      {activeTab === "relasi" && (
        <div className="space-y-6">
          {/* Spouses & Children */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-pusaka-900">Serikat Pernikahan & Keturunan</h2>
            {person.spouses.map((spouse: any, idx: number) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-pusaka-200/80 p-6 shadow-sm space-y-4"
              >
                <div className="flex items-start justify-between border-b border-pusaka-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm">
                      P{idx + 1}
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-pusaka-500">
                        {spouse.union_type}
                      </span>
                      <h3 className="text-base font-bold text-pusaka-900">{spouse.name}</h3>
                      <span className="text-xs text-pusaka-600">
                        Menikah tahun {spouse.year} di {spouse.place}
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/individu/${spouse.id}`}
                    className="text-xs text-pusaka-800 font-semibold hover:underline inline-flex items-center space-x-1"
                  >
                    <span>Profil Pasangan</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Children from this marriage */}
                <div>
                  <h4 className="text-xs font-semibold text-pusaka-600 uppercase tracking-wider mb-2">
                    Anak-anak dari Ikatan Ini ({spouse.children.length}):
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {spouse.children.map((child: any) => (
                      <Link
                        key={child.id}
                        href={`/individu/${child.id}`}
                        className="p-3 rounded-xl border border-pusaka-200 bg-pusaka-50/50 hover:bg-pusaka-100/60 transition-colors flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-pusaka-900">{child.name}</p>
                          <span className="text-[11px] text-pusaka-600">Lahir: {child.year}</span>
                        </div>
                        <ArrowLeft className="w-3.5 h-3.5 text-pusaka-400 rotate-180" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Klaim & Bukti Sumber */}
      {activeTab === "klaim" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-pusaka-600">
              Pernyataan fakta historis individu diverifikasi secara independen oleh sumber rujukan.
            </p>
          </div>

          <div className="space-y-3">
            {person.claims.map((claim: any) => (
              <div
                key={claim.id}
                className="bg-white rounded-2xl border border-pusaka-200/80 p-5 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-pusaka-500 block">
                      {claim.type}
                    </span>
                    <p className="text-sm font-bold text-pusaka-900 mt-0.5">{claim.predicate}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Diterima</span>
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-pusaka-50 border border-pusaka-200/60 text-xs text-pusaka-800 space-y-1">
                  <div className="flex items-center space-x-2 font-semibold">
                    <FileText className="w-4 h-4 text-pusaka-600" />
                    <span>Rujukan Sumber:</span>
                  </div>
                  <p className="text-pusaka-700 pl-6">{claim.source_title}</p>
                  <p className="text-pusaka-500 pl-6 text-[11px]">Kutipan: {claim.source_ref}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

