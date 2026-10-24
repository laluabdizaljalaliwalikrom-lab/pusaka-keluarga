import { createClient } from "@/lib/supabase/server";
import { parentChildRelationSchema, type ParentChildRelationFormData } from "@/lib/validators/person";
import { unionSchema, type UnionFormData } from "@/lib/validators/union";

export async function addParentChildRelationship(formData: ParentChildRelationFormData) {
  const validated = parentChildRelationSchema.parse(formData);
  const supabase = await createClient();

  // Panggil PostgreSQL Stored Procedure yang memiliki advisory lock & recursive cycle check
  const { data, error } = await supabase.rpc("fn_add_parent_child_relationship", {
    p_family_id: validated.family_id,
    p_parent_id: validated.parent_id,
    p_child_id: validated.child_id,
    p_union_id: validated.union_id || null,
    p_relationship_type: validated.relationship_type,
    p_confidence: validated.confidence,
    p_notes: validated.notes || null,
  });

  if (error) {
    throw new Error(`Gagal menambahkan relasi orang tua-anak: ${error.message}`);
  }

  return data;
}

export async function removeParentChildRelationship(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("parent_child_relationships").delete().eq("id", id);
  if (error) throw new Error(`Gagal menghapus relasi: ${error.message}`);
  return true;
}

export async function getPersonRelationships(personId: string) {
  const supabase = await createClient();

  // Ambil orang tua
  const { data: parents, error: errParents } = await supabase
    .from("parent_child_relationships")
    .select(`
      id,
      relationship_type,
      confidence,
      parent:parent_id (id, primary_name, gender, birth_date_year, death_date_year)
    `)
    .eq("child_id", personId);

  if (errParents) throw new Error(`Gagal mengambil data orang tua: ${errParents.message}`);

  // Ambil anak
  const { data: children, error: errChildren } = await supabase
    .from("parent_child_relationships")
    .select(`
      id,
      relationship_type,
      confidence,
      child:child_id (id, primary_name, gender, birth_date_year, death_date_year)
    `)
    .eq("parent_id", personId);

  if (errChildren) throw new Error(`Gagal mengambil data anak: ${errChildren.message}`);

  // Ambil pasangan via unions
  const { data: unionParts, error: errUnions } = await supabase
    .from("union_participants")
    .select(`
      union_id,
      role,
      union:unions (
        id,
        type,
        status,
        start_date_year,
        union_participants (
          role,
          person:person_id (id, primary_name, gender, birth_date_year, death_date_year)
        )
      )
    `)
    .eq("person_id", personId);

  if (errUnions) throw new Error(`Gagal mengambil data pasangan: ${errUnions.message}`);

  return {
    parents: parents || [],
    children: children || [],
    unions: unionParts || [],
  };
}

export async function createUnionWithPartners(formData: UnionFormData) {
  const validated = unionSchema.parse(formData);
  const supabase = await createClient();

  // 1. Buat record serikat pasangan
  const { data: newUnion, error: errUnion } = await supabase
    .from("unions")
    .insert({
      family_id: validated.family_id,
      type: validated.type,
      status: validated.status,
      start_date_exact: validated.start_date_exact,
      start_date_year: validated.start_date_year,
      start_date_type: validated.start_date_type,
      start_date_text: validated.start_date_text,
      end_date_exact: validated.end_date_exact,
      end_date_year: validated.end_date_year,
      end_date_type: validated.end_date_type,
      end_date_text: validated.end_date_text,
      place_id: validated.place_id,
      notes: validated.notes,
    })
    .select()
    .single();

  if (errUnion) throw new Error(`Gagal mencatat serikat pasangan: ${errUnion.message}`);

  // 2. Tautkan peserta pasangan
  const participants = validated.partner_ids.map((personId, index) => ({
    union_id: newUnion.id,
    person_id: personId,
    role: "partner",
    order_index: index + 1,
  }));

  const { error: errPart } = await supabase.from("union_participants").insert(participants);
  if (errPart) throw new Error(`Gagal menghubungkan pasangan: ${errPart.message}`);

  return newUnion;
}

