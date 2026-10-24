import { createClient } from "@/lib/supabase/server";

export interface MediaUploadInput {
  family_id: string;
  person_id?: string | null;
  source_id?: string | null;
  file_name: string;
  file_type: string;
  file_size_bytes: number;
  caption?: string | null;
  is_private?: boolean;
}

export async function createMediaRecord(input: MediaUploadInput, storagePath: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("media")
    .insert({
      family_id: input.family_id,
      person_id: input.person_id || null,
      source_id: input.source_id || null,
      storage_path: storagePath,
      file_name: input.file_name,
      file_type: input.file_type,
      file_size_bytes: input.file_size_bytes,
      caption: input.caption || null,
      is_private: input.is_private ?? true,
      uploaded_by: user?.id,
    })
    .select()
    .single();

  if (error) throw new Error(`Gagal mencatat media: ${error.message}`);
  return data;
}

export async function getMediaSignedUrl(storagePath: string, expiresInSeconds = 3600) {
  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from("family-media")
    .createSignedUrl(storagePath, expiresInSeconds);

  if (error) throw new Error(`Gagal membuat signed URL: ${error.message}`);
  return data.signedUrl;
}

