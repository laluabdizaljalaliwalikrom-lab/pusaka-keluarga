-- ==============================================================================
-- PUSAKA KELUARGA — MIGRATION 002: DOMAIN FUNCTIONS, CYCLE PREVENTION & GRAPH TRAVERSAL
-- ==============================================================================

-- 1. Fungsi Pengecekan Siklus Leluhur (Cycle Detection)
-- Mengembalikan TRUE jika relasi p_parent_id -> p_child_id akan menyebabkan siklus
CREATE OR REPLACE FUNCTION public.fn_check_parent_child_cycle(
    p_parent_id UUID,
    p_child_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_cycle BOOLEAN := FALSE;
BEGIN
    -- Kasus 1: Seseorang tidak boleh menjadi orang tua dirinya sendiri
    IF p_parent_id = p_child_id THEN
        RETURN TRUE;
    END IF;

    -- Kasus 2: Telusuri apakah p_child_id sudah merupakan salah satu leluhur dari p_parent_id
    WITH RECURSIVE ancestor_tree AS (
        -- Base: Orang tua langsung dari calon orang tua
        SELECT parent_id, child_id, 1 as depth
        FROM public.parent_child_relationships
        WHERE child_id = p_parent_id
        
        UNION ALL
        
        -- Recursive: Orang tua dari leluhur
        SELECT r.parent_id, r.child_id, a.depth + 1
        FROM public.parent_child_relationships r
        JOIN ancestor_tree a ON r.child_id = a.parent_id
        WHERE a.depth < 100 -- Batas rekursi maksimum
    )
    SELECT EXISTS (
        SELECT 1 FROM ancestor_tree WHERE parent_id = p_child_id
    ) INTO v_has_cycle;

    RETURN v_has_cycle;
END;
$$ LANGUAGE plpgsql STABLE;

-- 2. Prosedur Transaksional Tambah Relasi Orang Tua-Anak dengan Advisory Lock
CREATE OR REPLACE FUNCTION public.fn_add_parent_child_relationship(
    p_family_id UUID,
    p_parent_id UUID,
    p_child_id UUID,
    p_union_id UUID DEFAULT NULL,
    p_relationship_type relationship_category_type DEFAULT 'biological',
    p_confidence confidence_type DEFAULT 'verified',
    p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_new_id UUID;
    v_cycle_detected BOOLEAN;
BEGIN
    -- Validasi ID
    IF p_parent_id = p_child_id THEN
        RAISE EXCEPTION 'Anomali relasi: Seseorang tidak boleh menjadi orang tua dirinya sendiri';
    END IF;

    -- Concurrency Protection: Lock transaksional berbasis hash keluarga
    PERFORM pg_advisory_xact_lock(hashtext('family_rel_' || p_family_id::text));

    -- Verifikasi siklus leluhur
    v_cycle_detected := public.fn_check_parent_child_cycle(p_parent_id, p_child_id);
    IF v_cycle_detected THEN
        RAISE EXCEPTION 'Anomali relasi: Hubungan ini akan menimbulkan siklus dalam graf silsilah leluhur';
    END IF;

    -- Simpan relasi
    INSERT INTO public.parent_child_relationships (
        family_id,
        parent_id,
        child_id,
        union_id,
        relationship_type,
        confidence,
        notes
    ) VALUES (
        p_family_id,
        p_parent_id,
        p_child_id,
        p_union_id,
        p_relationship_type,
        p_confidence,
        p_notes
    )
    RETURNING id INTO v_new_id;

    RETURN v_new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 3. Traversal Leluhur (Ancestors Traversal)
CREATE OR REPLACE FUNCTION public.fn_get_ancestors(
    p_person_id UUID,
    p_max_depth INT DEFAULT 5
) RETURNS TABLE (
    person_id UUID,
    primary_name VARCHAR,
    gender gender_type,
    birth_year SMALLINT,
    death_year SMALLINT,
    is_living BOOLEAN,
    avatar_url TEXT,
    depth INT,
    relationship_type relationship_category_type,
    child_id UUID
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE ancestors AS (
        -- Base: Orang tua langsung
        SELECT 
            p.id AS person_id,
            p.primary_name,
            p.gender,
            p.birth_date_year AS birth_year,
            p.death_date_year AS death_year,
            p.is_living,
            m.storage_path AS avatar_url,
            1 AS depth,
            r.relationship_type,
            r.child_id
        FROM public.parent_child_relationships r
        JOIN public.persons p ON p.id = r.parent_id
        LEFT JOIN public.media m ON m.id = p.avatar_media_id
        WHERE r.child_id = p_person_id

        UNION ALL

        -- Recursive: Orang tua dari generasi sebelumnya
        SELECT 
            p.id AS person_id,
            p.primary_name,
            p.gender,
            p.birth_date_year AS birth_year,
            p.death_date_year AS death_year,
            p.is_living,
            m.storage_path AS avatar_url,
            a.depth + 1 AS depth,
            r.relationship_type,
            r.child_id
        FROM public.parent_child_relationships r
        JOIN public.persons p ON p.id = r.parent_id
        LEFT JOIN public.media m ON m.id = p.avatar_media_id
        JOIN ancestors a ON r.child_id = a.person_id
        WHERE a.depth < p_max_depth
    )
    SELECT * FROM ancestors ORDER BY depth ASC, birth_year ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4. Traversal Keturunan (Descendants Traversal)
CREATE OR REPLACE FUNCTION public.fn_get_descendants(
    p_person_id UUID,
    p_max_depth INT DEFAULT 5
) RETURNS TABLE (
    person_id UUID,
    primary_name VARCHAR,
    gender gender_type,
    birth_year SMALLINT,
    death_year SMALLINT,
    is_living BOOLEAN,
    avatar_url TEXT,
    depth INT,
    relationship_type relationship_category_type,
    parent_id UUID
) AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE descendants AS (
        -- Base: Anak langsung
        SELECT 
            p.id AS person_id,
            p.primary_name,
            p.gender,
            p.birth_date_year AS birth_year,
            p.death_date_year AS death_year,
            p.is_living,
            m.storage_path AS avatar_url,
            1 AS depth,
            r.relationship_type,
            r.parent_id
        FROM public.parent_child_relationships r
        JOIN public.persons p ON p.id = r.child_id
        LEFT JOIN public.media m ON m.id = p.avatar_media_id
        WHERE r.parent_id = p_person_id

        UNION ALL

        -- Recursive: Anak dari keturunan
        SELECT 
            p.id AS person_id,
            p.primary_name,
            p.gender,
            p.birth_date_year AS birth_year,
            p.death_date_year AS death_year,
            p.is_living,
            m.storage_path AS avatar_url,
            d.depth + 1 AS depth,
            r.relationship_type,
            r.parent_id
        FROM public.parent_child_relationships r
        JOIN public.persons p ON p.id = r.child_id
        LEFT JOIN public.media m ON m.id = p.avatar_media_id
        JOIN descendants d ON r.parent_id = d.person_id
        WHERE d.depth < p_max_depth
    )
    SELECT * FROM descendants ORDER BY depth ASC, birth_year ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- 5. Subgraph Family Tree untuk Visualisasi React Flow
CREATE OR REPLACE FUNCTION public.get_family_subgraph(
    p_person_id UUID,
    p_ancestor_depth INT DEFAULT 4,
    p_descendant_depth INT DEFAULT 2
) RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
    v_person_ids UUID[];
BEGIN
    -- 1. Kumpulkan semua ID person yang relevan (Fokus, Leluhur, Keturunan)
    WITH all_related_ids AS (
        SELECT p_person_id AS id
        UNION
        SELECT person_id AS id FROM public.fn_get_ancestors(p_person_id, p_ancestor_depth)
        UNION
        SELECT person_id AS id FROM public.fn_get_descendants(p_person_id, p_descendant_depth)
    )
    SELECT array_agg(DISTINCT id) INTO v_person_ids FROM all_related_ids;

    -- Tambahkan juga pasangan dari orang-orang tersebut agar tampilan keluarga lengkap
    WITH spouse_ids AS (
        SELECT up2.person_id AS id
        FROM public.union_participants up1
        JOIN public.union_participants up2 ON up1.union_id = up2.union_id AND up1.person_id <> up2.person_id
        WHERE up1.person_id = ANY(v_person_ids)
    )
    SELECT array_agg(DISTINCT id) INTO v_person_ids
    FROM (
        SELECT unnest(v_person_ids) AS id
        UNION
        SELECT id FROM spouse_ids
    ) s;

    -- 2. Susun JSON lengkap
    SELECT jsonb_build_object(
        'focus_person_id', p_person_id,
        'persons', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', p.id,
                    'family_id', p.family_id,
                    'primary_name', p.primary_name,
                    'nickname', p.nickname,
                    'gender', p.gender,
                    'is_living', p.is_living,
                    'birth_date_year', p.birth_date_year,
                    'birth_date_type', p.birth_date_type,
                    'birth_date_text', p.birth_date_text,
                    'death_date_year', p.death_date_year,
                    'death_date_type', p.death_date_type,
                    'death_date_text', p.death_date_text,
                    'avatar_url', m.storage_path,
                    'is_private', p.is_private
                )
            )
            FROM public.persons p
            LEFT JOIN public.media m ON m.id = p.avatar_media_id
            WHERE p.id = ANY(v_person_ids)
        ), '[]'::jsonb),
        'relationships', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', r.id,
                    'parent_id', r.parent_id,
                    'child_id', r.child_id,
                    'union_id', r.union_id,
                    'relationship_type', r.relationship_type,
                    'confidence', r.confidence
                )
            )
            FROM public.parent_child_relationships r
            WHERE r.parent_id = ANY(v_person_ids) AND r.child_id = ANY(v_person_ids)
        ), '[]'::jsonb),
        'unions', COALESCE((
            SELECT jsonb_agg(
                jsonb_build_object(
                    'id', u.id,
                    'type', u.type,
                    'status', u.status,
                    'start_date_year', u.start_date_year,
                    'participants', (
                        SELECT jsonb_agg(
                            jsonb_build_object(
                                'person_id', up.person_id,
                                'role', up.role,
                                'order_index', up.order_index
                            )
                        )
                        FROM public.union_participants up
                        WHERE up.union_id = u.id
                    )
                )
            )
            FROM public.unions u
            WHERE EXISTS (
                SELECT 1 FROM public.union_participants up
                WHERE up.union_id = u.id AND up.person_id = ANY(v_person_ids)
            )
        ), '[]'::jsonb)
    ) INTO v_result;

    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

