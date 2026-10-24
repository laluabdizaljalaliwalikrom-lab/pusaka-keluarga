-- ==============================================================================
-- PUSAKA KELUARGA — COMBINED ALL MIGRATIONS (FASE 1 S/D 9)
-- Untuk dijalankan langsung di Supabase Dashboard SQL Editor
-- Proyek: https://supabase.com/dashboard/project/exdeymrasimtkhnrxpwc/sql/new
-- ==============================================================================


-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20250101000000_initial_schema.sql
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

-- ==============================================================================
-- PUSAKA KELUARGA — MIGRATION 001: INITIAL SCHEMA (17 TABEL INTI)
-- ==============================================================================

-- 1. Ekstensi Database
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 2. ENUM Types
DO $$ BEGIN
    CREATE TYPE family_role_type AS ENUM ('owner', 'family_admin', 'editor', 'contributor', 'reader');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE membership_status_type AS ENUM ('invited', 'active', 'suspended');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE gender_type AS ENUM ('male', 'female', 'unknown', 'other');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE date_accuracy_type AS ENUM ('EXACT', 'APPROXIMATE', 'BEFORE', 'AFTER', 'BETWEEN', 'UNKNOWN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE name_category_type AS ENUM ('alias', 'birth_name', 'married_name', 'title', 'religious_name', 'posthumous_name');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE union_category_type AS ENUM ('marriage', 'civil_union', 'religious', 'customary', 'unmarried', 'unknown');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE union_status_type AS ENUM ('active', 'divorced', 'annulled', 'widowed', 'separated', 'unknown');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE relationship_category_type AS ENUM ('biological', 'adopted', 'step', 'foster', 'guardian', 'unknown');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE confidence_type AS ENUM ('verified', 'probable', 'uncertain', 'disputed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE claim_status_type AS ENUM ('belum_ditinjau', 'sedang_ditinjau', 'diterima', 'diperdebatkan', 'ditolak');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE evidence_quality_type AS ENUM ('direct', 'indirect', 'hearsay', 'questionable');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE proposal_status_type AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE audit_operation_type AS ENUM ('INSERT', 'UPDATE', 'DELETE', 'MERGE', 'APPROVE_PROPOSAL', 'REJECT_PROPOSAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ==============================================================================
-- 3. TABEL AUTENTIKASI & KEANGGOTAAN
-- ==============================================================================

-- 3.1 Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    avatar_url TEXT,
    phone TEXT,
    is_superadmin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.2 Families
CREATE TABLE IF NOT EXISTS public.families (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    cover_image_url TEXT,
    root_person_id UUID, -- Foreign key ditambahkan kemudian via ALTER TABLE
    is_private BOOLEAN NOT NULL DEFAULT TRUE,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3.3 Family Memberships
CREATE TABLE IF NOT EXISTS public.family_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role family_role_type NOT NULL DEFAULT 'contributor',
    status membership_status_type NOT NULL DEFAULT 'active',
    invited_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_family_membership UNIQUE (family_id, profile_id)
);

-- ==============================================================================
-- 4. TABEL MASTER TEMPAT & INDIVIDU
-- ==============================================================================

-- 4.1 Places
CREATE TABLE IF NOT EXISTS public.places (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4.2 Persons
CREATE TABLE IF NOT EXISTS public.persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    primary_name VARCHAR(200) NOT NULL,
    nickname VARCHAR(100),
    gender gender_type NOT NULL DEFAULT 'unknown',
    is_living BOOLEAN NOT NULL DEFAULT TRUE,
    birth_date_exact DATE,
    birth_date_year SMALLINT,
    birth_date_type date_accuracy_type NOT NULL DEFAULT 'UNKNOWN',
    birth_date_text VARCHAR(100),
    birth_place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    death_date_exact DATE,
    death_date_year SMALLINT,
    death_date_type date_accuracy_type NOT NULL DEFAULT 'UNKNOWN',
    death_date_text VARCHAR(100),
    death_place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    burial_place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    bio TEXT,
    avatar_media_id UUID,
    is_private BOOLEAN NOT NULL DEFAULT FALSE,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tautkan root_person_id pada tabel families
ALTER TABLE public.families 
ADD CONSTRAINT fk_families_root_person 
FOREIGN KEY (root_person_id) REFERENCES public.persons(id) ON DELETE SET NULL;

-- 4.3 Person Names (Variasi & Gelar)
CREATE TABLE IF NOT EXISTS public.person_names (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type name_category_type NOT NULL DEFAULT 'alias',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 5. RELASI: UNIONS & PARENT-CHILD
-- ==============================================================================

-- 5.1 Unions
CREATE TABLE IF NOT EXISTS public.unions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    type union_category_type NOT NULL DEFAULT 'marriage',
    status union_status_type NOT NULL DEFAULT 'active',
    start_date_exact DATE,
    start_date_year SMALLINT,
    start_date_type date_accuracy_type DEFAULT 'UNKNOWN',
    start_date_text VARCHAR(100),
    end_date_exact DATE,
    end_date_year SMALLINT,
    end_date_type date_accuracy_type DEFAULT 'UNKNOWN',
    end_date_text VARCHAR(100),
    place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.2 Union Participants
CREATE TABLE IF NOT EXISTS public.union_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    union_id UUID NOT NULL REFERENCES public.unions(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL DEFAULT 'partner',
    order_index SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_union_participant UNIQUE (union_id, person_id)
);

-- 5.3 Parent-Child Relationships
CREATE TABLE IF NOT EXISTS public.parent_child_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    child_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    union_id UUID REFERENCES public.unions(id) ON DELETE SET NULL,
    relationship_type relationship_category_type NOT NULL DEFAULT 'biological',
    confidence confidence_type NOT NULL DEFAULT 'verified',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_parent_not_child CHECK (parent_id <> child_id),
    CONSTRAINT uq_parent_child UNIQUE (parent_id, child_id)
);

-- ==============================================================================
-- 6. SUMBER, KLAIM, DAN MEDIA
-- ==============================================================================

-- 6.1 Sources
CREATE TABLE IF NOT EXISTS public.sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    title VARCHAR(250) NOT NULL,
    author VARCHAR(200),
    publication_date VARCHAR(100),
    repository TEXT,
    source_type VARCHAR(50) NOT NULL DEFAULT 'document',
    citation_text TEXT,
    url TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6.2 Claims
CREATE TABLE IF NOT EXISTS public.claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    subject_person_id UUID REFERENCES public.persons(id) ON DELETE CASCADE,
    claim_type VARCHAR(50) NOT NULL,
    predicate TEXT NOT NULL,
    raw_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    status claim_status_type NOT NULL DEFAULT 'belum_ditinjau',
    notes TEXT,
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6.3 Claim Sources
CREATE TABLE IF NOT EXISTS public.claim_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id UUID NOT NULL REFERENCES public.claims(id) ON DELETE CASCADE,
    source_id UUID NOT NULL REFERENCES public.sources(id) ON DELETE CASCADE,
    page_or_reference VARCHAR(100),
    evidence_quality evidence_quality_type NOT NULL DEFAULT 'direct',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_claim_source UNIQUE (claim_id, source_id)
);

-- 6.4 Media
CREATE TABLE IF NOT EXISTS public.media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    person_id UUID REFERENCES public.persons(id) ON DELETE SET NULL,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    storage_path TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    caption TEXT,
    is_private BOOLEAN NOT NULL DEFAULT TRUE,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tautkan avatar_media_id pada tabel persons
ALTER TABLE public.persons
ADD CONSTRAINT fk_persons_avatar_media
FOREIGN KEY (avatar_media_id) REFERENCES public.media(id) ON DELETE SET NULL;

-- ==============================================================================
-- 7. EVENTS & EVENT PERSONS
-- ==============================================================================

-- 7.1 Events
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    date_exact DATE,
    date_year SMALLINT,
    date_type date_accuracy_type DEFAULT 'UNKNOWN',
    date_text VARCHAR(100),
    place_id UUID REFERENCES public.places(id) ON DELETE SET NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7.2 Event Persons
CREATE TABLE IF NOT EXISTS public.event_persons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    person_id UUID NOT NULL REFERENCES public.persons(id) ON DELETE CASCADE,
    role_in_event VARCHAR(50) NOT NULL DEFAULT 'subject',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_event_person UNIQUE (event_id, person_id)
);

-- ==============================================================================
-- 8. CHANGE PROPOSALS & AUDIT LOGS
-- ==============================================================================

-- 8.1 Change Proposals
CREATE TABLE IF NOT EXISTS public.change_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    target_table VARCHAR(50) NOT NULL,
    target_id UUID,
    operation VARCHAR(20) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE', 'MERGE')),
    proposed_payload JSONB NOT NULL,
    justification TEXT NOT NULL,
    source_id UUID REFERENCES public.sources(id) ON DELETE SET NULL,
    status proposal_status_type NOT NULL DEFAULT 'pending',
    proposed_by UUID NOT NULL REFERENCES public.profiles(id),
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewer_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8.2 Audit Logs
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES public.families(id) ON DELETE CASCADE,
    table_name VARCHAR(50) NOT NULL,
    record_id UUID NOT NULL,
    operation audit_operation_type NOT NULL,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    old_values JSONB,
    new_values JSONB,
    change_summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- 9. INDEKS KINERJA & PENCARIAN
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_parent_child_parent ON public.parent_child_relationships(parent_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_child ON public.parent_child_relationships(child_id);
CREATE INDEX IF NOT EXISTS idx_parent_child_family ON public.parent_child_relationships(family_id);
CREATE INDEX IF NOT EXISTS idx_persons_family ON public.persons(family_id);
CREATE INDEX IF NOT EXISTS idx_persons_primary_name_trgm ON public.persons USING gin (primary_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_person_names_person ON public.person_names(person_id);
CREATE INDEX IF NOT EXISTS idx_person_names_name_trgm ON public.person_names USING gin (name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_union_part_union ON public.union_participants(union_id);
CREATE INDEX IF NOT EXISTS idx_union_part_person ON public.union_participants(person_id);
CREATE INDEX IF NOT EXISTS idx_claims_person ON public.claims(subject_person_id);
CREATE INDEX IF NOT EXISTS idx_audit_family_created ON public.audit_logs(family_id, created_at DESC);



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20250102000000_domain_functions.sql
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20250103000000_auth_and_rls.sql
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

-- ==============================================================================
-- PUSAKA KELUARGA — MIGRATION 003: AUTH, KEANGGOTAAN, DAN ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- 1. Trigger Sinkronisasi Otomatis auth.users -> public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, avatar_url, phone)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email, 'Pengguna Baru'),
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'phone'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url),
        updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, auth;

-- Buat trigger pada skema auth
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 2. HELPER FUNCTIONS SECURITY DEFINER UNTUK RLS (AMAN SEARCH_PATH & ANTI-REKURSI)
-- ==============================================================================

-- Helper 1: Memeriksa apakah user adalah anggota aktif keluarga
CREATE OR REPLACE FUNCTION public.is_family_member(p_family_id UUID)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.family_memberships
        WHERE family_id = p_family_id
          AND profile_id = auth.uid()
          AND status = 'active'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, auth;

-- Helper 2: Memeriksa apakah user memiliki salah satu peran yang disyaratkan dalam keluarga
CREATE OR REPLACE FUNCTION public.has_family_role(
    p_family_id UUID, 
    p_required_roles family_role_type[]
)
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 
        FROM public.family_memberships
        WHERE family_id = p_family_id
          AND profile_id = auth.uid()
          AND status = 'active'
          AND role = ANY(p_required_roles)
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, auth;

-- Helper 3: Mendapatkan daftar keluarga di mana pengguna aktif bergabung
CREATE OR REPLACE FUNCTION public.get_user_active_family_ids()
RETURNS TABLE (family_id UUID) AS $$
    SELECT family_id 
    FROM public.family_memberships
    WHERE profile_id = auth.uid()
      AND status = 'active';
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public, auth;

-- Batasi hak eksekusi helper
REVOKE EXECUTE ON FUNCTION public.is_family_member(UUID) FROM public;
REVOKE EXECUTE ON FUNCTION public.has_family_role(UUID, family_role_type[]) FROM public;
REVOKE EXECUTE ON FUNCTION public.get_user_active_family_ids() FROM public;

GRANT EXECUTE ON FUNCTION public.is_family_member(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_family_role(UUID, family_role_type[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_active_family_ids() TO authenticated;

-- ==============================================================================
-- 3. AKTIFKAN RLS PADA SELURUH 17 TABEL (PRINSIP DENY-BY-DEFAULT)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.families ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.person_names ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.union_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_persons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. KEBIJAKAN RLS PER TABEL
-- ==============================================================================

-- 4.1 PROFILES
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
CREATE POLICY "profiles_select_policy" ON public.profiles
    FOR SELECT TO authenticated
    USING (
        id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM public.family_memberships fm1
            JOIN public.family_memberships fm2 ON fm1.family_id = fm2.family_id
            WHERE fm1.profile_id = auth.uid() AND fm2.profile_id = profiles.id
        )
    );

DROP POLICY IF EXISTS "profiles_update_policy" ON public.profiles;
CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 4.2 FAMILIES
DROP POLICY IF EXISTS "families_select_policy" ON public.families;
CREATE POLICY "families_select_policy" ON public.families
    FOR SELECT TO authenticated
    USING (
        is_private = false 
        OR public.is_family_member(id)
    );

DROP POLICY IF EXISTS "families_insert_policy" ON public.families;
CREATE POLICY "families_insert_policy" ON public.families
    FOR INSERT TO authenticated
    WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "families_update_policy" ON public.families;
CREATE POLICY "families_update_policy" ON public.families
    FOR UPDATE TO authenticated
    USING (public.has_family_role(id, ARRAY['owner', 'family_admin']::family_role_type[]))
    WITH CHECK (public.has_family_role(id, ARRAY['owner', 'family_admin']::family_role_type[]));

DROP POLICY IF EXISTS "families_delete_policy" ON public.families;
CREATE POLICY "families_delete_policy" ON public.families
    FOR DELETE TO authenticated
    USING (public.has_family_role(id, ARRAY['owner']::family_role_type[]));

-- 4.3 FAMILY_MEMBERSHIPS
DROP POLICY IF EXISTS "family_memberships_select_policy" ON public.family_memberships;
CREATE POLICY "family_memberships_select_policy" ON public.family_memberships
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id) OR profile_id = auth.uid());

DROP POLICY IF EXISTS "family_memberships_insert_policy" ON public.family_memberships;
CREATE POLICY "family_memberships_insert_policy" ON public.family_memberships
    FOR INSERT TO authenticated
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

DROP POLICY IF EXISTS "family_memberships_update_policy" ON public.family_memberships;
CREATE POLICY "family_memberships_update_policy" ON public.family_memberships
    FOR UPDATE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

DROP POLICY IF EXISTS "family_memberships_delete_policy" ON public.family_memberships;
CREATE POLICY "family_memberships_delete_policy" ON public.family_memberships
    FOR DELETE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[])
        OR profile_id = auth.uid() -- Pengguna boleh meninggalkan keluarga sendiri
    );

