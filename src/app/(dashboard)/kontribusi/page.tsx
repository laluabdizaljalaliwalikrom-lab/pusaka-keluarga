"use client";

import { useState } from "react";
import {
  TaskIcon,
  CheckCircleIcon,
  CloseIcon,
  DocsIcon,
  UserCircleIcon,
} from "@/components/icons/tailadmin-icons";

interface ProposalItem {
  id: string;
  target_table: string;
  operation: string;
  target_name: string;
  justification: string;
  source_title: string;
  proposed_by_name: string;
  proposed_by_role: string;
  created_at: string;
  status: string;
  reviewer_notes?: string;
  proposed_payload: Record<string, any>;
}

const INITIAL_PROPOSALS: ProposalItem[] = [
  {
    id: "prop-1",
    target_table: "persons",
    operation: "INSERT",
    target_name: "Raden Mas Soetomo",
    justification: "Ditemukan catatan silsilah cabang Solo bahwa Mbah Kartosoedirjo memiliki saudara sepupu bernama R. M. Soetomo.",
    source_title: "Catatan Buku Trah Keraton Solo No. 442/S Hal. 115",
    proposed_by_name: "Bambang Supriyanto",
    proposed_by_role: "Contributor",
    created_at: "2 jam yang lalu",
    status: "pending",
    proposed_payload: {
      primary_name: "Raden Mas Soetomo",
      gender: "male",
      birth_date_year: 1888,
      birth_date_type: "APPROXIMATE",
      is_living: false,
    },
  },
  {
    id: "prop-2",
    target_table: "parent_child_relationships",
    operation: "INSERT",
    target_name: "Tautkan Anak: Budi Santoso ke Raden Hartono",
    justification: "Verifikasi hubungan biologis berdasarkan akta lahir dan wawancara sesepuh keluarga.",
    source_title: "Kutipan Akta Catatan Sipil Surakarta",
    proposed_by_name: "Siti Nurhaliza",
    proposed_by_role: "Editor",
    created_at: "1 hari yang lalu",
    status: "approved",
    reviewer_notes: "Disetujui berdasarkan kesesuaian dokumen akta kelahiran 1950.",
    proposed_payload: {
      parent_name: "Raden Hartono",
      child_name: "Budi Santoso",
      type: "biological",
    },
  },
];

export default function KontribusiPage() {
  const [proposals, setProposals] = useState<ProposalItem[]>(INITIAL_PROPOSALS);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | null>(null);
  const [notes, setNotes] = useState("");

  const filteredProposals = proposals.filter((p) => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  const handleConfirmReview = () => {
    if (!selectedProposal || !reviewAction) return;

    setProposals((prev) =>
      prev.map((item) => {
        if (item.id === selectedProposal.id) {
          return {
            ...item,
            status: reviewAction === "approve" ? "approved" : "rejected",
            reviewer_notes: notes || (reviewAction === "approve" ? "Disetujui oleh Family Admin" : "Ditolak"),
          };
        }
        return item;
      })
    );

    setSelectedProposal(null);
    setReviewAction(null);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
          Pusat Review & Kurasi Usulan
        </h1>
        <p className="text-theme-sm text-gray-500 mt-0.5">
          Tinjau usulan penambahan individu atau tautan relasi yang diajukan oleh kontributor keluarga
        </p>
      </div>

      {/* TailAdmin Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-2 text-sm font-medium">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${
            activeTab === "pending"
              ? "bg-warning-50 text-warning-600 font-semibold"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <TaskIcon className="w-4 h-4" />
          <span>Menunggu Review ({proposals.filter((p) => p.status === "pending").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${
            activeTab === "approved"
              ? "bg-success-50 text-success-600 font-semibold"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <CheckCircleIcon className="w-4 h-4" />
          <span>Disetujui ({proposals.filter((p) => p.status === "approved").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-4 py-2 rounded-lg flex items-center gap-1.5 transition ${
            activeTab === "rejected"
              ? "bg-error-50 text-error-600 font-semibold"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          <CloseIcon className="w-4 h-4" />
          <span>Ditolak ({proposals.filter((p) => p.status === "rejected").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg transition ${
            activeTab === "all"
              ? "bg-gray-100 text-gray-900 font-semibold"
              : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          }`}
        >
          Semua ({proposals.length})
        </button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-sm text-gray-500">
            Tidak ada usulan data dalam kategori ini.
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold uppercase">
                    {proposal.operation} — {proposal.target_table}
                  </span>
                  <span className="text-xs text-gray-400">• {proposal.created_at}</span>
                </div>

                <div className="flex items-center gap-2">
                  {proposal.status === "pending" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-warning-50 text-warning-600 flex items-center gap-1">
                      <TaskIcon className="w-3.5 h-3.5" />
                      <span>Menunggu Kurasi</span>
                    </span>
                  )}
                  {proposal.status === "approved" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-success-50 text-success-600 flex items-center gap-1">
                      <CheckCircleIcon className="w-3.5 h-3.5" />
                      <span>Disetujui</span>
                    </span>
                  )}
                  {proposal.status === "rejected" && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-error-50 text-error-600 flex items-center gap-1">
                      <CloseIcon className="w-3.5 h-3.5" />
                      <span>Ditolak</span>
                    </span>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900">{proposal.target_name}</h3>
                <p className="mt-1 text-sm text-gray-600 leading-relaxed">{proposal.justification}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <UserCircleIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Diusulkan oleh: <strong className="text-gray-800">{proposal.proposed_by_name}</strong> ({proposal.proposed_by_role})</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <DocsIcon className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>Rujukan Bukti: <strong className="text-gray-800 truncate">{proposal.source_title}</strong></span>
                </div>
              </div>

              {proposal.reviewer_notes && (
                <div className="p-3.5 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-800">
                  <span className="font-semibold block mb-0.5">Catatan Reviewer:</span>
                  <p>{proposal.reviewer_notes}</p>
                </div>
              )}

              {proposal.status === "pending" && (
                <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setSelectedProposal(proposal);
                      setReviewAction("reject");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-error-600 hover:bg-error-50 transition"
                  >
                    <CloseIcon className="w-4 h-4" />
                    <span>Tolak</span>
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProposal(proposal);
                      setReviewAction("approve");
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-brand-500 px-5 py-2 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Setujui Usulan</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Confirmation Modal */}
      {selectedProposal && reviewAction && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-theme-lg space-y-4">
            <h3 className="text-base font-bold text-gray-900">
              {reviewAction === "approve" ? "Setujui Usulan Data" : "Tolak Usulan Data"}
            </h3>
            <p className="text-sm text-gray-600">
              {reviewAction === "approve"
                ? `Apakah Anda yakin ingin menyetujui perubahan data "${selectedProposal.target_name}" ke dalam silsilah resmi?`
                : `Berikan alasan penolakan untuk usulan "${selectedProposal.target_name}".`}
            </p>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Catatan Kurator / Alasan (Opsional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tuliskan catatan verifikasi..."
                className="w-full rounded-lg border border-gray-300 bg-transparent p-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  setSelectedProposal(null);
                  setReviewAction(null);
                }}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmReview}
                className={`rounded-lg px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition ${
                  reviewAction === "approve"
                    ? "bg-brand-500 hover:bg-brand-600"
                    : "bg-error-500 hover:bg-error-600"
                }`}
              >
                {reviewAction === "approve" ? "Konfirmasi Setujui" : "Konfirmasi Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
