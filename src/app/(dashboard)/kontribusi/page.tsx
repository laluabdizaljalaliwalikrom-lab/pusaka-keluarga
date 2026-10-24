"use client";

import { useState } from "react";
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Check,
  X,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

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

// Mock usulan kontribusi awal tersinkronisasi
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
    created_at: "Kemarin",
    status: "approved",
    reviewer_notes: "Data cocok dengan arsip gereja dan catatan keluarga.",
    proposed_payload: {
      parent_name: "Raden Hartono",
      child_name: "Budi Santoso",
      relationship_type: "biological",
    },
  },
];

export default function KontribusiPage() {
  const [proposals, setProposals] = useState<ProposalItem[]>(INITIAL_PROPOSALS);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [actionModal, setActionModal] = useState<{
    id: string;
    type: "approve" | "reject";
  } | null>(null);
  const [notes, setNotes] = useState("");

  const filteredProposals = proposals.filter((p) => {
    if (activeTab === "all") return true;
    return p.status === activeTab;
  });

  const handleConfirmAction = () => {
    if (!actionModal) return;
    setProposals((prev) =>
      prev.map((p) => {
        if (p.id === actionModal.id) {
          return {
            ...p,
            status: actionModal.type === "approve" ? "approved" : "rejected",
            reviewer_notes: notes || (actionModal.type === "approve" ? "Disetujui kurator." : "Ditolak."),
          };
        }
        return p;
      })
    );
    setActionModal(null);
    setNotes("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-pusaka-800" />
          <span>Pusat Usulan Kontribusi & Kurasi</span>
        </h1>
        <p className="text-xs text-pusaka-600 mt-1">
          Tinjau, setujui, atau tolak perubahan silsilah yang diajukan oleh anggota keluarga
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-pusaka-200 space-x-4 text-xs font-bold">
        <button
          onClick={() => setActiveTab("pending")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === "pending"
              ? "border-pusaka-800 text-pusaka-900"
              : "border-transparent text-pusaka-500 hover:text-pusaka-800"
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Menunggu Review ({proposals.filter((p) => p.status === "pending").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === "approved"
              ? "border-pusaka-800 text-pusaka-900"
              : "border-transparent text-pusaka-500 hover:text-pusaka-800"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Disetujui ({proposals.filter((p) => p.status === "approved").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`pb-3 border-b-2 flex items-center space-x-1.5 transition-all ${
            activeTab === "rejected"
              ? "border-pusaka-800 text-pusaka-900"
              : "border-transparent text-pusaka-500 hover:text-pusaka-800"
          }`}
        >
          <XCircle className="w-4 h-4 text-rose-600" />
          <span>Ditolak ({proposals.filter((p) => p.status === "rejected").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`pb-3 border-b-2 transition-all ${
            activeTab === "all"
              ? "border-pusaka-800 text-pusaka-900"
              : "border-transparent text-pusaka-500 hover:text-pusaka-800"
          }`}
        >
          Semua Usulan ({proposals.length})
        </button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-pusaka-200 text-xs text-pusaka-500">
            Tidak ada usulan perubahan pada kategori ini.
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="bg-white rounded-2xl border border-pusaka-200/80 p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pusaka-100 pb-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-pusaka-100 text-pusaka-800 text-[10px] font-bold uppercase">
                    {proposal.operation} — {proposal.target_table}
                  </span>
                  <span className="text-xs text-pusaka-500">• {proposal.created_at}</span>
                </div>

                <div className="flex items-center space-x-2">
                  {proposal.status === "pending" && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Menunggu Kurasi</span>
                    </span>
                  )}
                  {proposal.status === "approved" && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Telah Disetujui</span>
                    </span>
                  )}
                  {proposal.status === "rejected" && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold flex items-center space-x-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Ditolak</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Proposal Content */}
              <div>
                <h3 className="text-base font-bold text-pusaka-900">{proposal.target_name}</h3>
                <p className="text-xs text-pusaka-700 mt-1 leading-relaxed">
                  <strong>Alasan / Bukti:</strong> {proposal.justification}
                </p>
                {proposal.source_title && (
                  <p className="text-xs text-pusaka-600 mt-0.5">
                    <strong>Rujukan Sumber:</strong> {proposal.source_title}
                  </p>
                )}
              </div>

              {/* Proposer Info & Reviewer Notes */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-pusaka-100 text-xs">
                <div className="flex items-center space-x-2 text-pusaka-600">
                  <User className="w-4 h-4 text-pusaka-500" />
                  <span>Diajukan oleh:</span>
                  <span className="font-bold text-pusaka-900">{proposal.proposed_by_name}</span>
                  <span className="px-1.5 py-0.2 bg-pusaka-100 text-pusaka-700 text-[10px] rounded">
                    {proposal.proposed_by_role}
                  </span>
                </div>

                {/* Curator Actions */}
                {proposal.status === "pending" && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActionModal({ id: proposal.id, type: "reject" })}
                      className="px-3.5 py-1.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak Usulan</span>
                    </button>
                    <button
                      onClick={() => setActionModal({ id: proposal.id, type: "approve" })}
                      className="px-4 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui Usulan</span>
                    </button>
                  </div>
                )}
              </div>

              {proposal.reviewer_notes && (
                <div className="p-3 rounded-xl bg-pusaka-50 border border-pusaka-200 text-xs text-pusaka-800">
                  <span className="font-bold text-[11px] text-pusaka-600 block mb-0.5">
                    Catatan Kurator / Peninjau:
                  </span>
                  <p>{proposal.reviewer_notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Review Confirmation Modal */}
      {actionModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-pusaka-900">
              {actionModal.type === "approve"
                ? "Konfirmasi Persetujuan Usulan"
                : "Konfirmasi Penolakan Usulan"}
            </h3>
            <p className="text-xs text-pusaka-600 leading-relaxed">
              {actionModal.type === "approve"
                ? "Perubahan ini akan diterapkan secara permanen ke pohon silsilah keluarga dan dicatat dalam audit log."
                : "Berikan alasan penolakan yang konstruktif agar kontributor dapat melengkapi bukti sumber."}
            </p>

            <div>
              <label className="block text-xs font-semibold text-pusaka-800 mb-1">
                Catatan Peninjau / Kurator
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Catatan verifikasi atau alasan keputusan..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-pusaka-200 focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end space-x-2 text-xs">
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="px-4 py-2 rounded-xl border border-pusaka-200 text-pusaka-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-4 py-2 rounded-xl text-white font-bold ${
                  actionModal.type === "approve"
                    ? "bg-emerald-700 hover:bg-emerald-800"
                    : "bg-rose-700 hover:bg-rose-800"
                }`}
              >
                {actionModal.type === "approve" ? "Konfirmasi Setuju" : "Konfirmasi Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

