import { z } from "zod";

export const ClaimStatusEnum = z.enum([
  "belum_ditinjau",
  "sedang_ditinjau",
  "diterima",
  "diperdebatkan",
  "ditolak",
]);

export const EvidenceQualityEnum = z.enum([
  "direct",
  "indirect",
  "hearsay",
  "questionable",
]);

export const claimSchema = z.object({
  family_id: z.string().uuid(),
  subject_person_id: z.string().uuid("ID individu subjek wajib valid"),
  claim_type: z.string().min(1, "Tipe klaim wajib diisi"),
  predicate: z.string().min(1, "Pernyataan fakta wajib diisi"),
  raw_data: z.record(z.any()).default({}),
  status: ClaimStatusEnum.default("belum_ditinjau"),
  notes: z.string().optional().nullable(),
  source_id: z.string().uuid().optional().nullable(),
  page_or_reference: z.string().optional().nullable(),
  evidence_quality: EvidenceQualityEnum.default("direct"),
});

export type ClaimFormData = z.infer<typeof claimSchema>;

