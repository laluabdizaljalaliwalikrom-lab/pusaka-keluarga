-- ==============================================================================
-- PUSAKA KELUARGA — SEED DATA SINTETIS (DATA UJI PENGEMBANGAN)
-- PERINGATAN: Semua nama, tanggal, dan relasi adalah data sintetis fiktif untuk uji sistem.
-- ==============================================================================

DO $$
DECLARE
    v_user_admin_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_user_editor_id UUID := 'a0000000-0000-0000-0000-000000000002';
    v_user_contrib_id UUID := 'a0000000-0000-0000-0000-000000000003';
    v_family_id UUID := 'f0000000-0000-0000-0000-000000000001';

    -- Person IDs
    v_gen1_kakek UUID := 'b0000000-0000-0000-0000-000000000001'; -- R. M. Kartosoedirjo (1885-1952)
    v_gen1_nenek1 UUID := 'b0000000-0000-0000-0000-000000000002'; -- R. A. Siti Aminah (1890-1940)
    v_gen1_nenek2 UUID := 'b0000000-0000-0000-0000-000000000003'; -- Nyi Mas Rukmini (1905-1975)

    -- Gen 2
    v_gen2_anak1 UUID := 'b0000000-0000-0000-0000-000000000004'; -- Bambang Soedirjo (1915-1988)
    v_gen2_istri1 UUID := 'b0000000-0000-0000-0000-000000000005'; -- Dewi Anggraini (1920-1995)
    v_gen2_anak2 UUID := 'b0000000-0000-0000-0000-000000000006'; -- Sri Wahyuni (1922-2005)
    v_gen2_suami2 UUID := 'b0000000-0000-0000-0000-000000000007'; -- Raden Hartono (1918-1982)
    v_gen2_anak3 UUID := 'b0000000-0000-0000-0000-000000000008'; -- Joko Pramono (dari Istri 2, 1942-2015)

    -- Gen 3
    v_gen3_cucu1 UUID := 'b0000000-0000-0000-0000-000000000009'; -- Hendra Soedirjo (1948-2020)
    v_gen3_istri1 UUID := 'b0000000-0000-0000-0000-000000000010'; -- Ratna Juwita (1952-masih hidup)
    v_gen3_cucu2 UUID := 'b0000000-0000-0000-0000-000000000011'; -- Budi Santoso (1950-masih hidup)

    -- Gen 4
    v_gen4_cicit1 UUID := 'b0000000-0000-0000-0000-000000000012'; -- Dimas Arya Soedirjo (1980-masih hidup)
    v_gen4_cicit2 UUID := 'b0000000-0000-0000-0000-000000000013'; -- Anisa Larasati (1985-masih hidup)

    -- Union IDs
    v_u1 UUID := 'c0000000-0000-0000-0000-000000000001';
    v_u2 UUID := 'c0000000-0000-0000-0000-000000000002';
    v_u3 UUID := 'c0000000-0000-0000-0000-000000000003';
    v_u4 UUID := 'c0000000-0000-0000-0000-000000000004';
    v_u5 UUID := 'c0000000-0000-0000-0000-000000000005';

    -- Place IDs
    v_p_solo UUID := 'd0000000-0000-0000-0000-000000000001';
    v_p_yogya UUID := 'd0000000-0000-0000-0000-000000000002';
    v_p_surabaya UUID := 'd0000000-0000-0000-0000-000000000003';
    v_p_jakarta UUID := 'd0000000-0000-0000-0000-000000000004';

    -- Source & Claim IDs
    v_src_buku UUID := 'e0000000-0000-0000-0000-000000000001';
    v_src_akta UUID := 'e0000000-0000-0000-0000-000000000002';
    v_clm_1 UUID := 'e1000000-0000-0000-0000-000000000001';
