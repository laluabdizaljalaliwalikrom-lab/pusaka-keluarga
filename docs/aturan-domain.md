# Aturan Domain Genealogi & Integritas Data — Pusaka Keluarga

Dokumen ini menjelaskan secara rinci aturan domain silsilah keluarga, algoritma pencegahan anomali relasi, penanganan tanggal historis, pemisahan klaim dan sumber, serta mekanisme penggabungan profil (*profile merging*).

---

## 1. Identitas Individu dan Nama Alternatif

1. **Satu Individu = Satu Identitas Stabil**:
   Setiap individu dalam sistem memiliki satu UUID `persons.id` yang permanen.
2. **Nama Alternatif Tidak Membuat Entitas Baru**:
   - Jika seseorang memiliki nama kecil, nama kebangsawanan (gelar), nama baptis/keagamaan, atau perubahan nama saat menikah, data tersebut disimpan di tabel `person_names`.
   - Pencarian direktori mencocokkan `persons.primary_name` serta seluruh entri di `person_names`.
3. **Privasi Individu Masih Hidup**:
   - Individu dengan `is_living = true` dapat ditandai `is_private = true`. Pengguna dengan peran `reader` atau non-anggota hanya melihat nama inisial atau label "Tersembunyi" untuk melindungi privasi anggota keluarga yang masih hidup.

---

## 2. Integritas Relasi Orang Tua — Anak

### 2.1. Aturan Dasar
- **Tidak Boleh Menjadi Orang Tua Diri Sendiri**:
  Constraint database: `CHECK (parent_id <> child_id)`.
- **Orang Tua Boleh Tidak Lengkap (Unknown/Null)**:
  Seseorang dapat dicatat hanya dengan satu orang tua (misal hanya ibu atau hanya ayah), atau tanpa orang tua sama sekali.
- **Tipe Relasi Beragam**:
  Relasi biologis (`biological`), adopsi (`adopted`), orang tua tiri (`step`), perwalian (`guardian`), dan tidak diketahui (`unknown`) harus dipisahkan secara eksplisit melalui atribut `relationship_type` di `parent_child_relationships`.

### 2.2. Algoritma Anti-Siklus (Acyclic Graph Validation)
Graf silsilah adalah *Directed Acyclic Graph* (DAG). Seseorang tidak boleh menjadi leluhur dari leluhurnya sendiri.

#### Implementasi Fungsi Database:
Pengecekan siklus dijalankan di dalam fungsi PostgreSQL `fn_check_parent_child_cycle(p_parent_id UUID, p_child_id UUID)` sebelum relasi baru disimpan.

```sql
CREATE OR REPLACE FUNCTION fn_check_parent_child_cycle(
    p_parent_id UUID,
    p_child_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_has_cycle BOOLEAN := FALSE;
BEGIN
    -- Seseorang tidak boleh menjadi orang tua dirinya sendiri
    IF p_parent_id = p_child_id THEN
        RETURN TRUE;
    END IF;

    -- Telusuri apakah p_child_id adalah salah satu leluhur dari p_parent_id
    WITH RECURSIVE ancestor_tree AS (
        -- Base case: Orang tua langsung dari p_parent_id
        SELECT parent_id, child_id, 1 as depth
        FROM parent_child_relationships
        WHERE child_id = p_parent_id
        
        UNION ALL
        
        -- Recursive step: Orang tua dari leluhur
        SELECT r.parent_id, r.child_id, a.depth + 1
        FROM parent_child_relationships r
        JOIN ancestor_tree a ON r.child_id = a.parent_id
        WHERE a.depth < 100 -- Batas aman rekursi
    )
    SELECT EXISTS (
        SELECT 1 FROM ancestor_tree WHERE parent_id = p_child_id
    ) INTO v_has_cycle;

    RETURN v_has_cycle;
END;
$$ LANGUAGE plpgsql STABLE;
```

#### Keamanan terhadap Permintaan Bersamaan (*Concurrency Safety*):
Untuk mencegah kondisi *race condition* ketika dua relasi saling bertentangan dimasukkan secara simultan pada saat bersamaan:
1. Digunakan *PostgreSQL Advisory Lock* berbasis hash pasangan `(family_id)`:
   `PERFORM pg_advisory_xact_lock(hashtext(p_family_id::text));`
2. Seluruh penambahan atau perubahan relasi diwajibkan melalui RPC `add_parent_child_relationship(...)` yang memperoleh lock transaksional ini sebelum validasi dan *insert*.

---

## 3. Serikat Pasangan (Unions) dan Anak

1. **Hubungan Pasangan Multipel**:
   - Seseorang dapat memiliki lebih dari satu hubungan pasangan (`unions`) sepanjang hidupnya (misal pernikahan kedua setelah bercerai atau wafat, atau pernikahan poligami historis).
   - Setiap union dicatat terpisah dengan peserta di `union_participants`.
