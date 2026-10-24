import { z } from "zod";

export const DateAccuracyEnum = z.enum([
  "EXACT",
  "APPROXIMATE",
  "BEFORE",
  "AFTER",
  "BETWEEN",
  "UNKNOWN",
]);

export const GenderEnum = z.enum(["male", "female", "unknown", "other"]);

export const personSchema = z.object({
  primary_name: z
    .string()
    .min(1, "Nama primer wajib diisi")
    .max(200, "Nama maksimal 200 karakter"),
  nickname: z.string().max(100).optional().nullable(),
  gender: GenderEnum.default("unknown"),
  is_living: z.boolean().default(true),
  birth_date_exact: z.string().optional().nullable(),
  birth_date_year: z.number().int().min(1000).max(2100).optional().nullable(),
  birth_date_type: DateAccuracyEnum.default("UNKNOWN"),
  birth_date_text: z.string().max(100).optional().nullable(),
  birth_place_id: z.string().uuid().optional().nullable(),
  death_date_exact: z.string().optional().nullable(),
  death_date_year: z.number().int().min(1000).max(2100).optional().nullable(),
  death_date_type: DateAccuracyEnum.default("UNKNOWN"),
  death_date_text: z.string().max(100).optional().nullable(),
  death_place_id: z.string().uuid().optional().nullable(),
  burial_place_id: z.string().uuid().optional().nullable(),
  bio: z.string().optional().nullable(),
  is_private: z.boolean().default(false),
});

export const parentChildRelationSchema = z.object({
  family_id: z.string().uuid(),
  parent_id: z.string().uuid("ID orang tua tidak valid"),
  child_id: z.string().uuid("ID anak tidak valid"),
  union_id: z.string().uuid().optional().nullable(),
  relationship_type: z.enum([
    "biological",
    "adopted",
    "step",
    "foster",
    "guardian",
    "unknown",
  ]).default("biological"),
  confidence: z.enum(["verified", "probable", "uncertain", "disputed"]).default("verified"),
  notes: z.string().optional().nullable(),
}).refine((data) => data.parent_id !== data.child_id, {
  message: "Orang tua tidak boleh sama dengan anak",
  path: ["child_id"],
});

export type PersonFormData = z.infer<typeof personSchema>;
export type ParentChildRelationFormData = z.infer<typeof parentChildRelationSchema>;

