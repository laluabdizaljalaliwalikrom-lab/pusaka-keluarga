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
        <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
          Pusat Review & Kurasi Usulan
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Tinjau usulan penambahan individu atau tautan relasi yang diajukan oleh kontributor keluarga
        </p>
      </div>

      {/* TailAdmin Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-stroke pb-1 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "pending"
              ? "bg-amber-50 text-amber-700 border border-amber-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Menunggu Review ({proposals.filter((p) => p.status === "pending").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("approved")}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "approved"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Disetujui ({proposals.filter((p) => p.status === "approved").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("rejected")}
          className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
            activeTab === "rejected"
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          <XCircle className="w-3.5 h-3.5" />
          <span>Ditolak ({proposals.filter((p) => p.status === "rejected").length})</span>
        </button>

        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-2 rounded-lg transition-colors ${
            activeTab === "all"
              ? "bg-slate-100 text-slate-900 border border-stroke"
              : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          }`}
        >
          Semua ({proposals.length})
        </button>
      </div>

      {/* Proposals List */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-stroke text-xs text-slate-500">
            Tidak ada usulan data dalam kategori ini.
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="rounded-xl border border-stroke bg-white p-5 md:p-6 shadow-default space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stroke pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">
                    {proposal.operation} — {proposal.target_table}
                  </span>
                  <span className="text-xs text-slate-400">• {proposal.created_at}</span>
                </div>

                <div className="flex items-center gap-2">
                  {proposal.status === "pending" && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Menunggu Kurasi</span>
                    </span>
                  )}
                  {proposal.status === "approved" && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Disetujui</span>
                    </span>
                  )}
                  {proposal.status === "rejected" && (
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Ditolak</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Proposal Content */}
              <div>
                <h3 className="text-sm md:text-base font-bold text-slate-900">{proposal.target_name}</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <strong className="text-slate-800">Alasan / Bukti:</strong> {proposal.justification}
                </p>
                {proposal.source_title && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    <strong>Rujukan Sumber:</strong> {proposal.source_title}
                  </p>
                )}
              </div>

              {/* Payload Preview */}
              <div className="bg-slate-50 rounded-lg p-3 text-xs border border-stroke space-y-1">
                <span className="font-semibold text-slate-500 block text-[11px]">
                  Rincian Data yang Diusulkan:
                </span>
                <pre className="text-[11px] font-mono text-slate-700 overflow-x-auto">
                  {JSON.stringify(proposal.proposed_payload, null, 2)}
                </pre>
              </div>

              {/* Reviewer Notes if already reviewed */}
              {proposal.reviewer_notes && (
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-800">
                  <span className="font-semibold block text-[11px] text-emerald-600">
                    Catatan Reviewer:
                  </span>
                  <p>{proposal.reviewer_notes}</p>
                </div>
              )}

              {/* Card Footer: Proposer info & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stroke text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>
                    Diusulkan oleh: <strong className="text-slate-800">{proposal.proposed_by_name}</strong> ({proposal.proposed_by_role})
                  </span>
                </div>

                {proposal.status === "pending" && (
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      onClick={() => {
                        setSelectedProposal(proposal);
                        setReviewAction("reject");
                      }}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Tolak Usulan</span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedProposal(proposal);
                        setReviewAction("approve");
                      }}
                      className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Setujui & Terapkan</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Confirmation Modal */}
      {selectedProposal && reviewAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stroke max-w-md w-full p-6 shadow-dropdown space-y-4">
            <h3 className="text-sm font-bold text-slate-800">
              {reviewAction === "approve" ? "Konfirmasi Persetujuan Usulan" : "Konfirmasi Penolakan Usulan"}
            </h3>

            <p className="text-xs text-slate-600 leading-relaxed">
              {reviewAction === "approve"
                ? `Usulan "${selectedProposal.target_name}" akan langsung diterapkan ke database trah silsilah.`
                : `Usulan "${selectedProposal.target_name}" akan ditolak dan dicatat pada riwayat kurasi.`}
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Catatan Reviewer (Opsional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Berikan alasan atau catatan verifikasi tambahan..."
                className="w-full p-2.5 rounded-lg border border-stroke bg-transparent text-xs text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stroke">
              <button
                onClick={() => {
                  setSelectedProposal(null);
                  setReviewAction(null);
                  setNotes("");
                }}
                className="px-4 py-2 rounded-lg border border-stroke text-slate-700 hover:bg-slate-50 text-xs font-semibold"
              >
                Batal
              </button>

              <button
                onClick={handleConfirmReview}
                className={`px-4 py-2 rounded-lg text-white text-xs font-semibold shadow-xs ${
                  reviewAction === "approve"
                    ? "bg-primary hover:bg-primary-hover"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {reviewAction === "approve" ? "Terapkan Usulan" : "Tolak Usulan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
