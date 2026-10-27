"use client";

import { useSearchParams } from "next/navigation";
import { TreeContainer } from "@/features/genealogy-tree/tree-container";
import { TreeDataPayload } from "@/features/genealogy-tree/tree-layout";
import { BoxCubeIcon, CheckCircleIcon } from "@/components/icons/tailadmin-icons";
import { Suspense } from "react";

// Initial Tree Payload matching synthetic seed data
const SEED_TREE_PAYLOAD: TreeDataPayload = {
  focus_person_id: "b0000000-0000-0000-0000-000000000001", // Raden Mas Kartosoedirjo
  persons: [
    // Gen 1
    {
      id: "b0000000-0000-0000-0000-000000000001",
      primary_name: "Raden Mas Kartosoedirjo",
      nickname: "Mbah Karto",
      gender: "male",
      is_living: false,
      birth_date_year: 1885,
      death_date_year: 1952,
    },
    {
      id: "b0000000-0000-0000-0000-000000000002",
      primary_name: "Raden Ajeng Siti Aminah",
      nickname: "Mbah Aminah",
      gender: "female",
      is_living: false,
      birth_date_year: 1890,
      death_date_year: 1940,
    },
    {
      id: "b0000000-0000-0000-0000-000000000003",
      primary_name: "Nyi Mas Rukmini",
      nickname: "Mbah Rukmini",
      gender: "female",
      is_living: false,
      birth_date_year: 1905,
      death_date_year: 1975,
    },
    // Gen 2
    {
      id: "b0000000-0000-0000-0000-000000000004",
      primary_name: "Bambang Soedirjo",
      nickname: "Bambang",
      gender: "male",
      is_living: false,
      birth_date_year: 1915,
      death_date_year: 1988,
    },
    {
      id: "b0000000-0000-0000-0000-000000000005",
      primary_name: "Dewi Anggraini",
      nickname: "Dewi",
      gender: "female",
      is_living: false,
      birth_date_year: 1920,
      death_date_year: 1995,
    },
    {
      id: "b0000000-0000-0000-0000-000000000006",
      primary_name: "Sri Wahyuni",
      nickname: "Yuni",
      gender: "female",
      is_living: false,
      birth_date_year: 1922,
      death_date_year: 2005,
    },
    {
      id: "b0000000-0000-0000-0000-000000000008",
      primary_name: "Joko Pramono",
      nickname: "Joko",
      gender: "male",
      is_living: false,
      birth_date_year: 1942,
      death_date_year: 2015,
    },
    // Gen 3
    {
      id: "b0000000-0000-0000-0000-000000000009",
      primary_name: "Hendra Soedirjo",
      nickname: "Hendra",
      gender: "male",
      is_living: false,
      birth_date_year: 1948,
      death_date_year: 2020,
    },
    {
      id: "b0000000-0000-0000-0000-000000000010",
      primary_name: "Ratna Juwita",
      nickname: "Ratna",
      gender: "female",
      is_living: true,
      birth_date_year: 1952,
    },
    {
      id: "b0000000-0000-0000-0000-000000000011",
      primary_name: "Budi Santoso",
      nickname: "Budi",
      gender: "male",
      is_living: true,
      birth_date_year: 1950,
    },
    // Gen 4
    {
      id: "b0000000-0000-0000-0000-000000000012",
      primary_name: "Dimas Arya Soedirjo",
      nickname: "Dimas",
      gender: "male",
      is_living: true,
      birth_date_year: 1980,
    },
    {
      id: "b0000000-0000-0000-0000-000000000013",
      primary_name: "Anisa Larasati",
      nickname: "Anisa",
      gender: "female",
      is_living: true,
      birth_date_year: 1985,
    },
  ],
  relationships: [
    // Gen 1 -> Gen 2
    {
      id: "r1",
      parent_id: "b0000000-0000-0000-0000-000000000001",
      child_id: "b0000000-0000-0000-0000-000000000004",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r2",
      parent_id: "b0000000-0000-0000-0000-000000000002",
      child_id: "b0000000-0000-0000-0000-000000000004",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r3",
      parent_id: "b0000000-0000-0000-0000-000000000001",
      child_id: "b0000000-0000-0000-0000-000000000006",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r4",
      parent_id: "b0000000-0000-0000-0000-000000000002",
      child_id: "b0000000-0000-0000-0000-000000000006",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r5",
      parent_id: "b0000000-0000-0000-0000-000000000001",
      child_id: "b0000000-0000-0000-0000-000000000008",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r6",
      parent_id: "b0000000-0000-0000-0000-000000000003",
      child_id: "b0000000-0000-0000-0000-000000000008",
      relationship_type: "biological",
      confidence: "verified",
    },
    // Gen 2 -> Gen 3
    {
      id: "r7",
      parent_id: "b0000000-0000-0000-0000-000000000004",
      child_id: "b0000000-0000-0000-0000-000000000009",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r8",
      parent_id: "b0000000-0000-0000-0000-000000000005",
      child_id: "b0000000-0000-0000-0000-000000000009",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r9",
      parent_id: "b0000000-0000-0000-0000-000000000006",
      child_id: "b0000000-0000-0000-0000-000000000011",
      relationship_type: "biological",
      confidence: "verified",
    },
    // Gen 3 -> Gen 4
    {
      id: "r10",
      parent_id: "b0000000-0000-0000-0000-000000000009",
      child_id: "b0000000-0000-0000-0000-000000000012",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r11",
      parent_id: "b0000000-0000-0000-0000-000000000010",
      child_id: "b0000000-0000-0000-0000-000000000012",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r12",
      parent_id: "b0000000-0000-0000-0000-000000000009",
      child_id: "b0000000-0000-0000-0000-000000000013",
      relationship_type: "biological",
      confidence: "verified",
    },
    {
      id: "r13",
      parent_id: "b0000000-0000-0000-0000-000000000010",
      child_id: "b0000000-0000-0000-0000-000000000013",
      relationship_type: "biological",
      confidence: "verified",
    },
  ],
  unions: [
    {
      id: "u1",
      start_date_year: 1912,
      status: "widowed",
      participants: [
        { person_id: "b0000000-0000-0000-0000-000000000001", role: "husband" },
        { person_id: "b0000000-0000-0000-0000-000000000002", role: "wife" },
      ],
    },
    {
      id: "u2",
      start_date_year: 1941,
      status: "widowed",
      participants: [
        { person_id: "b0000000-0000-0000-0000-000000000001", role: "husband" },
        { person_id: "b0000000-0000-0000-0000-000000000003", role: "wife" },
      ],
    },
    {
      id: "u3",
      start_date_year: 1945,
      status: "widowed",
      participants: [
        { person_id: "b0000000-0000-0000-0000-000000000004", role: "husband" },
        { person_id: "b0000000-0000-0000-0000-000000000005", role: "wife" },
      ],
    },
    {
      id: "u4",
      start_date_year: 1978,
      status: "widowed",
      participants: [
        { person_id: "b0000000-0000-0000-0000-000000000009", role: "husband" },
        { person_id: "b0000000-0000-0000-0000-000000000010", role: "wife" },
      ],
    },
  ],
};

function TreeViewContent() {
  const searchParams = useSearchParams();
  const focusParam = searchParams.get("focus");

  const payload: TreeDataPayload = {
    ...SEED_TREE_PAYLOAD,
    focus_person_id: focusParam || SEED_TREE_PAYLOAD.focus_person_id,
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight flex items-center space-x-2">
            <BoxCubeIcon className="w-6 h-6 text-brand-500" />
            <span>Pohon Silsilah Keluarga</span>
          </h1>
          <p className="text-theme-sm text-gray-500 mt-0.5">
            Jelajahi garis keturunan dan hubungan kekeluargaan interaktif
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs text-gray-600 bg-white px-3.5 py-2 rounded-xl border border-gray-200 shadow-theme-xs">
          <CheckCircleIcon className="w-4 h-4 text-brand-500" />
          <span>Klik nodus untuk detail atau mengubah individu pusat</span>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-theme-xs">
        <TreeContainer initialData={payload} />
      </div>
    </div>
  );
}

export default function PohonPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Memuat visualisasi silsilah...</div>}>
      <TreeViewContent />
    </Suspense>
  );
}

