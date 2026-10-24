import { createClient } from "@/lib/supabase/server";
import { FamilyRole } from "@/types/database.types";

export async function getFamilyMembers(familyId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("family_memberships")
    .select(`
      id,
      family_id,
      role,
      status,
      created_at,
      profile:profile_id (id, full_name, avatar_url, phone)
    `)
    .eq("family_id", familyId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Gagal mengambil daftar anggota: ${error.message}`);
  return data;
}

export async function updateMemberRole(membershipId: string, newRole: FamilyRole) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("family_memberships")
    .update({ role: newRole })
    .eq("id", membershipId)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui peran anggota: ${error.message}`);
  return data;
}

export async function removeMember(membershipId: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("family_memberships").delete().eq("id", membershipId);
  if (error) throw new Error(`Gagal mengeluarkan anggota: ${error.message}`);
  return true;
}

