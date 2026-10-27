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
  ExternalLink,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

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
    parents: [],
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
        type: "Tanggal Lahir",
        predicate: "Kelahiran diperkirakan sekitar tahun 1885",
        status: "diterima",
        evidence_quality: "direct",
        source_title: "Buku Silsilah Kulawarga Kasunanan Surakarta",
        source_ref: "Hal. 112 Kolom B",
      },
      {
        id: "clm-2",
        type: "Tahun Wafat",
        predicate: "Meninggal dunia tahun 1952 di Surakarta",
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
  const [activeTab, setActiveTab] = useState<"relasi" | "klaim">("relasi");

  return (
    <div className="space-y-6">
      {/* Top Bar Nav */}
      <div className="flex items-center justify-between">
        <Link
          href="/direktori"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Direktori</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/pohon?focus=${person.id}`}
            className="px-3.5 py-2 rounded-lg border border-stroke bg-white text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors inline-flex items-center gap-1.5 shadow-xs"
          >
            <GitFork className="w-4 h-4 text-primary" />
            <span>Pusatkan di Pohon</span>
          </Link>
        </div>
      </div>

      {/* Main Profile Header Card (TailAdmin) */}
      <div className="rounded-xl border border-stroke bg-white p-6 md:p-8 shadow-default">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary text-xl md:text-2xl shrink-0">
            {person.primary_name
              .split(" ")
              .map((n: string) => n[0])
              .slice(0, 2)
              .join("")}
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {person.primary_name}
              </h1>
              {person.nickname && (
                <span className="px-2.5 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                  &ldquo;{person.nickname}&rdquo;
                </span>
              )}
            </div>

            {/* Alternates */}
            {person.alternate_names && person.alternate_names.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-0.5">
                <span className="text-slate-400 font-medium text-[11px]">Nama Gelar:</span>
                {person.alternate_names.map((alt: any, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-medium"
                  >
                    {alt.name} ({alt.type})
                  </span>
                ))}
              </div>
            )}

            {/* Meta facts */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-600 pt-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  Lahir: <strong className="text-slate-800">{formatDate(null, person.birth_date_year, person.birth_date_type, person.birth_date_text)}</strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Tempat Lahir: <strong className="text-slate-800">{person.birth_place || "Tidak diketahui"}</strong></span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  Wafat: <strong className="text-slate-800">{person.is_living ? "Masih Hidup" : formatDate(null, person.death_date_year, person.death_date_type)}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {person.bio && (
          <div className="mt-6 pt-5 border-t border-stroke">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Biografi & Catatan Sejarah
            </h3>
            <p className="text-xs md:text-sm text-slate-700 leading-relaxed">{person.bio}</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stroke pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("relasi")}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeTab === "relasi"
              ? "bg-primary text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          Hubungan Keluarga ({person.spouses.length} Pasangan, {person.spouses.reduce((acc: number, s: any) => acc + s.children.length, 0)} Anak)
        </button>

        <button
          onClick={() => setActiveTab("klaim")}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "klaim"
              ? "bg-primary text-white shadow-xs"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Klaim Fakta & Bukti Sumber ({person.claims.length})</span>
        </button>
      </div>

      {/* Tab 1: Relasi Keluarga */}
      {activeTab === "relasi" && (
        <div className="space-y-4">
          {person.spouses.map((spouse: any, idx: number) => (
            <div
              key={idx}
              className="rounded-xl border border-stroke bg-white p-5 md:p-6 shadow-default space-y-4"
            >
              <div className="flex items-start justify-between border-b border-stroke pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 flex items-center justify-center font-bold text-xs">
                    P{idx + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {spouse.union_type}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900">{spouse.name}</h3>
                    <span className="text-xs text-slate-500">
                      Menikah tahun {spouse.year} di {spouse.place}
                    </span>
                  </div>
                </div>
                <Link
                  href={`/individu/${spouse.id}`}
                  className="text-xs text-primary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  <span>Profil Pasangan</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Children from this marriage */}
              <div>
                <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Anak-anak dari Serikat Ini ({spouse.children.length}):
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {spouse.children.map((child: any) => (
                    <Link
                      key={child.id}
                      href={`/individu/${child.id}`}
                      className="p-3 rounded-lg border border-stroke bg-slate-50/60 hover:bg-slate-100 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">{child.name}</p>
                        <span className="text-[11px] text-slate-500">Lahir: {child.year}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Klaim & Bukti Sumber */}
      {activeTab === "klaim" && (
        <div className="space-y-3">
          {person.claims.map((claim: any) => (
            <div
              key={claim.id}
              className="rounded-xl border border-stroke bg-white p-5 shadow-default space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    {claim.type}
                  </span>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">{claim.predicate}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Diterima</span>
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-stroke text-xs text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                  <span>Rujukan Sumber:</span>
                </div>
                <p className="text-slate-800 pl-5 font-medium">{claim.source_title}</p>
                <p className="text-slate-500 pl-5 text-[11px]">Kutipan: {claim.source_ref}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
