import { createClient } from "@/lib/supabase/server";

export interface ChangeProposalInput {
  family_id: string;
  target_table: string;
  target_id?: string | null;
  operation: "INSERT" | "UPDATE" | "DELETE" | "MERGE";
  proposed_payload: Record<string, any>;
  justification: string;
  source_id?: string | null;
}

export async function getChangeProposals(familyId: string, statusFilter?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("change_proposals")
    .select(`
      *,
      proposer:proposed_by (id, full_name, avatar_url),
      reviewer:reviewed_by (id, full_name),
      source:source_id (title, author)
    `)
    .eq("family_id", familyId)
    .order("created_at", { ascending: false });

  if (statusFilter && statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Gagal mengambil usulan perubahan: ${error.message}`);
  return data;
}

export async function submitChangeProposal(input: ChangeProposalInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("change_proposals")
    .insert({
      family_id: input.family_id,
      target_table: input.target_table,
      target_id: input.target_id || null,
      operation: input.operation,
      proposed_payload: input.proposed_payload,
      justification: input.justification,
      source_id: input.source_id || null,
      status: "pending",
      proposed_by: user?.id,
    })
    .select()
    .single();

  if (error) throw new Error(`Gagal mengajukan usulan: ${error.message}`);
  return data;
}

export async function approveChangeProposal(proposalId: string, notes?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("fn_approve_change_proposal", {
    p_proposal_id: proposalId,
    p_reviewer_id: user?.id,
    p_reviewer_notes: notes || null,
  });

  if (error) throw new Error(`Gagal menyetujui usulan: ${error.message}`);
  return data;
}

export async function rejectChangeProposal(proposalId: string, notes: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("fn_reject_change_proposal", {
    p_proposal_id: proposalId,
    p_reviewer_id: user?.id,
    p_reviewer_notes: notes,
  });

  if (error) throw new Error(`Gagal menolak usulan: ${error.message}`);
  return data;
}

export async function cancelChangeProposal(proposalId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("change_proposals")
    .update({ status: "cancelled" })
    .eq("id", proposalId)
    .select()
    .single();

  if (error) throw new Error(`Gagal membatalkan usulan: ${error.message}`);
  return data;
}

