import { createClient } from "@/lib/supabase/server";
import { personSchema, type PersonFormData } from "@/lib/validators/person";
import { findPotentialDuplicates, type CandidatePerson } from "./duplicate-detector";
import type { Database } from "@/types/database.types";

type NameCategory = Database["public"]["Tables"]["person_names"]["Insert"]["type"];

export async function getPersonsByFamily(familyId: string, search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("persons")
    .select(`
      *,
      person_names (id, name, type, notes),
      places:birth_place_id (name)
    `)
    .eq("family_id", familyId)
    .order("birth_date_year", { ascending: true, nullsFirst: false });

  if (search && search.trim() !== "") {
    query = query.ilike("primary_name", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Gagal mengambil data individu: ${error.message}`);
  return data;
}

export async function getPersonById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("persons")
    .select(`
      *,
      person_names (*),
      birth_place:birth_place_id (id, name),
      death_place:death_place_id (id, name),
      claims (*),
      events:event_persons (
        role_in_event,
        event:events (*)
      )
    `)
    .eq("id", id)
    .single();

  if (error) throw new Error(`Individu tidak ditemukan: ${error.message}`);
  return data;
}

export async function createPerson(familyId: string, formData: PersonFormData) {
  const validated = personSchema.parse(formData);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("persons")
    .insert({
      family_id: familyId,
      primary_name: validated.primary_name,
      nickname: validated.nickname,
      gender: validated.gender,
      is_living: validated.is_living,
      birth_date_exact: validated.birth_date_exact,
      birth_date_year: validated.birth_date_year,
      birth_date_type: validated.birth_date_type,
      birth_date_text: validated.birth_date_text,
      birth_place_id: validated.birth_place_id,
      death_date_exact: validated.death_date_exact,
      death_date_year: validated.death_date_year,
      death_date_type: validated.death_date_type,
      death_date_text: validated.death_date_text,
      death_place_id: validated.death_place_id,
      burial_place_id: validated.burial_place_id,
      bio: validated.bio,
      is_private: validated.is_private,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) throw new Error(`Gagal menambahkan individu: ${error.message}`);
  return data;
}

export async function updatePerson(id: string, formData: Partial<PersonFormData>) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("persons")
    .update(formData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui individu: ${error.message}`);
  return data;
}

export async function deletePerson(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("persons").delete().eq("id", id);
  if (error) throw new Error(`Gagal menghapus individu: ${error.message}`);
  return true;
}

export async function addPersonName(
  personId: string,
  name: string,
  type: NameCategory,
  notes?: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("person_names")
    .insert({
      person_id: personId,
      name,
      type,
      notes,
    })
    .select()
    .single();

  if (error) throw new Error(`Gagal menambahkan variasi nama: ${error.message}`);
  return data;
}

export async function checkPersonDuplicates(
  familyId: string,
  target: {
    primary_name: string;
    nickname?: string | null;
    gender?: string;
    birth_date_year?: number | null;
    death_date_year?: number | null;
  }
) {
  const supabase = await createClient();

  const { data: existingPersons, error } = await supabase
    .from("persons")
    .select("id, primary_name, nickname, gender, birth_date_year, death_date_year, person_names(name)")
    .eq("family_id", familyId);

  if (error) throw new Error(`Gagal membaca daftar individu: ${error.message}`);

  const candidates: CandidatePerson[] = (existingPersons || []).map((p: any) => ({
    id: p.id,
    primary_name: p.primary_name,
    nickname: p.nickname,
    gender: p.gender,
    birth_date_year: p.birth_date_year,
    death_date_year: p.death_date_year,
    alternate_names: p.person_names?.map((n: { name: string }) => n.name) || [],
  }));

  return findPotentialDuplicates(target, candidates);
}

