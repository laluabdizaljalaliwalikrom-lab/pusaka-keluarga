import { z } from "zod";
import { DateAccuracyEnum } from "./person";

export const UnionTypeEnum = z.enum([
  "marriage",
  "civil_union",
  "religious",
  "customary",
  "unmarried",
  "unknown",
]);

export const UnionStatusEnum = z.enum([
  "active",
  "divorced",
  "annulled",
  "widowed",
  "separated",
  "unknown",
]);

export const unionSchema = z.object({
  family_id: z.string().uuid(),
  type: UnionTypeEnum.default("marriage"),
  status: UnionStatusEnum.default("active"),
  start_date_exact: z.string().optional().nullable(),
  start_date_year: z.number().int().min(1000).max(2100).optional().nullable(),
  start_date_type: DateAccuracyEnum.default("UNKNOWN"),
  start_date_text: z.string().max(100).optional().nullable(),
  end_date_exact: z.string().optional().nullable(),
  end_date_year: z.number().int().min(1000).max(2100).optional().nullable(),
  end_date_type: DateAccuracyEnum.default("UNKNOWN"),
  end_date_text: z.string().max(100).optional().nullable(),
  place_id: z.string().uuid().optional().nullable(),
  notes: z.string().optional().nullable(),
  partner_ids: z.array(z.string().uuid()).min(2, "Serikat hubungan membutuhkan minimal 2 individu"),
});

export type UnionFormData = z.infer<typeof unionSchema>;

