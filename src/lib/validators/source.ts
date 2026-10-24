import { z } from "zod";

export const SourceTypeEnum = z.enum([
  "birth_certificate",
  "death_certificate",
  "marriage_certificate",
  "family_book",
  "oral_history",
  "grave_stone",
  "census",
  "photograph",
  "other",
]);

export const sourceSchema = z.object({
  family_id: z.string().uuid(),
  title: z.string().min(1, "Judul sumber wajib diisi").max(250),
  author: z.string().max(200).optional().nullable(),
  publication_date: z.string().max(100).optional().nullable(),
  repository: z.string().optional().nullable(),
  source_type: SourceTypeEnum.default("family_book"),
  citation_text: z.string().optional().nullable(),
  url: z.string().url("Format URL tidak valid").optional().nullable().or(z.literal("")),
});

export type SourceFormData = z.infer<typeof sourceSchema>;

