import { describe, it, expect } from "vitest";
import {
  findPotentialDuplicates,
  normalizeName,
  stringSimilarity,
  type CandidatePerson,
} from "./duplicate-detector";

describe("Duplicate Detection Engine", () => {
  it("normalizes names by stripping common Indonesian honorific titles", () => {
    expect(normalizeName("Raden Mas Kartosoedirjo")).toBe("kartosudiryo");
    expect(normalizeName("Hj. Siti Aminah")).toBe("siti aminah");
    expect(normalizeName("K.R.T. Soediningrat")).toBe("sudiningrat");
  });

  it("calculates high similarity for typo variations", () => {
    const sim = stringSimilarity("Bambang Soedirjo", "Bambang Sudiryo");
    expect(sim).toBeGreaterThan(0.7);
  });

  it("detects exact and high-confidence duplicates with matching birth years", () => {
    const existingList: CandidatePerson[] = [
      {
        id: "p1",
        primary_name: "Raden Mas Kartosoedirjo",
        nickname: "Mbah Karto",
        gender: "male",
        birth_date_year: 1885,
        alternate_names: ["K. R. T. Kartodiningrat", "Kartopawiro"],
      },
      {
        id: "p2",
        primary_name: "Bambang Soedirjo",
        gender: "male",
        birth_date_year: 1915,
      },
    ];

    const target = {
      primary_name: "Kartosoedirjo",
      nickname: "Mbah Karto",
      gender: "male",
      birth_date_year: 1885,
    };

    const matches = findPotentialDuplicates(target, existingList);
    expect(matches.length).toBeGreaterThan(0);
    expect(matches[0].candidate.id).toBe("p1");
    expect(matches[0].score).toBeGreaterThan(80);
    expect(matches[0].reasons).toContain("Tahun lahir sama persis (1885)");
  });

  it("detects duplicate based on alternative names", () => {
    const existingList: CandidatePerson[] = [
      {
        id: "p1",
        primary_name: "Kartosoedirjo",
        gender: "male",
        alternate_names: ["Kartopawiro"],
      },
    ];

    const target = {
      primary_name: "Kartopawiro",
      gender: "male",
    };

    const matches = findPotentialDuplicates(target, existingList);
    expect(matches.length).toBe(1);
    expect(matches[0].candidate.id).toBe("p1");
  });

  it("penalizes score when birth year difference is huge", () => {
    const existingList: CandidatePerson[] = [
      {
        id: "p1",
        primary_name: "Bambang Soedirjo",
        gender: "male",
        birth_date_year: 1915,
      },
    ];

    const target = {
      primary_name: "Bambang Soedirjo",
      gender: "male",
      birth_date_year: 1980, // Selisih 65 tahun! (kemungkinan kakek vs cucu senama)
    };

    const matches = findPotentialDuplicates(target, existingList, 70);
    expect(matches.length).toBe(0); // Tereliminasi oleh penalti rentang usia
  });
});
