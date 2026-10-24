import { FamilyRole } from "@/types/database.types";

export interface UserContext {
  userId: string;
  familyMemberships: Array<{
    familyId: string;
    role: FamilyRole;
    status: "active" | "invited" | "suspended";
  }>;
}

export interface PersonRecord {
  id: string;
  family_id: string;
  primary_name: string;
  is_living: boolean;
  is_private: boolean;
  created_by?: string | null;
}

export interface MediaRecord {
  id: string;
  family_id: string;
  is_private: boolean;
  uploaded_by?: string | null;
}

export interface ChangeProposalRecord {
  id: string;
  family_id: string;
  proposed_by: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
}

/**
 * Simulasi evaluasi kebijakan RLS PostgreSQL public.persons
 */
export function canSelectPerson(user: UserContext | null, person: PersonRecord): boolean {
  if (!user) return false;

  const membership = user.familyMemberships.find(
    (m) => m.familyId === person.family_id && m.status === "active"
  );
  if (!membership) return false;

  // Kebijakan: publik jika tidak privat ATAU sudah wafat ATAU role editor/admin/owner ATAU pembuatnya sendiri
  if (!person.is_private) return true;
  if (!person.is_living) return true;
  if (["owner", "family_admin", "editor"].includes(membership.role)) return true;
  if (person.created_by === user.userId) return true;

  return false;
}

export function canMutatePerson(user: UserContext | null, familyId: string): boolean {
  if (!user) return false;
  const membership = user.familyMemberships.find(
    (m) => m.familyId === familyId && m.status === "active"
  );
  if (!membership) return false;
  return ["owner", "family_admin", "editor"].includes(membership.role);
}

/**
 * Simulasi evaluasi kebijakan RLS public.media
 */
export function canSelectMedia(user: UserContext | null, media: MediaRecord): boolean {
  if (!user) return false;
  const membership = user.familyMemberships.find(
    (m) => m.familyId === media.family_id && m.status === "active"
  );
  if (!membership) return false;

  if (!media.is_private) return true;
  if (["owner", "family_admin", "editor"].includes(membership.role)) return true;
  if (media.uploaded_by === user.userId) return true;

  return false;
}

/**
 * Simulasi evaluasi kebijakan RLS public.audit_logs
 */
export function canSelectAuditLogs(user: UserContext | null, familyId: string): boolean {
  if (!user) return false;
  const membership = user.familyMemberships.find(
    (m) => m.familyId === familyId && m.status === "active"
  );
  if (!membership) return false;
  return ["owner", "family_admin"].includes(membership.role);
}

export function canMutateAuditLogs(): boolean {
  // Tidak ada kebijakan UPDATE atau DELETE untuk audit_logs (Strictly Immutable!)
  return false;
}

/**
 * Simulasi evaluasi kebijakan RLS public.change_proposals
 */
export function canReviewProposal(user: UserContext | null, familyId: string): boolean {
  if (!user) return false;
  const membership = user.familyMemberships.find(
    (m) => m.familyId === familyId && m.status === "active"
  );
  if (!membership) return false;
  return ["owner", "family_admin", "editor"].includes(membership.role);
}

export function canCancelProposal(
  user: UserContext | null,
  proposal: ChangeProposalRecord
): boolean {
  if (!user) return false;
  return proposal.proposed_by === user.userId && proposal.status === "pending";
}