-- 6. Fungsi Penggabungan Profil Transaksional (Profile Merging)
CREATE OR REPLACE FUNCTION public.fn_merge_persons(
    p_family_id UUID,
    p_source_person_id UUID,
    p_target_person_id UUID,
    p_actor_id UUID
) RETURNS JSONB AS $$
DECLARE
    v_source_record RECORD;
    v_target_record RECORD;
    v_audit_old_values JSONB;
BEGIN
    IF p_source_person_id = p_target_person_id THEN
        RAISE EXCEPTION 'ID profil sumber dan target tidak boleh sama';
    END IF;

    -- Ambil data record sumber dan target
    SELECT * INTO v_source_record FROM public.persons WHERE id = p_source_person_id AND family_id = p_family_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil sumber tidak ditemukan';
    END IF;

    SELECT * INTO v_target_record FROM public.persons WHERE id = p_target_person_id AND family_id = p_family_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil target tidak ditemukan';
    END IF;

    -- Simpan snapshot awal profil sumber untuk keperluan audit trail dan pemulihan
    v_audit_old_values := row_to_json(v_source_record);

    -- Pindahkan variasi nama
    UPDATE public.person_names SET person_id = p_target_person_id WHERE person_id = p_source_person_id;

    -- Pindahkan relasi anak (di mana orang yang dimerge adalah orang tuanya)
    UPDATE public.parent_child_relationships 
    SET parent_id = p_target_person_id 
    WHERE parent_id = p_source_person_id
      AND child_id <> p_target_person_id
      AND NOT EXISTS (
          SELECT 1 FROM public.parent_child_relationships existing
          WHERE existing.parent_id = p_target_person_id AND existing.child_id = parent_child_relationships.child_id
      );

    -- Pindahkan relasi orang tua (di mana orang yang dimerge adalah anaknya)
    UPDATE public.parent_child_relationships 
    SET child_id = p_target_person_id 
    WHERE child_id = p_source_person_id
      AND parent_id <> p_target_person_id
      AND NOT EXISTS (
          SELECT 1 FROM public.parent_child_relationships existing
          WHERE existing.child_id = p_target_person_id AND existing.parent_id = parent_child_relationships.parent_id
      );

    -- Pindahkan serikat pasangan
    UPDATE public.union_participants 
    SET person_id = p_target_person_id 
    WHERE person_id = p_source_person_id
      AND NOT EXISTS (
          SELECT 1 FROM public.union_participants existing
          WHERE existing.union_id = union_participants.union_id AND existing.person_id = p_target_person_id
      );

    -- Pindahkan klaim, media, dan relasi peristiwa
    UPDATE public.claims SET subject_person_id = p_target_person_id WHERE subject_person_id = p_source_person_id;
    UPDATE public.media SET person_id = p_target_person_id WHERE person_id = p_source_person_id;
    UPDATE public.event_persons SET person_id = p_target_person_id WHERE person_id = p_source_person_id;

    -- Hapus relasi sisa yang redundan pada profil sumber
    DELETE FROM public.parent_child_relationships WHERE parent_id = p_source_person_id OR child_id = p_source_person_id;
    DELETE FROM public.union_participants WHERE person_id = p_source_person_id;

    -- Catat di audit log
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
        p_family_id,
        'persons',
        p_target_person_id,
        'MERGE',
        p_actor_id,
        v_audit_old_values,
        row_to_json(v_target_record),
        format('Profil %s (%s) digabungkan ke %s (%s)', v_source_record.primary_name, p_source_person_id, v_target_record.primary_name, p_target_person_id)
    );

    -- Hapus profil sumber
    DELETE FROM public.persons WHERE id = p_source_person_id;

    RETURN jsonb_build_object(
        'success', true,
        'merged_source_id', p_source_person_id,
        'target_id', p_target_person_id
    );
END;
$$ LANGUAGE plpgsql VOLATILE;

