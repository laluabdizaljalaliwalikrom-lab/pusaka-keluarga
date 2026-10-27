"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, ArrowUpRight, Users, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

const INITIAL_PERSONS = [
  {
    id: "b0000000-0000-0000-0000-000000000001",
    primary_name: "Raden Mas Kartosoedirjo",
    nickname: "Mbah Karto",
    gender: "male",
    is_living: false,
    birth_date_year: 1885,
    birth_date_type: "APPROXIMATE",
    death_date_year: 1952,
    death_date_type: "EXACT",
    generation: "Generasi 1",
    role_note: "Akar Trah (Kakek Buyut)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000002",
    primary_name: "Raden Ajeng Siti Aminah",
    nickname: "Mbah Aminah",
    gender: "female",
    is_living: false,
    birth_date_year: 1890,
    birth_date_type: "APPROXIMATE",
    death_date_year: 1940,
    death_date_type: "EXACT",
    generation: "Generasi 1",
    role_note: "Istri Pertama",
  },
  {
    id: "b0000000-0000-0000-0000-000000000003",
    primary_name: "Nyi Mas Rukmini",
    nickname: "Mbah Rukmini",
    gender: "female",
    is_living: false,
    birth_date_year: 1905,
    birth_date_type: "APPROXIMATE",
    death_date_year: 1975,
    death_date_type: "EXACT",
    generation: "Generasi 1",
    role_note: "Istri Kedua",
  },
  {
    id: "b0000000-0000-0000-0000-000000000004",
    primary_name: "Bambang Soedirjo",
    nickname: "Bambang",
    gender: "male",
    is_living: false,
    birth_date_year: 1915,
    birth_date_type: "EXACT",
    death_date_year: 1988,
    death_date_type: "EXACT",
    generation: "Generasi 2",
    role_note: "Anak Pertama (dari Istri 1)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000005",
    primary_name: "Dewi Anggraini",
    nickname: "Dewi",
    gender: "female",
    is_living: false,
    birth_date_year: 1920,
    birth_date_type: "EXACT",
    death_date_year: 1995,
    death_date_type: "EXACT",
    generation: "Generasi 2",
    role_note: "Istri Bambang Soedirjo",
  },
  {
    id: "b0000000-0000-0000-0000-000000000006",
    primary_name: "Sri Wahyuni",
    nickname: "Yuni",
    gender: "female",
    is_living: false,
    birth_date_year: 1922,
    birth_date_type: "EXACT",
    death_date_year: 2005,
    death_date_type: "EXACT",
    generation: "Generasi 2",
    role_note: "Anak Kedua (dari Istri 1)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000007",
    primary_name: "Raden Hartono",
    nickname: "Hartono",
    gender: "male",
    is_living: false,
    birth_date_year: 1918,
    birth_date_type: "EXACT",
    death_date_year: 1982,
    death_date_type: "EXACT",
    generation: "Generasi 2",
    role_note: "Suami Sri Wahyuni",
  },
  {
    id: "b0000000-0000-0000-0000-000000000008",
    primary_name: "Joko Pramono",
    nickname: "Joko",
    gender: "male",
    is_living: false,
    birth_date_year: 1942,
    birth_date_type: "EXACT",
    death_date_year: 2015,
    death_date_type: "EXACT",
    generation: "Generasi 2",
    role_note: "Anak dari Istri 2 (Rukmini)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000009",
    primary_name: "Hendra Soedirjo",
    nickname: "Hendra",
    gender: "male",
    is_living: false,
    birth_date_year: 1948,
    birth_date_type: "EXACT",
    death_date_year: 2020,
    death_date_type: "EXACT",
    generation: "Generasi 3",
    role_note: "Cucu (Anak Bambang)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000010",
    primary_name: "Ratna Juwita",
    nickname: "Ratna",
    gender: "female",
    is_living: true,
    birth_date_year: 1952,
    birth_date_type: "EXACT",
    generation: "Generasi 3",
    role_note: "Istri Hendra Soedirjo",
  },
  {
    id: "b0000000-0000-0000-0000-000000000011",
    primary_name: "Budi Santoso",
    nickname: "Budi",
    gender: "male",
    is_living: true,
    birth_date_year: 1950,
    birth_date_type: "EXACT",
    generation: "Generasi 3",
    role_note: "Cucu (Anak Sri Wahyuni)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000012",
    primary_name: "Dimas Arya Soedirjo",
    nickname: "Dimas",
    gender: "male",
    is_living: true,
    birth_date_year: 1980,
    birth_date_type: "EXACT",
    generation: "Generasi 4",
    role_note: "Cicit (Anak Hendra)",
  },
  {
    id: "b0000000-0000-0000-0000-000000000013",
    primary_name: "Anisa Larasati",
    nickname: "Anisa",
    gender: "female",
    is_living: true,
    birth_date_year: 1985,
    birth_date_type: "EXACT",
    generation: "Generasi 4",
    role_note: "Cicit (Anak Hendra)",
  },
];

