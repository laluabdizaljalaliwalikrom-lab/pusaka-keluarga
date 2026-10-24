import { describe, it, expect } from "vitest";
import {
  generateFamilyJson,
  generateGedcom,
  type FamilyBackupPayload,
} from "./export.service";
import { validateJsonBackup, parseGedcomBasic } from "./import.service";

describe("Genealogy Import/Export & GEDCOM 5.5.1 Suite (Fase 8)", () => {
  const samplePayload: FamilyBackupPayload = {
    version: "1.0",
    exported_at: "2026-10-24T12:00:00Z",
    family: {
      id: "f0000000-0000-0000-0000-000000000001",
      name: "Bani Kartosoedirjo",
      description: "Trah Kasunanan Surakarta",
    },
    persons: [
      {
        id: "b0000001",
        primary_name: "Raden Mas Kartosoedirjo",
        nickname: "Mbah Karto",
        gender: "male",
        is_living: false,
        birth_date_year: 1885,
        birth_date_type: "APPROXIMATE",
        death_date_year: 1952,
      },
      {
        id: "b0000002",
        primary_name: "Raden Ajeng Siti Aminah",
        nickname: "Mbah Aminah",
        gender: "female",
        is_living: false,
        birth_date_year: 1890,
        death_date_year: 1940,
      },
      {
        id: "b0000003",
        primary_name: "Bambang Soedirjo",
        gender: "male",
        is_living: false,
        birth_date_year: 1915,
        death_date_year: 1988,
      },
    ],
    relationships: [
      {
        id: "r1",
        parent_id: "b0000001",
        child_id: "b0000003",
        relationship_type: "biological",
        confidence: "verified",
      },
      {
        id: "r2",
        parent_id: "b0000002",
        child_id: "b0000003",
        relationship_type: "biological",
        confidence: "verified",
      },
    ],
    unions: [
      {
        id: "u1",
        start_date_year: 1912,
        status: "widowed",
        husband_id: "b0000001",
        wife_id: "b0000002",
        children_ids: ["b0000003"],
      },
    ],
    sources: [
      {
        id: "s1",
        title: "Buku Silsilah Kulawarga Kasunanan Surakarta",
        author: "Sasana Pustaka",
        publication_date: "1935",
        source_type: "family_book",
      },
    ],
  };

  it("exports valid JSON and validates schema cleanly", () => {
    const jsonStr = generateFamilyJson(samplePayload);
    expect(jsonStr).toContain("Bani Kartosoedirjo");

    const result = validateJsonBackup(jsonStr);
    expect(result.valid).toBe(true);
    expect(result.totalPersons).toBe(3);
    expect(result.totalRelationships).toBe(2);
    expect(result.totalUnions).toBe(1);
    expect(result.totalSources).toBe(1);
  });

  it("rejects corrupt or invalid JSON backup", () => {
    const corruptJson = '{"version":"1.0","family":{"id":"123"}}';
    const result = validateJsonBackup(corruptJson);
    expect(result.valid).toBe(false);
    expect(result.errors?.length).toBeGreaterThan(0);
  });

  it("generates standard GEDCOM 5.5.1 with correct tags", () => {
    const gedcom = generateGedcom(samplePayload);

    // Header & Trailer tags
    expect(gedcom).toContain("0 HEAD");
    expect(gedcom).toContain("1 GEDC");
    expect(gedcom).toContain("2 VERS 5.5.1");
    expect(gedcom).toContain("0 TRLR");

    // INDI tags
    expect(gedcom).toContain("INDI");
    expect(gedcom).toContain("1 SEX M");
    expect(gedcom).toContain("1 SEX F");
    expect(gedcom).toContain("1 BIRT");
    expect(gedcom).toContain("2 DATE ABT 1885");
    expect(gedcom).toContain("1 DEAT");

    // FAM tags
    expect(gedcom).toContain("0 @F1@ FAM");
    expect(gedcom).toContain("1 HUSB");
    expect(gedcom).toContain("1 WIFE");
    expect(gedcom).toContain("1 MARR");
    expect(gedcom).toContain("2 DATE 1912");
    expect(gedcom).toContain("1 CHIL");
  });

  it("parses generated GEDCOM back into structured records", () => {
    const gedcom = generateGedcom(samplePayload);
    const parsed = parseGedcomBasic(gedcom);

    expect(parsed.individualsCount).toBe(3);
    expect(parsed.familiesCount).toBe(1);

    const karto = parsed.individuals.find((i) => i.name.includes("Kartosoedirjo"));
    expect(karto).toBeDefined();
    expect(karto?.sex).toBe("M");
    expect(karto?.birthYear).toBe(1885);
  });
});

