import { describe, it, expect } from "vitest";
import {
  canManageMembers,
  canDirectlyEdit,
  canProposeChanges,
  canReviewProposals,
  canViewPrivateData,
  canMergeProfiles,
} from "./roles";

describe("Role Permissions Helper", () => {
  it("Owner should have all privileges", () => {
    expect(canManageMembers("owner")).toBe(true);
    expect(canDirectlyEdit("owner")).toBe(true);
    expect(canProposeChanges("owner")).toBe(true);
    expect(canReviewProposals("owner")).toBe(true);
    expect(canViewPrivateData("owner")).toBe(true);
    expect(canMergeProfiles("owner")).toBe(true);
  });

  it("Family Admin should manage members, review proposals, and merge profiles", () => {
    expect(canManageMembers("family_admin")).toBe(true);
    expect(canDirectlyEdit("family_admin")).toBe(true);
    expect(canReviewProposals("family_admin")).toBe(true);
    expect(canMergeProfiles("family_admin")).toBe(true);
  });

  it("Editor can directly edit and review, but cannot manage members or merge profiles", () => {
    expect(canManageMembers("editor")).toBe(false);
    expect(canDirectlyEdit("editor")).toBe(true);
    expect(canReviewProposals("editor")).toBe(true);
    expect(canMergeProfiles("editor")).toBe(false);
    expect(canViewPrivateData("editor")).toBe(true);
  });

  it("Contributor can only propose changes and cannot directly edit or view private data", () => {
    expect(canManageMembers("contributor")).toBe(false);
    expect(canDirectlyEdit("contributor")).toBe(false);
    expect(canProposeChanges("contributor")).toBe(true);
    expect(canReviewProposals("contributor")).toBe(false);
    expect(canViewPrivateData("contributor")).toBe(false);
  });

  it("Reader cannot propose changes or edit", () => {
    expect(canManageMembers("reader")).toBe(false);
    expect(canDirectlyEdit("reader")).toBe(false);
    expect(canProposeChanges("reader")).toBe(false);
    expect(canReviewProposals("reader")).toBe(false);
    expect(canViewPrivateData("reader")).toBe(false);
  });

  it("Null or undefined role should be denied", () => {
    expect(canManageMembers(null)).toBe(false);
    expect(canDirectlyEdit(undefined)).toBe(false);
  });
});