-- 4.4 PLACES
DROP POLICY IF EXISTS "places_select_policy" ON public.places;
CREATE POLICY "places_select_policy" ON public.places
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "places_all_mutation_policy" ON public.places;
CREATE POLICY "places_all_mutation_policy" ON public.places
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

-- 4.5 PERSONS (Termasuk Proteksi Individu Privat & Masih Hidup)
DROP POLICY IF EXISTS "persons_select_policy" ON public.persons;
CREATE POLICY "persons_select_policy" ON public.persons
    FOR SELECT TO authenticated
    USING (
        public.is_family_member(family_id)
        AND (
            is_private = false
            OR is_living = false
            OR public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
            OR created_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "persons_insert_policy" ON public.persons;
CREATE POLICY "persons_insert_policy" ON public.persons
    FOR INSERT TO authenticated
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

DROP POLICY IF EXISTS "persons_update_policy" ON public.persons;
CREATE POLICY "persons_update_policy" ON public.persons
    FOR UPDATE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

DROP POLICY IF EXISTS "persons_delete_policy" ON public.persons;
CREATE POLICY "persons_delete_policy" ON public.persons
    FOR DELETE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

-- 4.6 PERSON_NAMES
DROP POLICY IF EXISTS "person_names_select_policy" ON public.person_names;
CREATE POLICY "person_names_select_policy" ON public.person_names
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.persons p
            WHERE p.id = person_names.person_id
              AND public.is_family_member(p.family_id)
        )
    );