BEGIN
    -- 1. Buat Pengguna di auth.users (Mencegah FK violation ke profiles)
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at
    ) VALUES 
        (
            v_user_admin_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'admin@pusakakeluarga.id',
            crypt('PusakaKeluarga123!', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Kuncoro Adiwijaya (Admin)"}'::jsonb,
            now(),
            now()
        ),
        (
            v_user_editor_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'editor@pusakakeluarga.id',
            crypt('PusakaKeluarga123!', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Siti Nurhaliza (Editor)"}'::jsonb,
            now(),
            now()
        ),
        (
            v_user_contrib_id,
            '00000000-0000-0000-0000-000000000000',
            'authenticated',
            'authenticated',
            'contributor@pusakakeluarga.id',
            crypt('PusakaKeluarga123!', gen_salt('bf')),
            now(),
            '{"provider":"email","providers":["email"]}'::jsonb,
            '{"full_name":"Bambang Supriyanto (Contributor)"}'::jsonb,
            now(),
            now()
        )
    ON CONFLICT (id) DO NOTHING;

    -- 2. Tautkan Identitas Auth
    INSERT INTO auth.identities (
        id,
        user_id,
        identity_data,
        provider,
        provider_id,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES 
        (
            v_user_admin_id,
            v_user_admin_id,
            format('{"sub":"%s","email":"%s"}', v_user_admin_id, 'admin@pusakakeluarga.id')::jsonb,
            'email',
            'admin@pusakakeluarga.id',
            now(),
            now(),
            now()
        ),
        (
            v_user_editor_id,
            v_user_editor_id,
            format('{"sub":"%s","email":"%s"}', v_user_editor_id, 'editor@pusakakeluarga.id')::jsonb,
            'email',
            'editor@pusakakeluarga.id',
            now(),
            now(),
            now()
        ),
        (
            v_user_contrib_id,
            v_user_contrib_id,
            format('{"sub":"%s","email":"%s"}', v_user_contrib_id, 'contributor@pusakakeluarga.id')::jsonb,
            'email',
            'contributor@pusakakeluarga.id',
            now(),
            now(),
            now()
        )
    ON CONFLICT (provider, provider_id) DO NOTHING;

    -- 3. Masukkan Profil Pengguna
    INSERT INTO public.profiles (id, full_name, avatar_url, phone, is_superadmin)
    VALUES 
        (v_user_admin_id, 'Kuncoro Adiwijaya (Admin)', null, '081234567890', true),
        (v_user_editor_id, 'Siti Nurhaliza (Editor)', null, '081234567891', false),
        (v_user_contrib_id, 'Bambang Supriyanto (Contributor)', null, '081234567892', false)
    ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

    -- 4. Buat Keluarga
    INSERT INTO public.families (id, name, description, is_private, created_by)
    VALUES (
        v_family_id,
        'Bani Kartosoedirjo (Trah Sintetis)',
        'Silsilah keluarga besar keturunan R. M. Kartosoedirjo, berasal dari Surakarta dan tersebar ke berbagai kota.',
        false,
        v_user_admin_id
    ) ON CONFLICT (id) DO NOTHING;

    -- 5. Keanggotaan Keluarga
    INSERT INTO public.family_memberships (family_id, profile_id, role, status)
    VALUES 
        (v_family_id, v_user_admin_id, 'owner', 'active'),
        (v_family_id, v_user_editor_id, 'editor', 'active'),
        (v_family_id, v_user_contrib_id, 'contributor', 'active')
    ON CONFLICT (family_id, profile_id) DO NOTHING;

    -- 6. Master Tempat
    INSERT INTO public.places (id, family_id, name, latitude, longitude)
    VALUES 
        (v_p_solo, v_family_id, 'Surakarta (Solo), Jawa Tengah', -7.5755, 110.8243),
        (v_p_yogya, v_family_id, 'Yogyakarta, D.I. Yogyakarta', -7.7956, 110.3695),
        (v_p_surabaya, v_family_id, 'Surabaya, Jawa Timur', -7.2575, 112.7521),
        (v_p_jakarta, v_family_id, 'Jakarta Pusat, DKI Jakarta', -6.1754, 106.8272)
    ON CONFLICT (id) DO NOTHING;

    -- 7. Generasi 1 (Kakek Buyut & Para Istri)
    INSERT INTO public.persons (id, family_id, primary_name, nickname, gender, is_living, birth_date_year, birth_date_type, birth_date_text, death_date_year, death_date_type, birth_place_id, death_place_id, bio, is_private, created_by)
    VALUES 
        (v_gen1_kakek, v_family_id, 'Raden Mas Kartosoedirjo', 'Mbah Karto', 'male', false, 1885, 'APPROXIMATE', 'Sekitar tahun 1885 era Kasunanan Surakarta', 1952, 'EXACT', v_p_solo, v_p_solo, 'Tokoh pendidik dan sesepuh keluarga di Surakarta.', false, v_user_admin_id),
        (v_gen1_nenek1, v_family_id, 'Raden Ajeng Siti Aminah', 'Mbah Aminah', 'female', false, 1890, 'APPROXIMATE', 'Sekitar 1890', 1940, 'EXACT', v_p_solo, v_p_solo, 'Istri pertama R. M. Kartosoedirjo.', false, v_user_admin_id),
        (v_gen1_nenek2, v_family_id, 'Nyi Mas Rukmini', 'Mbah Rukmini', 'female', false, 1905, 'APPROXIMATE', 'Sekitar 1905', 1975, 'EXACT', v_p_yogya, v_p_solo, 'Istri kedua R. M. Kartosoedirjo setelah Mbah Aminah wafat.', false, v_user_admin_id)
    ON CONFLICT (id) DO NOTHING;

    -- Update root_person_id keluarga
    UPDATE public.families SET root_person_id = v_gen1_kakek WHERE id = v_family_id;

    -- Gelar / Nama Alternatif Generasi 1
    INSERT INTO public.person_names (person_id, name, type, notes)
    VALUES 
        (v_gen1_kakek, 'K. R. T. Kartodiningrat', 'title', 'Gelar kehormatan keraton'),
        (v_gen1_kakek, 'Kartopawiro', 'alias', 'Nama masa muda sebelum menikah')
    ON CONFLICT (id) DO NOTHING;

    -- Serikat Pernikahan Gen 1
    INSERT INTO public.unions (id, family_id, type, status, start_date_year, start_date_type, place_id, notes)
    VALUES 
        (v_u1, v_family_id, 'marriage', 'widowed', 1912, 'APPROXIMATE', v_p_solo, 'Pernikahan pertama di Kraton Solo'),
        (v_u2, v_family_id, 'marriage', 'widowed', 1941, 'EXACT', v_p_yogya, 'Pernikahan kedua')
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.union_participants (union_id, person_id, role, order_index)
    VALUES 
        (v_u1, v_gen1_kakek, 'husband', 1),
        (v_u1, v_gen1_nenek1, 'wife', 2),
        (v_u2, v_gen1_kakek, 'husband', 1),
        (v_u2, v_gen1_nenek2, 'wife', 2)
    ON CONFLICT (union_id, person_id) DO NOTHING;

    -- 8. Generasi 2 (Anak-anak)
    INSERT INTO public.persons (id, family_id, primary_name, nickname, gender, is_living, birth_date_year, birth_date_type, death_date_year, death_date_type, birth_place_id, is_private, created_by)
    VALUES 
        (v_gen2_anak1, v_family_id, 'Bambang Soedirjo', 'Bambang', 'male', false, 1915, 'EXACT', 1988, 'EXACT', v_p_solo, false, v_user_admin_id),
        (v_gen2_istri1, v_family_id, 'Dewi Anggraini', 'Dewi', 'female', false, 1920, 'APPROXIMATE', 1995, 'EXACT', v_p_surabaya, false, v_user_admin_id),
        (v_gen2_anak2, v_family_id, 'Sri Wahyuni', 'Yuni', 'female', false, 1922, 'EXACT', 2005, 'EXACT', v_p_solo, false, v_user_admin_id),
        (v_gen2_suami2, v_family_id, 'Raden Hartono', 'Hartono', 'male', false, 1918, 'APPROXIMATE', 1982, 'EXACT', v_p_yogya, false, v_user_admin_id),
        (v_gen2_anak3, v_family_id, 'Joko Pramono', 'Joko', 'male', false, 1942, 'EXACT', 2015, 'EXACT', v_p_solo, false, v_user_admin_id)
    ON CONFLICT (id) DO NOTHING;

    -- Hubungan Orang Tua Gen 1 -> Gen 2
    INSERT INTO public.parent_child_relationships (family_id, parent_id, child_id, union_id, relationship_type, confidence)
    VALUES 
        (v_family_id, v_gen1_kakek, v_gen2_anak1, v_u1, 'biological', 'verified'),
        (v_family_id, v_gen1_nenek1, v_gen2_anak1, v_u1, 'biological', 'verified'),
        (v_family_id, v_gen1_kakek, v_gen2_anak2, v_u1, 'biological', 'verified'),
        (v_family_id, v_gen1_nenek1, v_gen2_anak2, v_u1, 'biological', 'verified'),
        (v_family_id, v_gen1_kakek, v_gen2_anak3, v_u2, 'biological', 'verified'),
        (v_family_id, v_gen1_nenek2, v_gen2_anak3, v_u2, 'biological', 'verified')
    ON CONFLICT (parent_id, child_id) DO NOTHING;

    -- Serikat Pernikahan Gen 2
    INSERT INTO public.unions (id, family_id, type, status, start_date_year, start_date_type, place_id)
    VALUES 
        (v_u3, v_family_id, 'marriage', 'widowed', 1945, 'EXACT', v_p_surabaya),
        (v_u4, v_family_id, 'marriage', 'widowed', 1946, 'EXACT', v_p_solo)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.union_participants (union_id, person_id, role, order_index)
    VALUES 
        (v_u3, v_gen2_anak1, 'husband', 1),
        (v_u3, v_gen2_istri1, 'wife', 2),
        (v_u4, v_gen2_suami2, 'husband', 1),
        (v_u4, v_gen2_anak2, 'wife', 2)
    ON CONFLICT (union_id, person_id) DO NOTHING;

    -- 9. Generasi 3 (Cucu)
    INSERT INTO public.persons (id, family_id, primary_name, nickname, gender, is_living, birth_date_year, birth_date_type, death_date_year, birth_place_id, is_private, created_by)
    VALUES 
        (v_gen3_cucu1, v_family_id, 'Hendra Soedirjo', 'Hendra', 'male', false, 1948, 'EXACT', 2020, v_p_surabaya, false, v_user_admin_id),
        (v_gen3_istri1, v_family_id, 'Ratna Juwita', 'Ratna', 'female', true, 1952, 'EXACT', null, v_p_jakarta, true, v_user_admin_id),
        (v_gen3_cucu2, v_family_id, 'Budi Santoso', 'Budi', 'male', true, 1950, 'EXACT', null, v_p_solo, false, v_user_admin_id)
    ON CONFLICT (id) DO NOTHING;

    -- Hubungan Orang Tua Gen 2 -> Gen 3
    INSERT INTO public.parent_child_relationships (family_id, parent_id, child_id, union_id, relationship_type, confidence)
    VALUES 
        (v_family_id, v_gen2_anak1, v_gen3_cucu1, v_u3, 'biological', 'verified'),
        (v_family_id, v_gen2_istri1, v_gen3_cucu1, v_u3, 'biological', 'verified'),
        (v_family_id, v_gen2_anak2, v_gen3_cucu2, v_u4, 'biological', 'verified'),
        (v_family_id, v_gen2_suami2, v_gen3_cucu2, v_u4, 'biological', 'verified')
    ON CONFLICT (parent_id, child_id) DO NOTHING;

    -- Serikat Pernikahan Gen 3
    INSERT INTO public.unions (id, family_id, type, status, start_date_year, start_date_type, place_id)
    VALUES 
        (v_u5, v_family_id, 'marriage', 'widowed', 1978, 'EXACT', v_p_jakarta)
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.union_participants (union_id, person_id, role, order_index)
    VALUES 
        (v_u5, v_gen3_cucu1, 'husband', 1),
        (v_u5, v_gen3_istri1, 'wife', 2)
    ON CONFLICT (union_id, person_id) DO NOTHING;

    -- 10. Generasi 4 (Cicit - Masih Hidup)
    INSERT INTO public.persons (id, family_id, primary_name, nickname, gender, is_living, birth_date_year, birth_date_type, birth_place_id, is_private, created_by)
    VALUES 
        (v_gen4_cicit1, v_family_id, 'Dimas Arya Soedirjo', 'Dimas', 'male', true, 1980, 'EXACT', v_p_jakarta, false, v_user_admin_id),
        (v_gen4_cicit2, v_family_id, 'Anisa Larasati', 'Anisa', 'female', true, 1985, 'EXACT', v_p_jakarta, true, v_user_admin_id)
    ON CONFLICT (id) DO NOTHING;

    -- Hubungan Orang Tua Gen 3 -> Gen 4
    INSERT INTO public.parent_child_relationships (family_id, parent_id, child_id, union_id, relationship_type, confidence)
    VALUES 
        (v_family_id, v_gen3_cucu1, v_gen4_cicit1, v_u5, 'biological', 'verified'),
        (v_family_id, v_gen3_istri1, v_gen4_cicit1, v_u5, 'biological', 'verified'),
        (v_family_id, v_gen3_cucu1, v_gen4_cicit2, v_u5, 'biological', 'verified'),
        (v_family_id, v_gen3_istri1, v_gen4_cicit2, v_u5, 'biological', 'verified')
    ON CONFLICT (parent_id, child_id) DO NOTHING;

    -- 11. Sumber Bukti
    INSERT INTO public.sources (id, family_id, title, author, publication_date, repository, source_type, citation_text, created_by)
    VALUES 
        (v_src_buku, v_family_id, 'Buku Silsilah Kulawarga Kasunanan Surakarta', 'Sasana Pustaka Karaton Surakarta', '1935', 'Perpustakaan Kraton Surakarta No. Reg 442/S', 'family_book', 'Halaman 112-114 mencatat silsilah R. M. Kartosoedirjo dan keturunan pertamanya.', v_user_admin_id),
        (v_src_akta, v_family_id, 'Akta Catatan Sipil Hindia Belanda (Burgerlijke Stand)', 'Gemeente Soerabaja', '1915', 'Arsip Nasional RI', 'birth_certificate', 'Kutipan akta kelahiran Bambang Soedirjo No. 89/1915.', v_user_editor_id)
    ON CONFLICT (id) DO NOTHING;

    -- 12. Klaim Fakta
    INSERT INTO public.claims (id, family_id, subject_person_id, claim_type, predicate, raw_data, status, notes, created_by)
    VALUES 
        (v_clm_1, v_family_id, v_gen1_kakek, 'birth_date', 'Kelahiran diperkirakan sekitar 1885', '{"year": 1885, "accuracy": "APPROXIMATE"}'::jsonb, 'diterima', 'Dikonfirmasi silang antara buku trah dan penuturan saksi sejarah.', v_user_admin_id)
    ON CONFLICT (id) DO NOTHING;

    -- 13. Hubungkan Klaim dengan Sumber
    INSERT INTO public.claim_sources (claim_id, source_id, page_or_reference, evidence_quality)
    VALUES 
        (v_clm_1, v_src_buku, 'Hal. 112 Kolom B', 'direct')
    ON CONFLICT (claim_id, source_id) DO NOTHING;

END $$;
