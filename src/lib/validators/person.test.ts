import { describe, it, expect } from "vitest";
import { personSchema, parentChildRelationSchema } from "./person";

describe("Genealogy Person Validation", () => {
  it("validates valid person payload", () => {
    const validData = {
      primary_name: "Raden Mas Soediro",
      nickname: "Soediro",
      gender: "male",
      is_living: false,
      birth_date_year: 1890,
      birth_date_type: "APPROXIMATE",
      birth_date_text: "Sekitar tahun 1890 di Singosari",
    };
    const result = personSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("fails if primary_name is empty", () => {
    const invalidData = {
      primary_name: "",
      gender: "male",
    };
    const result = personSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("rejects parent-child relationship where parent_id is equal to child_id", () => {
    const selfParentId = "11111111-1111-1111-1111-111111111111";
    const invalidRelation = {
      family_id: "22222222-2222-2222-2222-222222222222",
      parent_id: selfParentId,
      child_id: selfParentId,
      relationship_type: "biological",
    };
    const result = parentChildRelationSchema.safeParse(invalidRelation);
    expect(result.success).toBe(false);
  });
});