export default function DirektoriPage() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("all");
  const [livingFilter, setLivingFilter] = useState("all");

  const filteredPersons = INITIAL_PERSONS.filter((p) => {
    const matchSearch =
      p.primary_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.nickname && p.nickname.toLowerCase().includes(search.toLowerCase()));

    const matchGender = genderFilter === "all" || p.gender === genderFilter;
    const matchLiving =
      livingFilter === "all" ||
      (livingFilter === "living" && p.is_living) ||
      (livingFilter === "deceased" && !p.is_living);

    return matchSearch && matchGender && matchLiving;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Direktori Individu Silsilah
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap seluruh anggota keluarga besar dalam Trah Bani Kartosoedirjo
          </p>
        </div>
        <Link
          href="/individu/baru"
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Individu</span>
        </Link>
      </div>

      {/* Filter & Search Bar (TailAdmin Style) */}
      <div className="rounded-xl border border-stroke bg-white p-4 shadow-default flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama anggota atau nama panggilan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-lg border border-stroke bg-transparent text-slate-800 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-stroke bg-white text-slate-700 outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Semua Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>

          <select
            value={livingFilter}
            onChange={(e) => setLivingFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-lg border border-stroke bg-white text-slate-700 outline-none focus:border-primary cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="living">Masih Hidup</option>
            <option value="deceased">Telah Wafat</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-slate-500 font-medium px-1 flex items-center justify-between">
        <span>
          Menampilkan <strong className="text-slate-800">{filteredPersons.length}</strong> dari {INITIAL_PERSONS.length} individu tercatat
        </span>
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {filteredPersons.map((person) => {
          const initials = person.primary_name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("");

          const birthText = formatDate(null, person.birth_date_year, person.birth_date_type);
          const deathText = person.is_living
            ? "Masih Hidup"
            : formatDate(null, person.death_date_year, person.death_date_type);

          return (
            <div
              key={person.id}
              className="rounded-xl border border-stroke bg-white p-5 shadow-default hover:shadow-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 border ${
                        person.gender === "male"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-pink-50 text-pink-700 border-pink-200"
                      }`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                        {person.primary_name}
                      </h3>
                      {person.nickname && (
                        <span className="text-[11px] text-slate-500 block truncate">
                          &ldquo;{person.nickname}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600">
                    {person.generation}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-stroke space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Kelahiran:</span>
                    <span className="font-semibold text-slate-800">{birthText}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Status:</span>
                    <span
                      className={`font-semibold ${
                        person.is_living ? "text-emerald-600" : "text-slate-700"
                      }`}
                    >
                      {deathText}
                    </span>
                  </div>
                  {person.role_note && (
                    <div className="flex items-center justify-between text-[11px] pt-1 text-slate-500">
                      <span>Kedudukan:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">{person.role_note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stroke flex items-center justify-between text-xs">
                <Link
                  href={`/individu/${person.id}`}
                  className="font-semibold text-primary hover:text-primary-hover inline-flex items-center gap-1"
                >
                  <span>Profil & Bukti</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/pohon?focus=${person.id}`}
                  className="text-slate-500 hover:text-slate-800 text-[11px]"
                >
                  Buka di Pohon
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
