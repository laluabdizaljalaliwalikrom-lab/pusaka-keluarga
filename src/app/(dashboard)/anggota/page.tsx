"use client";

import { useState } from "react";
import { UserCheck, UserPlus, Shield, UserX, Check, Mail } from "lucide-react";
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
    title: "Owner (Pemilik Ruang)",
    desc: "Hak penuh menghapus keluarga dan mengelola tagihan",
    badge: "bg-purple-100 text-purple-800",
  },
  family_admin: {
    title: "Family Administrator",
    desc: "Mengelola anggota, menyetujui usulan, dan merge profil",
    badge: "bg-blue-100 text-blue-800",
  },
  editor: {
    title: "Editor (Kurator)",
    desc: "Dapat langsung mengedit silsilah dan mereview usulan",
    badge: "bg-emerald-100 text-emerald-800",
  },
  contributor: {
    title: "Contributor (Anggota)",
    desc: "Melihat data & mengajukan usulan perubahan data",
    badge: "bg-amber-100 text-amber-800",
  },
  reader: {
    title: "Reader (Pembaca)",
    desc: "Hanya dapat membaca informasi publik tanpa edit",
    badge: "bg-gray-100 text-gray-800",
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

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <h1 className="text-2xl font-extrabold text-pusaka-900 tracking-tight flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-pusaka-800" />
            <span>Manajemen Anggota Keluarga</span>
          </h1>
          <p className="text-xs text-pusaka-600 mt-1">
            Kelola hak akses dan peran pengguna dalam ruang silsilah keluarga besar
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-pusaka-800 text-white text-xs font-semibold shadow hover:bg-pusaka-900 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Undang Anggota Baru</span>
        </button>
      </div>

      {/* Members Table Card */}
      <div className="bg-white rounded-3xl border border-pusaka-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-pusaka-100 flex items-center justify-between">
          <span className="text-xs font-bold text-pusaka-900">
            Daftar Anggota Aktif ({members.length} Orang)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-pusaka-50/70 border-b border-pusaka-100 text-pusaka-600 uppercase tracking-wider text-[10px] font-bold">
              <tr>
                <th className="px-6 py-3.5">Nama & Profil</th>
                <th className="px-6 py-3.5">Kontak</th>
                <th className="px-6 py-3.5">Peran Silsilah</th>
                <th className="px-6 py-3.5">Bergabung</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-pusaka-100">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-pusaka-50/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-full bg-pusaka-100 flex items-center justify-center font-bold text-pusaka-800 text-xs shrink-0">
                        {member.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <span className="font-bold text-pusaka-900 block">{member.name}</span>
                        <span className="text-[11px] text-pusaka-500">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-pusaka-700">{member.phone}</td>

                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        ROLE_LABELS[member.role].badge
                      }`}
                    >
                      {ROLE_LABELS[member.role].title}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-pusaka-600">{member.joined_at}</td>

                  <td className="px-6 py-4 text-right">
                    {member.role !== "owner" ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as FamilyRole)}
                        className="py-1 px-2.5 rounded-lg border border-pusaka-200 bg-white text-pusaka-800 text-xs font-semibold focus:outline-none"
                      >
                        <option value="family_admin">Family Admin</option>
                        <option value="editor">Editor</option>
                        <option value="contributor">Contributor</option>
                        <option value="reader">Reader</option>
                      </select>
                    ) : (
                      <span className="text-[11px] font-semibold text-pusaka-400 italic">
                        Pemilik Utama
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-pusaka-900">Undang Anggota Keluarga</h3>
            <p className="text-xs text-pusaka-600">
              Kirimkan undangan bergabung ke email anggota keluarga besar untuk melengkapi silsilah bersama.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">
                  Nama Lengkap Anggota
                </label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="Contoh: Anisa Larasati"
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-pusaka-800 mb-1">
                  Peran yang Diberikan
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as FamilyRole)}
                  className="w-full px-3 py-2 rounded-xl border border-pusaka-200 bg-white"
                >
                  <option value="contributor">Contributor (Mengajukan Usulan)</option>
                  <option value="editor">Editor (Dapat Mengedit Langsung)</option>
                  <option value="family_admin">Family Admin (Administrator)</option>
                  <option value="reader">Reader (Hanya Melihat)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-pusaka-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="px-4 py-2 rounded-xl border border-pusaka-200 text-pusaka-700"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-pusaka-800 text-white font-bold"
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

