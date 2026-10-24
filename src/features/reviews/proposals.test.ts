import { describe, it, expect } from "vitest";

describe("Change Proposals & Review Workflow (Fase 7)", () => {
  type ProposalStatus = "pending" | "approved" | "rejected" | "cancelled";

  function transitionProposal(
    currentStatus: ProposalStatus,
    action: "approve" | "reject" | "cancel",
    userRole: string,
    isProposer: boolean
  ): { allowed: boolean; newStatus?: ProposalStatus; error?: string } {
    if (currentStatus !== "pending") {
      return { allowed: false, error: "Hanya usulan pending yang dapat diubah" };
    }

    if (action === "cancel") {
      if (isProposer) {
        return { allowed: true, newStatus: "cancelled" };
      }
      return { allowed: false, error: "Hanya pengusul yang dapat membatalkan usulannya" };
    }

    if (action === "approve" || action === "reject") {
      if (["owner", "family_admin", "editor"].includes(userRole)) {
        return {
          allowed: true,
          newStatus: action === "approve" ? "approved" : "rejected",
        };
      }
      return { allowed: false, error: "Memerlukan peran editor/admin/owner untuk kurasi" };
    }

    return { allowed: false, error: "Aksi tidak dikenali" };
  }

  it("allows Editor to approve pending proposal", () => {
    const res = transitionProposal("pending", "approve", "editor", false);
    expect(res.allowed).toBe(true);
    expect(res.newStatus).toBe("approved");
  });

  it("allows Family Admin to reject pending proposal with notes", () => {
    const res = transitionProposal("pending", "reject", "family_admin", false);
    expect(res.allowed).toBe(true);
    expect(res.newStatus).toBe("rejected");
  });

  it("denies regular Contributor from approving proposals", () => {
    const res = transitionProposal("pending", "approve", "contributor", false);
    expect(res.allowed).toBe(false);
  });

  it("allows proposer to cancel their own pending proposal", () => {
    const res = transitionProposal("pending", "cancel", "contributor", true);
    expect(res.allowed).toBe(true);
    expect(res.newStatus).toBe("cancelled");
  });

  it("denies modifying an already approved proposal", () => {
    const res = transitionProposal("approved", "reject", "owner", false);
    expect(res.allowed).toBe(false);
  });
});

