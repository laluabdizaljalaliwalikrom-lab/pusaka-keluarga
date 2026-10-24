-- ==============================================================================
-- PUSAKA KELUARGA — MIGRATION 004: CHANGE PROPOSAL APPROVAL & STORAGE BUCKET
-- ==============================================================================

-- 1. Storage Bucket 'family-media'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'family-media',
    'family-media',
    false, -- Privat, wajib URL bertanda tangan (signed URL) atau session check
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 10485760;

-- Kebijakan Storage RLS
CREATE POLICY "family_media_select_policy" ON storage.objects
    FOR SELECT TO authenticated
    USING (
        bucket_id = 'family-media'
        AND EXISTS (
            SELECT 1 FROM public.media m
            WHERE m.storage_path = storage.objects.name
              AND public.is_family_member(m.family_id)
        )
    );

CREATE POLICY "family_media_insert_policy" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (
        bucket_id = 'family-media'
        AND auth.role() = 'authenticated'
    );

-- 2. Prosedur Transaksional Persetujuan Usulan Perubahan (Approve Proposal)
CREATE OR REPLACE FUNCTION public.fn_approve_change_proposal(
    p_proposal_id UUID,
    p_reviewer_id UUID,
    p_reviewer_notes TEXT DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
    v_proposal RECORD;
    v_can_review BOOLEAN;
    v_applied_record_id UUID;
    v_payload JSONB;
BEGIN
    -- 1. Ambil usulan perubahan
    SELECT * INTO v_proposal 
    FROM public.change_proposals 
    WHERE id = p_proposal_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usulan perubahan tidak ditemukan';
    END IF;

    IF v_proposal.status <> 'pending' THEN
        RAISE EXCEPTION 'Hanya usulan berstatus pending yang dapat disetujui';
    END IF;

    -- 2. Verifikasi hak kurator/admin
    v_can_review := public.has_family_role(
        v_proposal.family_id, 
        ARRAY['owner', 'family_admin', 'editor']::family_role_type[]
    );

    IF NOT v_can_review THEN
        RAISE EXCEPTION 'Anda tidak memiliki wewenang untuk menyetujui usulan perubahan ini';
    END IF;

    v_payload := v_proposal.proposed_payload;

    -- 3. Eksekusi mutasi sesuai target tabel dan operasi
    IF v_proposal.target_table = 'persons' THEN
        IF v_proposal.operation = 'INSERT' THEN
            INSERT INTO public.persons (
                family_id,
                primary_name,
                nickname,
                gender,
                is_living,
                birth_date_year,
                birth_date_type,
                birth_date_text,
                death_date_year,
                death_date_type,
                bio,
                created_by
            ) VALUES (
                v_proposal.family_id,
                v_payload->>'primary_name',
                v_payload->>'nickname',
                COALESCE((v_payload->>'gender')::gender_type, 'unknown'::gender_type),
                COALESCE((v_payload->>'is_living')::boolean, true),
                (v_payload->>'birth_date_year')::smallint,
                COALESCE((v_payload->>'birth_date_type')::date_accuracy_type, 'UNKNOWN'::date_accuracy_type),
                v_payload->>'birth_date_text',
                (v_payload->>'death_date_year')::smallint,
                COALESCE((v_payload->>'death_date_type')::date_accuracy_type, 'UNKNOWN'::date_accuracy_type),
                v_payload->>'bio',
                v_proposal.proposed_by
            )
            RETURNING id INTO v_applied_record_id;
        ELSIF v_proposal.operation = 'UPDATE' THEN
            UPDATE public.persons SET
                primary_name = COALESCE(v_payload->>'primary_name', primary_name),
                nickname = COALESCE(v_payload->>'nickname', nickname),
                gender = COALESCE((v_payload->>'gender')::gender_type, gender),
                is_living = COALESCE((v_payload->>'is_living')::boolean, is_living),
                birth_date_year = COALESCE((v_payload->>'birth_date_year')::smallint, birth_date_year),
                death_date_year = COALESCE((v_payload->>'death_date_year')::smallint, death_date_year),
                bio = COALESCE(v_payload->>'bio', bio),
                updated_at = now()
            WHERE id = v_proposal.target_id;
            v_applied_record_id := v_proposal.target_id;
        END IF;

    ELSIF v_proposal.target_table = 'parent_child_relationships' THEN
        IF v_proposal.operation = 'INSERT' THEN
            -- Gunakan fungsi anti-siklus
            v_applied_record_id := public.fn_add_parent_child_relationship(
                v_proposal.family_id,
                (v_payload->>'parent_id')::UUID,
                (v_payload->>'child_id')::UUID,
                (v_payload->>'union_id')::UUID,
                COALESCE((v_payload->>'relationship_type')::relationship_category_type, 'biological'::relationship_category_type),
                COALESCE((v_payload->>'confidence')::confidence_type, 'verified'::confidence_type),
                v_payload->>'notes'
            );
        END IF;
    END IF;

    -- 4. Catat di Audit Log
    INSERT INTO public.audit_logs (
        family_id,
        table_name,
        record_id,
        operation,
        actor_id,
        old_values,
        new_values,
        change_summary
    ) VALUES (
        v_proposal.family_id,
        v_proposal.target_table,
        COALESCE(v_applied_record_id, v_proposal.target_id, v_proposal.id),
        'APPROVE_PROPOSAL',
        p_reviewer_id,
        jsonb_build_object('proposal_id', v_proposal.id),
        v_payload,
        format('Usulan %s pada tabel %s disetujui oleh reviewer: %s', v_proposal.operation, v_proposal.target_table, COALESCE(p_reviewer_notes, '-'))
    );

    -- 5. Perbarui status proposal
    UPDATE public.change_proposals SET
        status = 'approved',
        reviewed_by = p_reviewer_id,
        reviewed_at = now(),
        reviewer_notes = p_reviewer_notes,
        updated_at = now()
    WHERE id = p_proposal_id;

    RETURN jsonb_build_object(
        'success', true,
        'proposal_id', p_proposal_id,
        'status', 'approved',
        'applied_record_id', v_applied_record_id
    );
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Prosedur Penolakan Usulan Perubahan (Reject Proposal)
CREATE OR REPLACE FUNCTION public.fn_reject_change_proposal(
    p_proposal_id UUID,
    p_reviewer_id UUID,
    p_reviewer_notes TEXT
) RETURNS JSONB AS $$
DECLARE
    v_proposal RECORD;
BEGIN
    SELECT * INTO v_proposal FROM public.change_proposals WHERE id = p_proposal_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Usulan perubahan tidak ditemukan';
    END IF;

    IF v_proposal.status <> 'pending' THEN
        RAISE EXCEPTION 'Hanya usulan pending yang dapat ditolak';
    END IF;

    IF NOT public.has_family_role(v_proposal.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]) THEN
        RAISE EXCEPTION 'Tidak memiliki wewenang kurasi';
    END IF;

    -- Catat di Audit Log
    INSERT INTO public.audit_logs (
        family_id,
        table_name,
        record_id,
        operation,
        actor_id,
        change_summary
    ) VALUES (
        v_proposal.family_id,
        'change_proposals',
        p_proposal_id,
        'REJECT_PROPOSAL',
        p_reviewer_id,
        format('Usulan perubahan ditolak. Catatan: %s', p_reviewer_notes)
    );

    -- Update status
    UPDATE public.change_proposals SET
        status = 'rejected',
        reviewed_by = p_reviewer_id,
        reviewed_at = now(),
        reviewer_notes = p_reviewer_notes,
        updated_at = now()
    WHERE id = p_proposal_id;

    RETURN jsonb_build_object(
        'success', true,
        'proposal_id', p_proposal_id,
        'status', 'rejected'
    );
END;
$$ LANGUAGE plpgsql VOLATILE;

