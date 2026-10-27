"use client";

import { useState } from "react";
import { UserCheck, UserPlus, Shield, Check, Mail, X } from "lucide-react";
import { FamilyRole } from "@/types/database.types";

const INITIAL_MEMBERS = [
  {
    id: "m-1",
    name: "Kuncoro Adiwijaya",
    email: "admin@pusakakeluarga.id",
    phone: "081234567890",
    role: "owner" as FamilyRole,
    status: "active",
    joined_at: "1 Januari 2025",
  },
  {
    id: "m-2",
    name: "Siti Nurhaliza",
    email: "siti.editor@pusakakeluarga.id",
    phone: "081234567891",
    role: "editor" as FamilyRole,
    status: "active",
    joined_at: "10 Januari 2025",
  },
  {
    id: "m-3",
    name: "Bambang Supriyanto",
    email: "bambang.contrib@pusakakeluarga.id",
    phone: "081234567892",
    role: "contributor" as FamilyRole,
    status: "active",
    joined_at: "15 Februari 2025",
  },
];

const ROLE_LABELS: Record<FamilyRole, { title: string; desc: string; badge: string }> = {
  owner: {
    title: "Owner / Superadmin",
    desc: "Hak penuh menghapus keluarga dan mengelola keanggotaan",
    badge: "bg-purple-50 text-purple-700 border border-purple-200",
  },
  family_admin: {
    title: "Family Administrator",
    desc: "Mengelola anggota, menyetujui usulan, dan merge profil",
    badge: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  editor: {
    title: "Editor (Kurator)",
    desc: "Dapat langsung mengedit silsilah dan mereview usulan",
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  contributor: {
    title: "Contributor (Anggota)",
    desc: "Melihat data & mengajukan usulan perubahan data",
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  reader: {
    title: "Reader (Pembaca)",
    desc: "Hanya dapat membaca informasi publik tanpa edit",
    badge: "bg-slate-100 text-slate-700 border border-slate-200",
  },
};

export default function AnggotaPage() {
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<FamilyRole>("contributor");

  const handleRoleChange = (memberId: string, newRole: FamilyRole) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteName) return;

    const newMember = {
      id: "m-" + Date.now(),
      name: inviteName,
      email: inviteEmail,
      phone: "-",
      role: inviteRole,
      status: "active",
      joined_at: "Hari ini",
    };
    setMembers([...members, newMember]);
    setShowInviteModal(false);
    setInviteEmail("");
    setInviteName("");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">
            Manajemen Anggota Keluarga
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Kelola izin akses kolaborasi dan peran anggota dalam Trah Bani Kartosoedirjo
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-primary-hover transition-colors self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          <span>Undang Anggota Baru</span>
        </button>
      </div>

      {/* Members Table Card (TailAdmin Data Table) */}
      <div className="rounded-xl border border-stroke bg-white shadow-default overflow-hidden">
        <div className="p-5 border-b border-stroke flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800">
            Daftar Anggota Aktif ({members.length} Orang)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-stroke text-slate-600 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-5 py-3.5">Nama & Profil</th>
                <th className="px-5 py-3.5">Kontak</th>
                <th className="px-5 py-3.5">Peran Trah</th>
                <th className="px-5 py-3.5">Bergabung</th>
                <th className="px-5 py-3.5 text-right">Kelola Peran</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stroke text-slate-700">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0 border border-primary/20">
                        {member.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">{member.name}</span>
                        <span className="text-[11px] text-slate-400">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-slate-600">{member.phone}</td>

                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded font-semibold text-[10px] ${
                        ROLE_LABELS[member.role].badge
                      }`}
                    >
                      {ROLE_LABELS[member.role].title}
                    </span>
                  </td>

                  <td className="px-5 py-3.5 text-slate-500">{member.joined_at}</td>

                  <td className="px-5 py-3.5 text-right">
                    {member.role !== "owner" ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as FamilyRole)}
                        className="py-1 px-2.5 rounded-lg border border-stroke bg-white text-slate-800 text-xs font-semibold outline-none focus:border-primary cursor-pointer"
                      >
                        <option value="family_admin">Family Admin</option>
                        <option value="editor">Editor</option>
                        <option value="contributor">Contributor</option>
                        <option value="reader">Reader</option>
                      </select>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400 italic">
                        Pemilik Utama (Owner)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Guide Card */}
      <div className="rounded-xl border border-stroke bg-white p-5 shadow-default">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Panduan Peran & Hak Akses Silsilah
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {Object.entries(ROLE_LABELS).map(([key, info]) => (
            <div key={key} className="p-3 rounded-lg bg-slate-50 border border-stroke space-y-1">
              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${info.badge}`}>
                {info.title}
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed pt-1">{info.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-stroke max-w-md w-full p-6 shadow-dropdown space-y-4">
            <div className="flex items-center justify-between border-b border-stroke pb-3">
              <h3 className="text-sm font-bold text-slate-800">Undang Anggota Keluarga</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Undang kerabat atau kurator silsilah untuk berkolaborasi mencatat dan memverifikasi silsilah keluarga.
            </p>

            <form onSubmit={handleInvite} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Contoh: Raden Mas Danang"
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-transparent text-slate-800 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Peran yang Diberikan</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as FamilyRole)}
                  className="w-full px-3 py-2 rounded-lg border border-stroke bg-white text-slate-800 outline-none focus:border-primary cursor-pointer"
                >
                  <option value="contributor">Contributor (Dapat mengajukan usulan)</option>
                  <option value="editor">Editor (Dapat mengedit & kurasi)</option>
                  <option value="family_admin">Family Admin (Admin penuh)</option>
                  <option value="reader">Reader (Hanya membaca)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stroke">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-lg border border-stroke bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-xs shadow-xs"
                >
                  Kirim Undangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
