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

CREATE POLICY "profiles_update_policy" ON public.profiles
    FOR UPDATE TO authenticated
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- 4.2 FAMILIES
CREATE POLICY "families_select_policy" ON public.families
    FOR SELECT TO authenticated
    USING (
        is_private = false 
        OR public.is_family_member(id)
    );

CREATE POLICY "families_insert_policy" ON public.families
    FOR INSERT TO authenticated
    WITH CHECK (created_by = auth.uid());

CREATE POLICY "families_update_policy" ON public.families
    FOR UPDATE TO authenticated
    USING (public.has_family_role(id, ARRAY['owner', 'family_admin']::family_role_type[]))
    WITH CHECK (public.has_family_role(id, ARRAY['owner', 'family_admin']::family_role_type[]));

CREATE POLICY "families_delete_policy" ON public.families
    FOR DELETE TO authenticated
    USING (public.has_family_role(id, ARRAY['owner']::family_role_type[]));

-- 4.3 FAMILY_MEMBERSHIPS
CREATE POLICY "family_memberships_select_policy" ON public.family_memberships
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id) OR profile_id = auth.uid());

CREATE POLICY "family_memberships_insert_policy" ON public.family_memberships
    FOR INSERT TO authenticated
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

CREATE POLICY "family_memberships_update_policy" ON public.family_memberships
    FOR UPDATE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

CREATE POLICY "family_memberships_delete_policy" ON public.family_memberships
    FOR DELETE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[])
        OR profile_id = auth.uid() -- Pengguna boleh meninggalkan keluarga sendiri
    );

-- 4.4 PLACES
CREATE POLICY "places_select_policy" ON public.places
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "places_all_mutation_policy" ON public.places
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

-- 4.5 PERSONS (Termasuk Proteksi Individu Privat & Masih Hidup)
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

CREATE POLICY "persons_insert_policy" ON public.persons
    FOR INSERT TO authenticated
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

CREATE POLICY "persons_update_policy" ON public.persons
    FOR UPDATE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

CREATE POLICY "persons_delete_policy" ON public.persons
    FOR DELETE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

-- 4.6 PERSON_NAMES
CREATE POLICY "person_names_select_policy" ON public.person_names
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.persons p
            WHERE p.id = person_names.person_id
              AND public.is_family_member(p.family_id)
        )
    );

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
CREATE POLICY "unions_select_policy" ON public.unions
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "unions_all_mutation_policy" ON public.unions
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

CREATE POLICY "union_participants_select_policy" ON public.union_participants
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.unions u
            WHERE u.id = union_participants.union_id
              AND public.is_family_member(u.family_id)
        )
    );

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
CREATE POLICY "parent_child_select_policy" ON public.parent_child_relationships
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "parent_child_all_mutation_policy" ON public.parent_child_relationships
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

-- 4.9 SOURCES
CREATE POLICY "sources_select_policy" ON public.sources
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "sources_insert_policy" ON public.sources
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND (
            public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
        )
    );

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

CREATE POLICY "sources_delete_policy" ON public.sources
    FOR DELETE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

-- 4.10 CLAIMS & CLAIM_SOURCES
CREATE POLICY "claims_select_policy" ON public.claims
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "claims_insert_policy" ON public.claims
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
    );

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

CREATE POLICY "claims_delete_policy" ON public.claims
    FOR DELETE TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

CREATE POLICY "claim_sources_select_policy" ON public.claim_sources
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.claims c
            WHERE c.id = claim_sources.claim_id
              AND public.is_family_member(c.family_id)
        )
    );

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

CREATE POLICY "media_insert_policy" ON public.media
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor', 'contributor']::family_role_type[])
    );

CREATE POLICY "media_delete_policy" ON public.media
    FOR DELETE TO authenticated
    USING (
        public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[])
        OR uploaded_by = auth.uid()
    );

-- 4.12 EVENTS & EVENT_PERSONS
CREATE POLICY "events_select_policy" ON public.events
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "events_all_mutation_policy" ON public.events
    FOR ALL TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]))
    WITH CHECK (public.has_family_role(family_id, ARRAY['owner', 'family_admin', 'editor']::family_role_type[]));

CREATE POLICY "event_persons_select_policy" ON public.event_persons
    FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.events e
            WHERE e.id = event_persons.event_id
              AND public.is_family_member(e.family_id)
        )
    );

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
CREATE POLICY "change_proposals_select_policy" ON public.change_proposals
    FOR SELECT TO authenticated
    USING (public.is_family_member(family_id));

CREATE POLICY "change_proposals_insert_policy" ON public.change_proposals
    FOR INSERT TO authenticated
    WITH CHECK (
        public.is_family_member(family_id)
        AND proposed_by = auth.uid()
    );

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
CREATE POLICY "audit_logs_select_policy" ON public.audit_logs
    FOR SELECT TO authenticated
    USING (public.has_family_role(family_id, ARRAY['owner', 'family_admin']::family_role_type[]));

CREATE POLICY "audit_logs_insert_policy" ON public.audit_logs
    FOR INSERT TO authenticated
    WITH CHECK (public.is_family_member(family_id));

-- Catatan: Tidak ada kebijakan UPDATE atau DELETE untuk audit_logs (Strictly Immutable!)