DROP POLICY IF EXISTS "person_names_all_mutation_policy" ON public.person_names;
CREATE POLICY "person_names_all_mutation_policy" ON public.person_names
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.persons p
            WHERE p.id = person_names.person_id
              AND public.has_family_role(p.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.persons p
            WHERE p.id = person_names.person_id
              AND public.has_family_role(p.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        )
    );

-- 4.7 UNIONS & UNION_PARTICIPANTS
DROP POLICY IF EXISTS "unions_select_policy" ON public.unions;
CREATE POLICY "unions_select_policy" ON public.unions
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "unions_all_mutation_policy" ON public.unions;
CREATE POLICY "unions_all_mutation_policy" ON public.unions
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

DROP POLICY IF EXISTS "union_participants_select_policy" ON public.union_participants;
CREATE POLICY "union_participants_select_policy" ON public.union_participants
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.unions u
            WHERE u.id = union_participants.union_id
              AND public.is_family_member(u.family_id)
        )
    );

DROP POLICY IF EXISTS "union_participants_all_mutation_policy" ON public.union_participants;
CREATE POLICY "union_participants_all_mutation_policy" ON public.union_participants
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.unions u
            WHERE u.id = union_participants.union_id
              AND public.has_family_role(u.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.unions u
            WHERE u.id = union_participants.union_id
              AND public.has_family_role(u.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        )
    );

