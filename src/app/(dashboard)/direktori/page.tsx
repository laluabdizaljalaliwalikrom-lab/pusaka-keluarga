"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, Plus, User, ArrowUpRight } from "lucide-react";
import { formatDate } from "@/lib/utils";

// Mock data awal sinkron dengan seed sintetis Trah Kartosoedirjo
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
    role_note: "Akar Keluarga (Kakek Buyut)",
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
    birth_date_type: "APPROXIMATE",
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
    role_note: "Anak dari Istri 2",
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
          <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight">
            Direktori Individu Silsilah
          </h1>
          <p className="text-xs text-pusaka-600 mt-1">
            Daftar seluruh individu yang tercatat dalam pohon keluarga besar
          </p>
        </div>
        <Link
          href="/individu/baru"
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-pusaka-800 text-white text-xs font-semibold shadow hover:bg-pusaka-900 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Individu</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-pusaka-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-pusaka-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama individu atau panggilan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-pusaka-200 focus:outline-none focus:ring-2 focus:ring-pusaka-800/20 focus:border-pusaka-800"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-pusaka-500 shrink-0" />
          <select
            value={genderFilter}
            onChange={(e) => setGenderFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-pusaka-200 bg-white text-pusaka-800 focus:outline-none"
          >
            <option value="all">Semua Jenis Kelamin</option>
            <option value="male">Laki-laki</option>
            <option value="female">Perempuan</option>
          </select>

          <select
            value={livingFilter}
            onChange={(e) => setLivingFilter(e.target.value)}
            className="py-2 px-3 text-xs rounded-xl border border-pusaka-200 bg-white text-pusaka-800 focus:outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="living">Masih Hidup</option>
            <option value="deceased">Telah Wafat</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs text-pusaka-600 font-medium px-1">
        Menampilkan {filteredPersons.length} dari {INITIAL_PERSONS.length} individu
      </div>

      {/* Directory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              className="bg-white rounded-2xl border border-pusaka-200/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                        person.gender === "male"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {initials}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-pusaka-900 group-hover:text-pusaka-800 transition-colors">
                        {person.primary_name}
                      </h3>
                      {person.nickname && (
                        <span className="text-xs text-pusaka-600 block">
                          Panggilan: &ldquo;{person.nickname}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-pusaka-100 text-pusaka-800 text-[10px] font-semibold">
                    {person.generation}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-pusaka-100 space-y-1.5 text-xs text-pusaka-700">
                  <div className="flex items-center justify-between">
                    <span className="text-pusaka-500">Lahir:</span>
                    <span className="font-medium">{birthText}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-pusaka-500">Wafat / Status:</span>
                    <span
                      className={`font-medium ${
                        person.is_living ? "text-emerald-700" : "text-pusaka-700"
                      }`}
                    >
                      {deathText}
                    </span>
                  </div>
                  {person.role_note && (
                    <div className="flex items-center justify-between text-[11px] pt-1 text-pusaka-600 italic">
                      <span>Peran:</span>
                      <span>{person.role_note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-pusaka-100 flex items-center justify-between">
                <Link
                  href={`/individu/${person.id}`}
                  className="text-xs font-semibold text-pusaka-800 hover:text-pusaka-900 inline-flex items-center space-x-1"
                >
                  <span>Lihat Profil Lengkap</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/pohon?focus=${person.id}`}
                  className="text-xs text-pusaka-600 hover:text-pusaka-900 underline"
                >
                  Pusatkan di Pohon
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

