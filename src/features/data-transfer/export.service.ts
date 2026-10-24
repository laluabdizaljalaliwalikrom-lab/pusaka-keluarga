/**
 * Data Transfer & Backup Engine — Pusaka Keluarga
 * Menghasilkan cadangan data terstruktur JSON dan format standar silsilah internasional GEDCOM 5.5.1.
 */

export interface FamilyBackupPayload {
  version: "1.0";
  exported_at: string;
  family: {
    id: string;
    name: string;
    description?: string | null;
  };
  persons: Array<{
    id: string;
    primary_name: string;
    nickname?: string | null;
    gender: string;
    is_living: boolean;
    birth_date_year?: number | null;
    birth_date_type?: string;
    birth_date_text?: string | null;
    death_date_year?: number | null;
    death_date_type?: string;
    death_date_text?: string | null;
    bio?: string | null;
    alternate_names?: Array<{ name: string; type: string }>;
  }>;
  relationships: Array<{
    id: string;
    parent_id: string;
    child_id: string;
    relationship_type: string;
    confidence: string;
  }>;
  unions: Array<{
    id: string;
    start_date_year?: number | null;
    status: string;
    husband_id?: string;
    wife_id?: string;
    children_ids?: string[];
  }>;
  sources: Array<{
    id: string;
    title: string;
    author?: string | null;
    publication_date?: string | null;
    repository?: string | null;
    source_type: string;
    citation_text?: string | null;
  }>;
}

/**
 * Menghasilkan string JSON cadangan terstruktur
 */
export function generateFamilyJson(payload: FamilyBackupPayload): string {
  return JSON.stringify(payload, null, 2);
}

/**
 * Mengonversi cadangan keluarga ke format standar industri genealogis GEDCOM 5.5.1
 */
export function generateGedcom(payload: FamilyBackupPayload): string {
  const lines: string[] = [];

  // Header GEDCOM
  lines.push("0 HEAD");
  lines.push("1 SOUR PUSAKA_KELUARGA");
  lines.push("2 VERS 1.0");
  lines.push("2 NAME Pusaka Keluarga");
  lines.push("1 GEDC");
  lines.push("2 VERS 5.5.1");
  lines.push("2 FORM LINEAGE-LINKED");
  lines.push("1 CHAR UTF-8");
  lines.push(`1 NOTE Cadangan Silsilah: ${payload.family.name}`);

  // Catat Setiap Individu (INDI)
  for (const person of payload.persons) {
    const indiId = `@I${person.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}@`;
    lines.push(`0 ${indiId} INDI`);

    // Nama
    const nameParts = person.primary_name.trim().split(" ");
    const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : "";
    const givenName = nameParts.length > 1 ? nameParts.slice(0, -1).join(" ") : person.primary_name;
    lines.push(`1 NAME ${givenName} /${surname}/`);
    lines.push(`2 GIVN ${givenName}`);
    if (surname) lines.push(`2 SURN ${surname}`);
    if (person.nickname) lines.push(`2 NICK ${person.nickname}`);

    // Gender
    const sex = person.gender === "male" ? "M" : person.gender === "female" ? "F" : "U";
    lines.push(`1 SEX ${sex}`);

    // Kelahiran (BIRT)
    if (person.birth_date_year || person.birth_date_text) {
      lines.push("1 BIRT");
      if (person.birth_date_year) {
        const prefix = person.birth_date_type === "APPROXIMATE" ? "ABT " : "";
        lines.push(`2 DATE ${prefix}${person.birth_date_year}`);
      }
      if (person.birth_date_text) {
        lines.push(`2 NOTE ${person.birth_date_text}`);
      }
    }

    // Kematian (DEAT)
    if (!person.is_living || person.death_date_year) {
      lines.push("1 DEAT");
      if (person.death_date_year) {
        const prefix = person.death_date_type === "APPROXIMATE" ? "ABT " : "";
        lines.push(`2 DATE ${prefix}${person.death_date_year}`);
      }
    }

    // Biografi / Catatan
    if (person.bio) {
      lines.push(`1 NOTE ${person.bio}`);
    }
  }

  // Catat Ikatan Keluarga & Serikat Pernikahan (FAM)
  for (let idx = 0; idx < payload.unions.length; idx++) {
    const union = payload.unions[idx];
    const famId = `@F${idx + 1}@`;
    lines.push(`0 ${famId} FAM`);

    if (union.husband_id) {
      const husbIndi = `@I${union.husband_id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}@`;
      lines.push(`1 HUSB ${husbIndi}`);
    }

    if (union.wife_id) {
      const wifeIndi = `@I${union.wife_id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}@`;
      lines.push(`1 WIFE ${wifeIndi}`);
    }

    if (union.start_date_year) {
      lines.push("1 MARR");
      lines.push(`2 DATE ${union.start_date_year}`);
    }

    if (union.children_ids) {
      for (const childId of union.children_ids) {
        const childIndi = `@I${childId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8)}@`;
        lines.push(`1 CHIL ${childIndi}`);
      }
    }
  }

  // Trailer Penutup
  lines.push("0 TRLR");

  return lines.join("\n");
}