-- 4.8 PARENT_CHILD_RELATIONSHIPS
DROP POLICY IF EXISTS "parent_child_select_policy" ON public.parent_child_relationships;
CREATE POLICY "parent_child_select_policy" ON public.parent_child_relationships
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "parent_child_all_mutation_policy" ON public.parent_child_relationships;
CREATE POLICY "parent_child_all_mutation_policy" ON public.parent_child_relationships
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

-- 4.9 SOURCES
DROP POLICY IF EXISTS "sources_select_policy" ON public.sources;
CREATE POLICY "sources_select_policy" ON public.sources
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "sources_insert_policy" ON public.sources;
CREATE POLICY "sources_insert_policy" ON public.sources
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND (
            public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
        )
    );

DROP POLICY IF EXISTS "sources_update_policy" ON public.sources;
CREATE POLICY "sources_update_policy" ON public.sources
    FOR UPDATE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        OR created_by = auth.uid()
    )
    WITH CHECK (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        OR created_by = auth.uid()
    );

DROP POLICY IF EXISTS "sources_delete_policy" ON public.sources;
CREATE POLICY "sources_delete_policy" ON public.sources
    FOR DELETE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

-- 4.10 CLAIMS & CLAIM_SOURCES
DROP POLICY IF EXISTS "claims_select_policy" ON public.claims;
CREATE POLICY "claims_select_policy" ON public.claims
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "claims_insert_policy" ON public.claims;
CREATE POLICY "claims_insert_policy" ON public.claims
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
    );

