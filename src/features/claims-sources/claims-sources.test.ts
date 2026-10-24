import { describe, it, expect } from "vitest";
import { claimSchema } from "@/lib/validators/claim";
import { sourceSchema } from "@/lib/validators/source";
import { unionSchema } from "@/lib/validators/union";

describe("Genealogy Domain Form Validation (Fase 4)", () => {
  it("validates correct source payload", () => {
    const validSource = {
      family_id: "f0000000-0000-0000-0000-000000000001",
      title: "Akta Kelahiran Kolonial No. 441/1920",
      source_type: "birth_certificate",
      author: "Gemeente Solo",
      repository: "Arsip Daerah Surakarta",
    };
    const res = sourceSchema.safeParse(validSource);
    expect(res.success).toBe(true);
  });

  it("fails source payload without title or invalid UUID", () => {
    const invalidSource = {
      family_id: "not-a-uuid",
      title: "",
    };
    const res = sourceSchema.safeParse(invalidSource);
    expect(res.success).toBe(false);
  });

  it("validates union schema requiring at least 2 partners", () => {
    const validUnion = {
      family_id: "f0000000-0000-0000-0000-000000000001",
      type: "marriage",
      status: "active",
      start_date_year: 1945,
      partner_ids: [
        "b0000000-0000-0000-0000-000000000001",
        "b0000000-0000-0000-0000-000000000002",
      ],
    };
    const res = unionSchema.safeParse(validUnion);
    expect(res.success).toBe(true);

    const singlePartnerUnion = {
      ...validUnion,
      partner_ids: ["b0000000-0000-0000-0000-000000000001"],
    };
    const failRes = unionSchema.safeParse(singlePartnerUnion);
    expect(failRes.success).toBe(false);
  });

  it("validates claim payload with 5 allowed verification states", () => {
    const statuses = ["belum_ditinjau", "sedang_ditinjau", "diterima", "diperdebatkan", "ditolak"];
    for (const st of statuses) {
      const payload = {
        family_id: "f0000000-0000-0000-0000-000000000001",
        subject_person_id: "b0000000-0000-0000-0000-000000000001",
        claim_type: "death_place",
        predicate: "Wafat di Yogyakarta",
        status: st,
      };
      const res = claimSchema.safeParse(payload);
      expect(res.success).toBe(true);
    }
  });
});