2. **Keterpisahan Anak dan Pasangan**:
   - Anak seorang individu **tidak otomatis** menjadi anak dari semua pasangan individu tersebut.
   - Tabel `parent_child_relationships` memiliki atribut opsional `union_id`. Jika diketahui anak tersebut lahir dari pernikahan $A$, maka `union_id` ditautkan ke $A$. Jika anak lahir sebelum pernikahan atau orang tua kedua tidak diketahui, `union_id` boleh `NULL`.

---

## 4. Representasi Tanggal Perkiraan & Fleksibilitas Historis

Banyak catatan silsilah kuno yang tidak mencantumkan tanggal eksak Gregorian. Sistem Pusaka Keluarga melarang "mengarang" tanggal palsu untuk mengisi kolom `DATE`.

Struktur Kolom Tanggal:
- `date_exact` (`DATE`): Hanya diisi jika tanggal, bulan, dan tahun terverifikasi pasti.
- `date_year` (`SMALLINT`): Tahun numerik (misal 1892) untuk keperluan pengurutan dan visualisasi generasi.
- `date_type`:
  - `EXACT`: Tanggal pasti.
  - `APPROXIMATE`: Perkiraan (misal: "Sekitar 1910").
  - `BEFORE`: Sebelum suatu masa (misal: "Sebelum 1945").
  - `AFTER`: Setelah suatu masa (misal: "Setelah Perang Diponegoro").
  - `BETWEEN`: Antara dua rentang tahun.
  - `UNKNOWN`: Tidak diketahui sama sekali.
- `date_text`: Menyimpan catatan literal asli (misal: "Wafat saat panen tebu zaman Belanda").

---

## 5. Sumber, Bukti, dan Penanganan Klaim Bertentangan

Dalam penelitian silsilah, sering ditemukan sumber yang bertentangan (misalnya: nisan menyebut lahir tahun 1920, tetapi akta sensus menyebut 1923).

### Aturan Klaim & Sumber:
1. **Pemisahan Sumber dan Pernyataan (Klaim)**:
   - `sources`: Menyimpan metadata fisik/digital dokumen (misal: Buku Silsilah Trah Kyai Ageng, terbitan 1968).
   - `claims`: Menyimpan pernyataan fakta individu beserta status konsensusnya.
   - `claim_sources`: Menghubungkan klaim dengan sumber serta menilai kualitas bukti (`direct`, `indirect`, `hearsay`, `questionable`).
2. **Status Klaim**:
   - `belum_ditinjau`: Usulan data baru yang dimasukkan kontributor.
   - `sedang_ditinjau`: Sedang diverifikasi oleh kurator/admin.
   - `diterima`: Menjadi fakta utama yang ditampilkan pada kartu profil silsilah.
   - `diperdebatkan`: Terdapat beberapa sumber terpercaya yang saling bertentangan; semua klaim dipertahankan dan ditampilkan sebagai catatan penelitian.
   - `ditolak`: Klaim terbukti salah berdasarkan bukti yang lebih kuat, namun **tidak dihapus** dari database agar menjadi referensi riwayat penelitian agar tidak diajukan ulang di masa depan.

---

## 6. Prosedur Penggabungan Profil (Profile Merging)

Jika ditemukan dua entri orang yang ternyata merupakan individu yang sama (misal: "Bambang Soediro" dan "B. Soediro"), sistem menyediakan prosedur penggabungan transaksional melalui database RPC:

### Syarat dan Prosedur:
1. **Validasi Otorisasi**: Hanya pengguna dengan peran `owner` atau `family_admin` yang dapat menjalankan penggabungan.
2. **Deteksi Siklus Baru**: Sebelum penggabungan dieksekusi, sistem memeriksa apakah penggabungan akan menghasilkan siklus leluhur. Jika ya, transaksi dibatalkan (*rollback*).
3. **Migrasi Data Terikat Transaksi**:
   - Pindahkan seluruh variasi nama (`person_names`) dari Profil $B$ ke Profil $A$.
   - Pindahkan seluruh relasi orang tua dan anak (`parent_child_relationships`) dari $B$ ke $A$ (abaikan relasi duplikat).
   - Pindahkan seluruh partisipasi pasangan (`union_participants`).
   - Pindahkan klaim (`claims`), media (`media`), dan peristiwa (`event_persons`).
   - Catat operasi `MERGE` secara detail di `audit_logs` termasuk snapshot JSON seluruh data asli Profil $B$.
   - Tandai Profil $B$ sebagai merged (atau soft delete dengan referensi `merged_into_id = A`).

