"use client";

import { useState } from "react";
import Link from "next/link";
import { SearchIcon, PlusIcon, ArrowUpIcon, GroupIcon } from "@/components/icons/tailadmin-icons";
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
    primary_name: "Tri Wahyudi",
    nickname: "Yudi",
    gender: "male",
    is_living: true,
    birth_date_year: 1930,
    birth_date_type: "EXACT",
    generation: "Generasi 2",
    role_note: "Anak Bungsu (dari Istri 2)",
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
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
            Direktori Anggota Trah
          </h1>
          <p className="text-theme-sm text-gray-500 mt-0.5">
            Daftar lengkap seluruh anggota keluarga besar dalam Trah Kartowidjojo
          </p>
        </div>
        <Link
          href="/individu/baru"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition self-start sm:self-auto"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Tambah Anggota</span>
        </Link>
      </div>

      {/* Filter & Search Bar (TailAdmin 2.4 Style) */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-theme-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <SearchIcon className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama anggota atau nama panggilan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-transparent pl-11 pr-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 cursor-pointer"
          >
            <option value="all">Semua Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>

          <select
            value={livingFilter}
            onChange={(e) => setLivingFilter(e.target.value)}
            className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="living">Masih Hidup</option>
            <option value="deceased">Telah Wafat</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-theme-sm text-gray-500 font-medium px-1 flex items-center justify-between">
        <span>
          Menampilkan <strong className="text-gray-900">{filteredPersons.length}</strong> dari {INITIAL_PERSONS.length} anggota tercatat
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
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-theme-xs hover:shadow-theme-md transition-shadow flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 border ${
                        person.gender === "male"
                          ? "bg-brand-50 text-brand-600 border-brand-100"
                          : "bg-pink-50 text-pink-600 border-pink-100"
                      }`}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand-500 transition-colors">
                        {person.primary_name}
                      </h3>
                      {person.nickname && (
                        <span className="text-xs text-gray-500 block truncate">
                          &ldquo;{person.nickname}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {person.generation}
                  </span>
                </div>

                <div className="mt-4 pt-3.5 border-t border-gray-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Kelahiran:</span>
                    <span className="font-medium text-gray-900">{birthText}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                      className={`font-semibold ${
                        person.is_living ? "text-success-600" : "text-gray-700"
                      }`}
                    >
                      {deathText}
                    </span>
                  </div>
                  {person.role_note && (
                    <div className="flex items-center justify-between pt-1 text-gray-500">
                      <span>Kedudukan:</span>
                      <span className="font-medium text-gray-700 truncate max-w-[170px]">{person.role_note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                <Link
                  href={`/individu/${person.id}`}
                  className="font-medium text-brand-500 hover:text-brand-600 inline-flex items-center gap-1 transition"
                >
                  <span>Profil & Bukti</span>
                  <ArrowUpIcon className="w-3 h-3 rotate-45 text-brand-500" />
                </Link>
                <Link
                  href={`/pohon?focus=${person.id}`}
                  className="text-gray-500 hover:text-gray-900 transition"
                >
                  Lihat di Pohon
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