DROP POLICY IF EXISTS "claims_update_policy" ON public.claims;
CREATE POLICY "claims_update_policy" ON public.claims
    FOR UPDATE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        OR (created_by = auth.uid() AND status = 'belum_ditinjau')
    )
    WITH CHECK (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        OR (created_by = auth.uid() AND status = 'belum_ditinjau')
    );

DROP POLICY IF EXISTS "claims_delete_policy" ON public.claims;
CREATE POLICY "claims_delete_policy" ON public.claims
    FOR DELETE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

DROP POLICY IF EXISTS "claim_sources_select_policy" ON public.claim_sources;
CREATE POLICY "claim_sources_select_policy" ON public.claim_sources
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.claims c
            WHERE c.id = claim_sources.claim_id
              AND public.is_family_member(c.family_id)
        )
    );

DROP POLICY IF EXISTS "claim_sources_mutation_policy" ON public.claim_sources;
CREATE POLICY "claim_sources_mutation_policy" ON public.claim_sources
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.claims c
            WHERE c.id = claim_sources.claim_id
              AND public.has_family_role(c.family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.claims c
            WHERE c.id = claim_sources.claim_id
              AND public.has_family_role(c.family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
        )
    );

-- 4.11 MEDIA (Proteksi Berkas Privat)
DROP POLICY IF EXISTS "media_select_policy" ON public.media;
CREATE POLICY "media_select_policy" ON public.media
    FOR SELECT TO authenticated
    USING (
        public.is_family_member(family_id)
        AND (
            is_private = false
            OR public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
            OR uploaded_by = auth.uid()
        )
    );

