"use client";

import { useState } from "react";
import {
  UserCircleIcon,
  PlusIcon,
  CheckCircleIcon,
  CloseIcon,
} from "@/components/icons/tailadmin-icons";
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
    badge: "bg-brand-50 text-brand-600",
  },
  family_admin: {
    title: "Family Administrator",
    desc: "Mengelola anggota, menyetujui usulan, dan merge profil",
    badge: "bg-blue-light-50 text-blue-light-600",
  },
  editor: {
    title: "Editor (Kurator)",
    desc: "Dapat langsung mengedit silsilah dan mereview usulan",
    badge: "bg-success-50 text-success-600",
  },
  contributor: {
    title: "Contributor (Anggota)",
    desc: "Melihat data & mengajukan usulan perubahan data",
    badge: "bg-warning-50 text-warning-600",
  },
  reader: {
    title: "Reader (Pembaca)",
    desc: "Hanya dapat membaca informasi publik tanpa edit",
    badge: "bg-gray-100 text-gray-700",
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
          <h1 className="text-title-sm font-bold text-gray-900 tracking-tight">
            Manajemen Anggota Keluarga
          </h1>
          <p className="text-theme-sm text-gray-500 mt-0.5">
            Kelola izin akses kolaborasi dan peran anggota dalam Trah Kartowidjojo
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition self-start sm:self-auto cursor-pointer"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Undang Anggota Baru</span>
        </button>
      </div>

      {/* Members Table Card (TailAdmin Data Table) */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pt-5 pb-4 sm:px-6 shadow-theme-xs">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-base font-semibold text-gray-900">
            Daftar Anggota Aktif ({members.length} Orang)
          </span>
        </div>

        <div className="max-w-full overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-y border-gray-100 bg-gray-50/50">
              <tr>
                <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama & Profil
                </th>
                <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kontak
                </th>
                <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peran Trah
                </th>
                <th className="py-3 px-3 text-start text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bergabung
                </th>
                <th className="py-3 px-3 text-end text-theme-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelola Peran
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {members.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-semibold text-xs border border-brand-100">
                        {member.name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900 block leading-tight">{member.name}</span>
                        <span className="text-xs text-gray-400">{member.email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3 text-gray-600">{member.phone}</td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-medium text-xs ${
                        ROLE_LABELS[member.role].badge
                      }`}
                    >
                      {ROLE_LABELS[member.role].title}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-gray-500">{member.joined_at}</td>

                  <td className="py-3.5 px-3 text-end">
                    {member.role !== "owner" ? (
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.id, e.target.value as FamilyRole)}
                        className="h-9 rounded-lg border border-gray-300 bg-white px-2.5 text-xs font-medium text-gray-800 outline-none focus:border-brand-300 cursor-pointer"
                      >
                        <option value="family_admin">Family Admin</option>
                        <option value="editor">Editor</option>
                        <option value="contributor">Contributor</option>
                        <option value="reader">Reader</option>
                      </select>
                    ) : (
                      <span className="text-xs font-medium text-gray-400 italic">
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
      <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6 shadow-theme-xs">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Panduan Peran & Hak Akses Silsilah
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
          {Object.entries(ROLE_LABELS).map(([key, item]) => (
            <div key={key} className="p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-1">
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${item.badge}`}>
                {item.title}
              </span>
              <p className="text-xs text-gray-600 pt-1 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 max-w-md w-full p-6 shadow-theme-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Undang Anggota Keluarga</h3>
              <button
                onClick={() => setShowInviteModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  placeholder="cth. Dewi Anggraini"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="dewi@email.com"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-3 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 focus:outline-hidden transition"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1.5">Peran Akses Trah</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as FamilyRole)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-800 outline-none focus:border-brand-300 focus:ring-3 focus:ring-brand-500/20 cursor-pointer"
                >
                  <option value="family_admin">Family Administrator</option>
                  <option value="editor">Editor (Kurator Silsilah)</option>
                  <option value="contributor">Contributor (Pengusul Data)</option>
                  <option value="reader">Reader (Hanya Baca)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowInviteModal(false)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs hover:bg-brand-600 transition"
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
