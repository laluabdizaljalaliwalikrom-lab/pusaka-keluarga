import { createClient } from "@/lib/supabase/server";
import { claimSchema, type ClaimFormData } from "@/lib/validators/claim";
import { sourceSchema, type SourceFormData } from "@/lib/validators/source";
import type { Database } from "@/types/database.types";

type ClaimStatus = Database["public"]["Tables"]["claims"]["Insert"]["status"];

// ==============================================================================
// MODUL SUMBER INFORMASI (SOURCES)
// ==============================================================================

export async function createSource(formData: SourceFormData) {
  const validated = sourceSchema.parse(formData);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("sources")
    .insert({
      family_id: validated.family_id,
      title: validated.title,
      author: validated.author,
      publication_date: validated.publication_date,
      repository: validated.repository,
      source_type: validated.source_type,
      citation_text: validated.citation_text,
      url: validated.url || null,
      created_by: user?.id,
    })
    .select()
    .single();

  if (error) throw new Error(`Gagal menyimpan sumber: ${error.message}`);
  return data;
}

export async function getSourcesByFamily(familyId: string, search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("sources")
    .select("*")
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (search && search.trim() !== "") {
    query = query.ilike("title", `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Gagal mengambil repositori sumber: ${error.message}`);
  return data;
}

// ==============================================================================
// MODUL KLAIM FAKTA (CLAIMS & CLAIM_SOURCES)
// ==============================================================================

export async function createClaimWithSource(formData: ClaimFormData) {
  const validated = claimSchema.parse(formData);
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  // 1. Simpan Klaim
  const { data: claim, error: errClaim } = await supabase
    .from("claims")
    .insert({
      family_id: validated.family_id,
      subject_person_id: validated.subject_person_id,
      claim_type: validated.claim_type,
      predicate: validated.predicate,
      raw_data: validated.raw_data,
      status: validated.status || "belum_ditinjau",
      notes: validated.notes,
      created_by: user?.id,
    })
    .select()
    .single();

  if (errClaim) throw new Error(`Gagal menyimpan klaim: ${errClaim.message}`);

  // 2. Jika ada tautan sumber pendukung, simpan ke claim_sources
  if (validated.source_id) {
    const { error: errClaimSource } = await supabase.from("claim_sources").insert({
      claim_id: claim.id,
      source_id: validated.source_id,
      page_or_reference: validated.page_or_reference || null,
      evidence_quality: validated.evidence_quality || "direct",
    });

    if (errClaimSource) {
      throw new Error(`Klaim tersimpan namun gagal menautkan sumber: ${errClaimSource.message}`);
    }
  }

  return claim;
}

export async function getClaimsByPerson(personId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("claims")
    .select(`
      *,
      claim_sources (
        page_or_reference,
        evidence_quality,
        source:sources (*)
      )
    `)
    .eq("subject_person_id", personId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Gagal mengambil daftar klaim individu: ${error.message}`);
  return data;
}

export async function updateClaimStatus(claimId: string, status: ClaimStatus) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("claims")
    .update({ status })
    .eq("id", claimId)
    .select()
    .single();

  if (error) throw new Error(`Gagal memperbarui status verifikasi klaim: ${error.message}`);
  return data;
}

