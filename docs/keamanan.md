# Model Keamanan & Kebijakan Otorisasi (RLS) — Pusaka Keluarga

Dokumen ini mendefinisikan arsitektur keamanan, hierarki peran, model otorisasi *deny-by-default*, kebijakan Row Level Security (RLS) PostgreSQL, dan panduan keamanan untuk Supabase Storage dan PostgreSQL Stored Procedures.

---

## 1. Hierarki Peran & Matriks Akses

Sistem menggunakan 5 tingkat peran dalam ruang lingkup keluarga (`family_memberships.role`):

| Peran | Deskripsi | Hak Akses Utama |
| :--- | :--- | :--- |
| **Owner** | Pemilik sah ruang keluarga (keluarga besar). | Memiliki seluruh wewenang, dapat menghapus keluarga, transfer kepemilikan, mengelola tagihan, mengangkat `family_admin`. |
| **Family Administrator** | Administrator silsilah keluarga. | Mengelola anggota keluarga, menyetujui/menolak usulan perubahan (*change proposals*), menggabungkan profil (*merging*), mengelola pengaturan privasi. |
| **Editor** | Anggota terpercaya/peneliti silsilah. | Dapat langsung menambah/mengubah individu, relasi, klaim, dan sumber tanpa melalui antrean usulan. |
| **Contributor** | Anggota keluarga umum. | Dapat membaca seluruh data yang diizinkan; perubahan atau penambahan data harus melalui antrean `change_proposals` untuk ditinjau oleh Admin/Editor. Dapat mengunggah foto/media. |
| **Reader** | Anggota tamu atau pembaca terdaftar. | Hanya dapat melihat data publik keluarga. Tidak dapat melihat data privat individu yang masih hidup atau media privat. Tidak dapat mengedit. |

---

## 2. Prinsip Deny-by-Default & Isolasi Multi-Tenant

1. **Seluruh Tabel Memiliki RLS Aktif**:
   Setiap tabel yang dibuat langsung diaktifkan fitur RLS:
   ```sql
   ALTER TABLE nama_tabel ENABLE ROW LEVEL SECURITY;
   ```
2. **Tanpa Kebijakan = Akses Tertutup Total**:
   Secara *default*, jika tidak ada kebijakan yang cocok, PostgreSQL menolak (*deny*) semua operasi `SELECT`, `INSERT`, `UPDATE`, dan `DELETE`.
3. **Isolasi Berbasis Keluarga (`family_id`)**:
   Pengguna hanya diizinkan berinteraksi dengan baris data yang memiliki `family_id` di mana pengguna tersebut tercatat sebagai anggota aktif (`family_memberships.status = 'active'`). Pengguna tidak dapat membaca atau memanipulasi data keluarga lain.

---

## 3. Desain Helper Function RLS (SECURITY DEFINER Aman)

Untuk menghindari perulangan kueri yang kompleks dan potensi rekursi tak berujung (*infinite recursion*) pada evaluasi kebijakan RLS, dibuat fungsi pembantu (*helper functions*) dengan standar keamanan tinggi:

```sql
-- Helper 1: Cek apakah user adalah anggota aktif dari keluarga tertentu
CREATE OR REPLACE FUNCTION public.is_family_member(p_family_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_memberships
    WHERE family_id = p_family_id
      AND profile_id = auth.uid()
      AND status = 'active'
  );
$$;

-- Helper 2: Cek apakah user memiliki peran tertentu dalam keluarga
CREATE OR REPLACE FUNCTION public.has_family_role(p_family_id UUID, p_required_roles TEXT[])
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, auth
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.family_memberships
    WHERE family_id = p_family_id
      AND profile_id = auth.uid()
      AND status = 'active'
      AND role = ANY(p_required_roles)
  );
$$;
```

### Standar Penulisan `SECURITY DEFINER`:
1. **Wajib menetapkan `SET search_path = public, auth`**: Mencegah serangan pembajakan skema (*search path injection*).
2. **Batasi Hak Eksekusi**: `REVOKE EXECUTE ON FUNCTION ... FROM public; GRANT EXECUTE ON FUNCTION ... TO authenticated;`.
3. **Fungsi ditandai `STABLE`**: Memungkinkan optimasi per-kueri oleh PostgreSQL planner.
4. **Validasi Konteks `auth.uid()`**: Tidak pernah menerima `user_id` dari argumen yang tidak divalidasi terhadap `auth.uid()`.

