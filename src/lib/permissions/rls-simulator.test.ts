import { describe, it, expect } from "vitest";
import {
  canSelectPerson,
  canMutatePerson,
  canSelectMedia,
  canSelectAuditLogs,
  canMutateAuditLogs,
  canReviewProposal,
  canCancelProposal,
  type UserContext,
  type PersonRecord,
  type MediaRecord,
  type ChangeProposalRecord,
} from "./rls-simulator";

describe("RLS Multi-Role Security & Cross-Family Isolation Matrix", () => {
  const familyA = "family-A-uuid";
  const familyB = "family-B-uuid";

  const ownerA: UserContext = {
    userId: "user-owner-A",
    familyMemberships: [{ familyId: familyA, role: "owner", status: "active" }],
  };

  const adminA: UserContext = {
    userId: "user-admin-A",
    familyMemberships: [{ familyId: familyA, role: "family_admin", status: "active" }],
  };

  const editorA: UserContext = {
    userId: "user-editor-A",
    familyMemberships: [{ familyId: familyA, role: "editor", status: "active" }],
  };

  const contributorA: UserContext = {
    userId: "user-contributor-A",
    familyMemberships: [{ familyId: familyA, role: "contributor", status: "active" }],
  };

  const readerA: UserContext = {
    userId: "user-reader-A",
    familyMemberships: [{ familyId: familyA, role: "reader", status: "active" }],
  };

  const outsiderB: UserContext = {
    userId: "user-outsider-B",
    familyMemberships: [{ familyId: familyB, role: "owner", status: "active" }],
  };

  const suspendedUser: UserContext = {
    userId: "user-suspended",
    familyMemberships: [{ familyId: familyA, role: "editor", status: "suspended" }],
  };

  // Test records
  const publicLivingPersonA: PersonRecord = {
    id: "p1",
    family_id: familyA,
    primary_name: "Budi",
    is_living: true,
    is_private: false,
  };

  const privateLivingPersonA: PersonRecord = {
    id: "p2",
    family_id: familyA,
    primary_name: "Rahasia",
    is_living: true,
    is_private: true,
    created_by: "user-editor-A",
  };

  const deceasedPersonA: PersonRecord = {
    id: "p3",
    family_id: familyA,
    primary_name: "Mbah Buyut",
    is_living: false,
    is_private: true, // Deceased persons can be viewed even if marked private
  };

  const privateMediaA: MediaRecord = {
    id: "m1",
    family_id: familyA,
    is_private: true,
    uploaded_by: "user-contributor-A",
  };

  const proposalA: ChangeProposalRecord = {
    id: "cp1",
    family_id: familyA,
    proposed_by: "user-contributor-A",
    status: "pending",
  };

  describe("Cross-Family Isolation (Multi-Tenant)", () => {
    it("Denies outsider from reading Family A persons", () => {
      expect(canSelectPerson(outsiderB, publicLivingPersonA)).toBe(false);
    });

    it("Denies outsider from mutating Family A data", () => {
      expect(canMutatePerson(outsiderB, familyA)).toBe(false);
    });

    it("Denies suspended member from Family A", () => {
      expect(canSelectPerson(suspendedUser, publicLivingPersonA)).toBe(false);
    });

    it("Denies unauthenticated guest (null user)", () => {
      expect(canSelectPerson(null, publicLivingPersonA)).toBe(false);
    });
  });

  describe("Living & Private Person Protection", () => {
    it("Allows Reader to view non-private living person", () => {
      expect(canSelectPerson(readerA, publicLivingPersonA)).toBe(true);
    });

    it("Protects private living person from Reader", () => {
      expect(canSelectPerson(readerA, privateLivingPersonA)).toBe(false);
    });

    it("Protects private living person from Contributor (unless they created it)", () => {
      expect(canSelectPerson(contributorA, privateLivingPersonA)).toBe(false);
    });

    it("Allows Editor, Admin, Owner to view private living person", () => {
      expect(canSelectPerson(editorA, privateLivingPersonA)).toBe(true);
      expect(canSelectPerson(adminA, privateLivingPersonA)).toBe(true);
      expect(canSelectPerson(ownerA, privateLivingPersonA)).toBe(true);
    });

    it("Allows all active members to view deceased ancestors even if marked private", () => {
      expect(canSelectPerson(readerA, deceasedPersonA)).toBe(true);
      expect(canSelectPerson(contributorA, deceasedPersonA)).toBe(true);
    });
  });

  describe("Mutation Privileges (Direct Edit vs Proposals)", () => {
    it("Allows Owner, Admin, Editor to mutate persons directly", () => {
      expect(canMutatePerson(ownerA, familyA)).toBe(true);
      expect(canMutatePerson(adminA, familyA)).toBe(true);
      expect(canMutatePerson(editorA, familyA)).toBe(true);
    });

    it("Prohibits Contributor and Reader from directly mutating persons", () => {
      expect(canMutatePerson(contributorA, familyA)).toBe(false);
      expect(canMutatePerson(readerA, familyA)).toBe(false);
    });
  });

  describe("Private Media Access", () => {
    it("Allows uploader to access their own private media", () => {
      expect(canSelectMedia(contributorA, privateMediaA)).toBe(true);
    });

    it("Prohibits Reader from accessing another member's private media", () => {
      expect(canSelectMedia(readerA, privateMediaA)).toBe(false);
    });

    it("Allows Admin to view private media", () => {
      expect(canSelectMedia(adminA, privateMediaA)).toBe(true);
    });
  });

  describe("Audit Trail Immutability & Access", () => {
    it("Allows only Owner and Family Admin to read audit logs", () => {
      expect(canSelectAuditLogs(ownerA, familyA)).toBe(true);
      expect(canSelectAuditLogs(adminA, familyA)).toBe(true);
      expect(canSelectAuditLogs(editorA, familyA)).toBe(false);
      expect(canSelectAuditLogs(contributorA, familyA)).toBe(false);
      expect(canSelectAuditLogs(readerA, familyA)).toBe(false);
    });

    it("Strictly denies mutation/deletion of audit logs for ANY role", () => {
      expect(canMutateAuditLogs()).toBe(false);
    });
  });

  describe("Change Proposals Review and Cancellation", () => {
    it("Allows Editor, Admin, Owner to review proposals", () => {
      expect(canReviewProposal(editorA, familyA)).toBe(true);
      expect(canReviewProposal(adminA, familyA)).toBe(true);
      expect(canReviewProposal(ownerA, familyA)).toBe(true);
      expect(canReviewProposal(contributorA, familyA)).toBe(false);
    });

    it("Allows proposer to cancel their own pending proposal", () => {
      expect(canCancelProposal(contributorA, proposalA)).toBe(true);
    });

    it("Disallows another user from cancelling the proposal", () => {
      expect(canCancelProposal(readerA, proposalA)).toBe(false);
    });
  });
});

