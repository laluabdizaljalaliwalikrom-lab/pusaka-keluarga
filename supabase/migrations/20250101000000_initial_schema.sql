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