---

## 4. Kebijakan RLS per Entitas Utama

### 4.1. Tabel `profiles`
- **SELECT**: Publik untuk pengguna terotentikasi yang berada dalam keluarga yang sama, atau profil dirinya sendiri.
- **UPDATE**: Pengguna hanya dapat memperbarui profil miliknya sendiri (`id = auth.uid()`).
- **INSERT**: Dikelola otomatis oleh Supabase Auth Trigger (`on_auth_user_created`).

### 4.2. Tabel `families`
- **SELECT**: Anggota keluarga aktif (`is_family_member(id)`) atau jika `is_private = false`.
- **INSERT**: Semua pengguna terotentikasi (membuat ruang keluarga baru).
- **UPDATE**: Hanya anggota dengan peran `owner` atau `family_admin`.
- **DELETE**: Hanya `owner`.

### 4.3. Tabel `family_memberships`
- **SELECT**: Anggota keluarga yang sama.
- **INSERT / UPDATE / DELETE**: Hanya `owner` dan `family_admin`.

### 4.4. Tabel `persons`, `unions`, `parent_child_relationships`, `places`
- **SELECT**: Anggota keluarga aktif. (Untuk individu dengan `is_private = true` dan `is_living = true`, pembatasan kolom diterapkan atau hanya terlihat oleh `editor`, `family_admin`, `owner`).
- **INSERT**: Anggota dengan peran `owner`, `family_admin`, atau `editor`. (Peran `contributor` harus melalui `change_proposals`).
- **UPDATE / DELETE**: Anggota dengan peran `owner`, `family_admin`, atau `editor`.

### 4.5. Tabel `claims` dan `sources`
- **SELECT**: Semua anggota keluarga aktif.
- **INSERT**: `owner`, `family_admin`, `editor`, atau `contributor`.
- **UPDATE**: `owner`, `family_admin`, `editor` (atau pembuat klaim selama status masih `belum_ditinjau`).
- **DELETE**: `owner` dan `family_admin`.

### 4.6. Tabel `change_proposals`
- **SELECT**: Anggota keluarga aktif.
- **INSERT**: `contributor`, `editor`, `family_admin`, `owner`.
- **UPDATE**:
  - Kolom `status` dan review hanya boleh diubah oleh `owner`, `family_admin`, `editor`.
  - Pembuat usulan hanya boleh membatalkan usulannya sendiri (`status = 'cancelled'`) jika belum direview.

### 4.7. Tabel `audit_logs`
- **SELECT**: Hanya `owner` dan `family_admin`.
- **INSERT**: Hanya melalui trigger sistem atau fungsi database ber-otoritas tinggi.
- **UPDATE / DELETE**: **Dilarang keras untuk semua peran (Immutable Audit Trail)**.

---

## 5. Keamanan Berkas & Supabase Storage

1. **Bucket Penyimpanan**:
   - `family-media` (Privat). Berkas tidak dapat diakses tanpa token terotentikasi dan verifikasi RLS Storage.
2. **Struktur Penyimpanan Berkas**:
   `family-media/{family_id}/{person_id|source_id}/{random_uuid}.{ext}`
3. **Kebijakan RLS Storage Object**:
   - Pengguna hanya dapat membaca (`SELECT`) objek di mana segmen pertama path `{family_id}` cocok dengan keluarga tempat ia menjadi anggota aktif.
   - Pengunggahan (`INSERT`) dibatasi ukuran maksimum 10MB per foto/dokumen dan tipe MIME yang diizinkan (gambar JPEG/PNG/WebP, PDF).
   - Penghapusan (`DELETE`) hanya dapat dilakukan oleh pengunggah asli, `family_admin`, atau `owner`.

---

## 6. Penanganan Kunci Akses (Secrets Management)

- **Browser Client**: HANYA menggunakan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Publishable Key).
- **Service Role Key**: TIDAK PERNAH dikirim ke peramban. Jika diperlukan untuk operasi internal migrasi atau cron job, hanya disimpan di environment variable server terisolasi (`SUPABASE_SERVICE_ROLE_KEY`).
- **Validasi Server-Side**: Semua Route Handlers memeriksa sesi aktif melalui `@supabase/ssr` sebelum memproses data sensitif.
