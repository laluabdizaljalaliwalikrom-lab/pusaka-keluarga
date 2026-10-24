# Kriteria Keberterimaan (Acceptance Criteria) per Fase — Pusaka Keluarga

Dokumen ini menjadi acuan verifikasi kelayakan setiap fase pengembangan sebelum beralih ke fase berikutnya.

---

## Matriks Fase & Acceptance Criteria

### Fase 0 — Audit Repository, Arsitektur, ERD, dan Kriteria Keberterimaan
- [x] Lingkungan lokal diaudit (Node.js, npm, git, docker, Supabase CLI).
- [x] Dokumen arsitektur lengkap (`docs/arsitektur.md`).
- [x] Dokumen ERD dan skema 17 tabel inti (`docs/erd.md`).
- [x] Dokumen aturan domain, pencegahan siklus, dan klaim/sumber (`docs/aturan-domain.md`).
- [x] Dokumen model keamanan, RBAC, dan kebijakan RLS (`docs/keamanan.md`).
- [x] Dokumen acceptance criteria per fase disetujui (`docs/acceptance-criteria.md`).

---

### Fase 1 — Setup Next.js, Supabase CLI, Konfigurasi Lokal, dan Migrasi Awal
- [x] Proyek Next.js 15+ App Router terinisialisasi dengan TypeScript strict mode.
- [x] Tailwind CSS dan pustaka UI terkonfigurasi.
- [x] Supabase CLI terkonfigurasi (`supabase/config.toml`).
- [x] File konfigurasi lingkungan (`.env.local.example`, `.env.test`) tersedia.
- [x] Utilitas Supabase client (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`) dibuat dengan `@supabase/ssr`.
- [x] Baseline migration dapat dijalankan tanpa error di Supabase (`20250101000000_initial_schema.sql`).
- [x] Build Next.js (`npm run build`) dan linting (`npm run lint`) sukses.

---

### Fase 2 — Model Database, Constraint, Fungsi Domain, dan Pengujian Integritas
- [x] Skrip migrasi untuk 17 tabel inti diterapkan lengkap dengan relasi, unique constraint, dan default value.
- [x] Ekstensi PostgreSQL yang relevan (`uuid-ossp`, `pg_trgm`) diaktifkan.
- [x] Fungsi pencegahan siklus leluhur (`fn_check_parent_child_cycle`) terpasang.
- [x] Advisory lock diimplementasikan untuk penambahan relasi paralel (`fn_add_parent_child_relationship`).
- [x] Fungsi traversal leluhur dan keturunan (`fn_get_ancestors`, `fn_get_descendants`, `get_family_subgraph`) teruji.
- [x] Constraint integritas (orang tua bukan diri sendiri, rentang tahun valid) teruji.
- [x] Pengujian database dan RPC sukses dijalankan (17/17 tests passing).
- [x] Seed data sintetis (`supabase/seed.sql`) siap digunakan untuk pengembangan lokal tanpa data nyata.

---

### Fase 3 — Supabase Auth, Keanggotaan, Peran, dan RLS
- [x] Trigger otomatis sinkronisasi `auth.users` ke `public.profiles`.
- [x] Kebijakan RLS terpasang lengkap di 17 tabel dengan prinsip *deny-by-default*.
- [x] Helper otorisasi `is_family_member`, `has_family_role`, dan `get_user_active_family_ids` (`SECURITY DEFINER` aman) terpasang.
- [x] Isolasi multi-tenant terverifikasi (anggota keluarga A tidak dapat membaca/menulis data keluarga B).
- [x] Hak akses berdasarkan 5 peran (`owner`, `family_admin`, `editor`, `contributor`, `reader`) teruji.
- [x] Akses data privat (individu yang masih hidup, media privat) terlindungi dari peran `reader`.
- [x] Pengujian RLS otomatis menggunakan identitas peran yang berbeda berhasil 100% (36/36 tests passing).

---

### Fase 4 — CRUD Individu, Nama Alternatif, Relasi, Klaim, dan Sumber
- [x] Operasi CRUD profil individu berfungsi dengan validasi Zod.
- [x] Penambahan dan pencarian nama alternatif (`person_names`) berfungsi.
- [x] Pembuatan relasi orang tua-anak dengan penanganan tipe relasi (`biological`, `adopted`, dsb).
- [x] Pembuatan serikat pasangan (`unions`) dan pencatatan anak terikat pernikahan.
- [x] Modul pencatatan klaim fakta (`claims`) dan penautan bukti sumber (`sources`, `claim_sources`).
- [x] Representasi tanggal perkiraan/historis tersimpan akurat.
- [x] Deteksi potensi individu duplikat bekerja berdasarkan kemiripan nama (ejaan lama Nusantara Van Ophuijsen/Suwandi ke EYD) dan rentang tahun.
- [x] Pengujian unit/integrasi untuk fitur domain CRUD lolos (45/45 tests passing).

---

### Fase 5 — UI Direktori, Profil, dan Formulir
- [x] Tampilan antarmuka berbahasa Indonesia yang konsisten, bersih, dan responsif (desktop & mobile).
- [x] Halaman login, pendaftaran, dan pemulihan kata sandi berfungsi.
- [x] Halaman Direktori Individu dengan filter jenis kelamin, status hidup/wafat, dan pencarian instan.
- [x] Halaman Profil Individu yang memuat kartu identitas, nama alternatif/gelar, linimasa peristiwa, orang tua, pasangan, anak, serta tab klaim & bukti sumber.
- [x] Formulir tambah/edit individu dengan validasi masukan interaktif dan deteksi potensi duplikat langsung.
- [x] Halaman Repositori Sumber Informasi & Arsip.
- [x] Dashboard ringkasan silsilah keluarga besar (Bani Kartosoedirjo) dengan metrik generasi dan status verifikasi.

---

### Fase 6 — Pohon Leluhur, Keturunan, dan Navigasi Interaktif
- [x] Visualisasi graf menggunakan React Flow (`@xyflow/react`).
- [x] Mode tampilan dapat beralih antara: Mode Leluhur (*Ancestors*), Mode Keturunan (*Descendants*), dan Mode Gabungan (*Hourglass*).
- [x] Nodus menampilkan kartu individu (nama, foto/inisial, tahun hidup, relasi, badge kelengkapan & verifikasi).
- [x] Hubungan pasangan ditampilkan dengan kartu pasangan/simpul serikat (`unionNode`).
- [x] Navigasi interaktif: zoom, pan, pemusatan kembali (*re-center*), MiniMap, dan pemilihan individu pusat.
- [x] Pengambilan subgraph modular dan laci ringkasan detail individu (*drawer panel*).
- [x] Tampilan responsif dan dapat dioperasikan dengan nyaman di perangkat ponsel maupun desktop.

---

### Fase 7 — Kontribusi, Persetujuan, Audit, dan Media Privat
- [ ] Alur kontribusi bagi peran `contributor`: pengajuan usulan perubahan data ke `change_proposals`.
- [ ] Antarmuka kurasi/peninjauan untuk `family_admin` dan `editor` (menyetujui / menolak usulan dengan catatan).
- [ ] Eksekusi persetujuan usulan secara atomik di database.
- [ ] Pengunggahan berkas foto dan dokumen ke Supabase Storage (bucket privat `family-media`).
- [ ] Akses berkas privat terverifikasi melalui URL bertanda tangan (*signed URLs*) atau proxy terotentikasi.
- [ ] Audit trail (`audit_logs`) mencatat seluruh aksi sensitif dan persetujuan perubahan.
- [ ] Halaman Manajemen Anggota (undang anggota, ubah peran).

---

### Fase 8 — Impor/Ekspor, Backup, Pemulihan, dan Pengujian Regresi
- [ ] Fitur ekspor data silsilah ke format JSON terstruktur (dan GEDCOM standar).
- [ ] Fitur impor data silsilah dengan validasi schema dan preview sebelum commit.
- [ ] Mekanisme pemulihan data (*restore*) dan penggabungan profil (*merge profile*) yang transaksional dan dapat dibatalkan.
- [ ] Pengujian E2E Playwright mencakup alur lengkap: registrasi, buat keluarga, input orang tua-anak, ajukan kontribusi, persetujuan admin, navigasi pohon.
- [ ] Seluruh uji regresi (Vitest, RLS, E2E) lolos hijau.

---

### Fase 9 — Deployment Vercel dan Supabase Cloud
- [ ] Dokumentasi panduan deployment lengkap (`docs/deployment.md`).
- [ ] Environment variables produksi terkonfigurasi di Vercel dan Supabase Cloud.
- [ ] Migrasi database diterapkan secara bersih pada Supabase Cloud.
- [ ] Storage bucket dan kebijakan RLS produksi aktif.
- [ ] Konfigurasi Auth redirect URLs dan email templates terverifikasi.
- [ ] Domain kustom / URL Vercel berfungsi dengan performa optimal.

