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
- [ ] Skrip migrasi untuk 17 tabel inti diterapkan lengkap dengan relasi, unique constraint, dan default value.
- [ ] Ekstensi PostgreSQL yang relevan (`uuid-ossp`, `pg_trgm`, `btree_gist`) diaktifkan.
- [ ] Fungsi pencegahan siklus leluhur (`fn_check_parent_child_cycle`) terpasang.
- [ ] Advisory lock diimplementasikan untuk penambahan relasi paralel.
- [ ] Fungsi traversal leluhur dan keturunan (`fn_get_ancestors`, `fn_get_descendants`, `get_family_subgraph`) teruji.
- [ ] Constraint integritas (orang tua bukan diri sendiri, rentang tahun valid) teruji.
- [ ] Pengujian database dan RPC sukses dijalankan.

---

### Fase 3 — Supabase Auth, Keanggotaan, Peran, dan RLS
- [ ] Trigger otomatis sinkronisasi `auth.users` ke `public.profiles`.
- [ ] Kebijakan RLS terpasang lengkap di 17 tabel dengan prinsip *deny-by-default*.
- [ ] Helper otorisasi `is_family_member` dan `has_family_role` (`SECURITY DEFINER` aman) terpasang.
- [ ] Isolasi multi-tenant terverifikasi (anggota keluarga A tidak dapat membaca/menulis data keluarga B).
- [ ] Hak akses berdasarkan 5 peran (`owner`, `family_admin`, `editor`, `contributor`, `reader`) teruji.
- [ ] Akses data privat (individu yang masih hidup, media privat) terlindungi dari peran `reader`.
- [ ] Pengujian RLS otomatis menggunakan identitas peran yang berbeda berhasil 100%.

---

### Fase 4 — CRUD Individu, Nama Alternatif, Relasi, Klaim, dan Sumber
- [ ] Operasi CRUD profil individu berfungsi dengan validasi Zod.
- [ ] Penambahan dan pencarian nama alternatif (`person_names`) berfungsi.
- [ ] Pembuatan relasi orang tua-anak dengan penanganan tipe relasi (`biological`, `adopted`, dsb).
- [ ] Pembuatan serikat pasangan (`unions`) dan pencatatan anak terikat pernikahan.
- [ ] Modul pencatatan klaim fakta (`claims`) dan penautan bukti sumber (`sources`, `claim_sources`).
- [ ] Representasi tanggal perkiraan/historis tersimpan akurat.
- [ ] Deteksi potensi individu duplikat bekerja berdasarkan kemiripan nama dan rentang tahun.
- [ ] Pengujian unit/integrasi untuk fitur domain CRUD lolos.

---

### Fase 5 — UI Direktori, Profil, dan Formulir
- [ ] Tampilan antarmuka berbahasa Indonesia yang konsisten, bersih, dan responsif (desktop & mobile).
- [ ] Halaman login, pendaftaran, dan pemulihan kata sandi berfungsi.
- [ ] Halaman Direktori Individu dengan filter jenis kelamin, status hidup/wafat, dan pencarian instan.
- [ ] Halaman Profil Individu yang memuat:
  - Kartu identitas utama & foto.
  - Daftar nama alternatif / gelar.
  - Linimasa peristiwa hidup & tempat.
  - Daftar orang tua, saudara kandung, pasangan, dan anak.
  - Tab Klaim & Bukti Sumber.
- [ ] Formulir tambah/edit individu dengan validasi masukan interaktif.
- [ ] Halaman Repositori Sumber Informasi.

---

### Fase 6 — Pohon Leluhur, Keturunan, dan Navigasi Interaktif
- [ ] Visualisasi graf menggunakan React Flow (`@xyflow/react`).
- [ ] Mode tampilan dapat beralih antara:
  - Mode Leluhur (*Pedigree / Ancestors View*).
  - Mode Keturunan (*Descendants View*).
  - Mode Gabungan (*Hourglass / Focus View*).
- [ ] Nodus menampilkan kartu individu (nama, foto/inisial, tahun hidup, relasi, badge status verifikasi).
- [ ] Hubungan pasangan ditampilkan dengan kartu pasangan/simpul serikat.
- [ ] Navigasi interaktif: zoom, pan, pemusatan kembali (*re-center*), dan pemilihan individu fokus.
- [ ] Pengambilan subgraph modular: cabang dapat diciutkan (*collapse*) dan diperluas (*expand*).
- [ ] Tampilan responsif dan dapat dioperasikan dengan nyaman di perangkat ponsel.

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