DROP POLICY IF EXISTS "media_insert_policy" ON public.media;
CREATE POLICY "media_insert_policy" ON public.media
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
    );

DROP POLICY IF EXISTS "media_delete_policy" ON public.media;
CREATE POLICY "media_delete_policy" ON public.media
    FOR DELETE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[])
        OR uploaded_by = auth.uid()
    );

-- 4.12 EVENTS & EVENT_PERSONS
DROP POLICY IF EXISTS "events_select_policy" ON public.events;
CREATE POLICY "events_select_policy" ON public.events
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "events_all_mutation_policy" ON public.events;
CREATE POLICY "events_all_mutation_policy" ON public.events
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

DROP POLICY IF EXISTS "event_persons_select_policy" ON public.event_persons;
CREATE POLICY "event_persons_select_policy" ON public.event_persons
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_persons.event_id
              AND public.is_family_member(e.family_id)
        )
    );

DROP POLICY IF EXISTS "event_persons_all_mutation_policy" ON public.event_persons;
CREATE POLICY "event_persons_all_mutation_policy" ON public.event_persons
    FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_persons.event_id
              AND public.has_family_role(e.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_persons.event_id
              AND public.has_family_role(e.family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        )
    );

-- 4.13 CHANGE_PROPOSALS
DROP POLICY IF EXISTS "change_proposals_select_policy" ON public.change_proposals;
CREATE POLICY "change_proposals_select_policy" ON public.change_proposals
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

DROP POLICY IF EXISTS "change_proposals_insert_policy" ON public.change_proposals;
CREATE POLICY "change_proposals_insert_policy" ON public.change_proposals
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND proposed_by = auth.uid()
    );

DROP POLICY IF EXISTS "change_proposals_update_policy" ON public.change_proposals;
CREATE POLICY "change_proposals_update_policy" ON public.change_proposals
    FOR UPDATE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        OR (proposed_by = auth.uid() AND status = 'pending')
    )
    WITH CHECK (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[])
        OR (proposed_by = auth.uid() AND status = 'cancelled')
    );

-- 4.14 AUDIT_LOGS (Immutable - Tidak Dapat Diubah atau Dihapus Siapa Pun)
DROP POLICY IF EXISTS "audit_logs_select_policy" ON public.audit_logs;
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

DROP POLICY IF EXISTS "audit_logs_insert_policy" ON public.audit_logs;
CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (public.is_family_member(family_id));

-- Catatan: Tidak ada kebijakan UPDATE atau DELETE untuk audit_logs (Strictly Immutable!)



-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
-- FILE: 20250104000000_proposals_and_media.sql
-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
DROP POLICY IF EXISTS "family_media_select_policy" ON storage.objects;
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

DROP POLICY IF EXISTS "family_media_insert_policy" ON storage.objects;
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


