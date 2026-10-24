import { z } from "zod";
import { FamilyBackupPayload } from "./export.service";

export const backupSchema = z.object({
  version: z.literal("1.0"),
  exported_at: z.string(),
  family: z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string().optional().nullable(),
  }),
  persons: z.array(
    z.object({
      id: z.string(),
      primary_name: z.string().min(1),
      nickname: z.string().optional().nullable(),
      gender: z.string(),
      is_living: z.boolean(),
      birth_date_year: z.number().optional().nullable(),
      birth_date_type: z.string().optional(),
      birth_date_text: z.string().optional().nullable(),
      death_date_year: z.number().optional().nullable(),
      death_date_type: z.string().optional(),
      death_date_text: z.string().optional().nullable(),
      bio: z.string().optional().nullable(),
    })
  ),
  relationships: z.array(
    z.object({
      id: z.string(),
      parent_id: z.string(),
      child_id: z.string(),
      relationship_type: z.string().default("biological"),
      confidence: z.string().default("verified"),
    })
  ),
  unions: z.array(
    z.object({
      id: z.string(),
      start_date_year: z.number().optional().nullable(),
      status: z.string().default("active"),
      husband_id: z.string().optional(),
      wife_id: z.string().optional(),
      children_ids: z.array(z.string()).optional(),
    })
  ),
  sources: z.array(z.any()).optional().default([]),
});

export interface ImportPreviewSummary {
  valid: boolean;
  familyName: string;
  totalPersons: number;
  totalRelationships: number;
  totalUnions: number;
  totalSources: number;
  errors?: string[];
  data?: FamilyBackupPayload;
}

export function validateJsonBackup(jsonString: string): ImportPreviewSummary {
  try {
    const raw = JSON.parse(jsonString);
    const parsed = backupSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        valid: false,
        familyName: "Tidak Dikenal",
        totalPersons: 0,
        totalRelationships: 0,
        totalUnions: 0,
        totalSources: 0,
        errors: parsed.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`),
      };
    }

    const payload = parsed.data as FamilyBackupPayload;
    return {
      valid: true,
      familyName: payload.family.name,
      totalPersons: payload.persons.length,
      totalRelationships: payload.relationships.length,
      totalUnions: payload.unions.length,
      totalSources: payload.sources.length,
      data: payload,
    };
  } catch (err: any) {
    return {
      valid: false,
      familyName: "Galat Format",
      totalPersons: 0,
      totalRelationships: 0,
      totalUnions: 0,
      totalSources: 0,
      errors: [`Format file bukan JSON valid: ${err.message}`],
    };
  }
}

/**
 * Parser sederhana untuk membaca berkas GEDCOM 5.5.1
 */
export function parseGedcomBasic(gedcomText: string): {
  individualsCount: number;
  familiesCount: number;
  individuals: Array<{ id: string; name: string; sex: string; birthYear?: number }>;
} {
  const lines = gedcomText.split(/\r?\n/);
  const individuals: Array<{ id: string; name: string; sex: string; birthYear?: number }> = [];
  let currentIndi: { id: string; name: string; sex: string; birthYear?: number } | null = null;
  let inBirt = false;
  let familiesCount = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Deteksi Individu baru
    const indiMatch = line.match(/^0\s+(@I[A-Za-z0-9_]+@)\s+INDI/);
    if (indiMatch) {
      if (currentIndi) individuals.push(currentIndi);
      currentIndi = { id: indiMatch[1], name: "Tanpa Nama", sex: "U" };
      inBirt = false;
      continue;
    }

    // Deteksi Family baru
    if (/^0\s+@[A-Za-z0-9_]+@\s+FAM/.test(line)) {
      if (currentIndi) {
        individuals.push(currentIndi);
        currentIndi = null;
      }
      familiesCount++;
      continue;
    }

    if (currentIndi) {
      if (line.startsWith("1 NAME ")) {
        // Hapus slash pada surname: "Bambang /Soedirjo/" -> "Bambang Soedirjo"
        currentIndi.name = line.substring(7).replace(/\//g, "").trim();
      } else if (line.startsWith("1 SEX ")) {
        currentIndi.sex = line.substring(6).trim();
      } else if (line.startsWith("1 BIRT")) {
        inBirt = true;
      } else if (inBirt && line.startsWith("2 DATE ")) {
        const yearMatch = line.match(/\b(1\d{3}|20\d{2})\b/);
        if (yearMatch) {
          currentIndi.birthYear = parseInt(yearMatch[1]);
        }
        inBirt = false;
      } else if (line.startsWith("1 ")) {
        inBirt = false;
      }
    }
  }

  if (currentIndi) individuals.push(currentIndi);

  return {
    individualsCount: individuals.length,
    familiesCount,
    individuals,
  };
}

