import { FamilyRole } from "@/types/database.types";

export const ROLE_HIERARCHY: Record<FamilyRole, number> = {
  owner: 100,
  family_admin: 80,
  editor: 60,
  contributor: 40,
  reader: 20,
};

export function canManageMembers(role?: FamilyRole | null): boolean {
  if (!role) return false;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.family_admin;
}

export function canDirectlyEdit(role?: FamilyRole | null): boolean {
  if (!role) return false;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.editor;
}

export function canProposeChanges(role?: FamilyRole | null): boolean {
  if (!role) return false;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.contributor;
}

export function canReviewProposals(role?: FamilyRole | null): boolean {
  if (!role) return false;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.editor;
}

export function canViewPrivateData(role?: FamilyRole | null): boolean {
  if (!role) return false;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.editor;
}

export function canMergeProfiles(role?: FamilyRole | null): boolean {
  if (!role) return false;
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY.family_admin;
}

