/**
 * Duplicate Detector Engine — Pusaka Keluarga
 * Mendeteksi kemungkinan duplikasi individu berdasarkan kemiripan nama dan rentang tahun,
 * dilengkapi dukungan normalisasi ejaan lama (Van Ophuijsen / Suwandi) ke EYD.
 */

export interface CandidatePerson {
  id: string;
  primary_name: string;
  nickname?: string | null;
  gender: string;
  birth_date_year?: number | null;
  death_date_year?: number | null;
  alternate_names?: string[];
}

export interface DuplicateMatch {
  candidate: CandidatePerson;
  score: number; // 0 to 100%
  reasons: string[];
}

const COMMON_TITLES = [
  "raden mas",
  "raden ajeng",
  "raden ayu",
  "raden",
  "krt",
  "haji",
  "hajjah",
  "hj",
  "h",
  "dr",
  "dra",
  "drs",
  "ir",
  "prof",
  "kyai",
  "mbah",
  "gusti",
  "tengku",
  "teuku",
  "andi",
  "sutan",
];

export function normalizeName(name: string): string {
  let cleaned = name.toLowerCase().trim();

  // 1. Hapus titik pada singkatan (misal K.R.T. -> krt, Hj. -> hj)
  cleaned = cleaned.replace(/\./g, "");

  // 2. Hapus tanda baca lainnya menjadi spasi
  cleaned = cleaned.replace(/[,/#!$%^&*;:{}=\-_`~()]/g, " ");

  // 3. Normalisasi spasi
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // 4. Hapus gelar umum dari awal kalimat
  for (const title of COMMON_TITLES) {
    if (cleaned === title || cleaned.startsWith(title + " ")) {
      cleaned = cleaned.substring(title.length).trim();
      break;
    }
  }

  // 5. Normalisasi ejaan lama Nusantara (Van Ophuijsen & Suwandi -> EYD)
  // 'oe' -> 'u' (contoh: Soedirjo -> Sudirjo)
  cleaned = cleaned.replace(/oe/g, "u");
  // 'dj' -> 'j' (contoh: Djoko -> Joko)
  cleaned = cleaned.replace(/dj/g, "j");
  // 'tj' -> 'c' (contoh: Tjipto -> Cipto)
  cleaned = cleaned.replace(/tj/g, "c");
  // 'j' di era belanda kadang berbunyi 'y' (contoh: Soedirjo -> Sudiryo)
  // namun kita pertahankan huruf konsonan terstandar
  cleaned = cleaned.replace(/j/g, "y"); // unifikasi j/y pada nama jawa kuno

  return cleaned.replace(/\s+/g, " ").trim();
}

/**
 * Menghitung koefisien kemiripan Bigram (Sørensen–Dice coefficient)
 */
export function stringSimilarity(str1: string, str2: string): number {
  const s1 = normalizeName(str1);
  const s2 = normalizeName(str2);

  if (s1 === s2) return 1.0;
  if (s1.length < 2 || s2.length < 2) return 0.0;

  const bigrams1 = new Map<string, number>();
  for (let i = 0; i < s1.length - 1; i++) {
    const bigram = s1.substring(i, i + 2);
    bigrams1.set(bigram, (bigrams1.get(bigram) || 0) + 1);
  }

  let intersectionSize = 0;
  for (let i = 0; i < s2.length - 1; i++) {
    const bigram = s2.substring(i, i + 2);
    const count = bigrams1.get(bigram) || 0;
    if (count > 0) {
      bigrams1.set(bigram, count - 1);
      intersectionSize++;
    }
  }

  const totalBigrams = s1.length - 1 + (s2.length - 1);
  return (2.0 * intersectionSize) / totalBigrams;
}

/**
 * Mendeteksi potensi duplikat dari calon data individu baru terhadap daftar individu yang ada
 */
export function findPotentialDuplicates(
  target: {
    primary_name: string;
    nickname?: string | null;
    gender?: string;
    birth_date_year?: number | null;
    death_date_year?: number | null;
  },
  existingList: CandidatePerson[],
  threshold = 60
): DuplicateMatch[] {
  const matches: DuplicateMatch[] = [];

  for (const candidate of existingList) {
    const reasons: string[] = [];
    let nameScore = stringSimilarity(target.primary_name, candidate.primary_name);

    // Cek juga variasi nama / nama alternatif
    if (candidate.alternate_names && candidate.alternate_names.length > 0) {
      for (const alt of candidate.alternate_names) {
        const altScore = stringSimilarity(target.primary_name, alt);
        if (altScore > nameScore) {
          nameScore = altScore;
          reasons.push(`Nama cocok dengan nama alternatif: "${alt}"`);
        }
      }
    }

    // Cek kemiripan nama panggilan jika ada
    if (target.nickname && candidate.nickname) {
      const nickScore = stringSimilarity(target.nickname, candidate.nickname);
      if (nickScore > 0.8) {
        reasons.push(`Nama panggilan identik ("${target.nickname}")`);
      }
    }

    let totalScore = nameScore * 70; // Bobot nama 70%

    if (nameScore >= 0.7) {
      reasons.push(`Kemiripan nama mencapai ${(nameScore * 100).toFixed(0)}%`);
    }

    // Evaluasi Jenis Kelamin
    if (target.gender && candidate.gender) {
      if (target.gender === candidate.gender) {
        totalScore += 10;
      } else if (target.gender !== "unknown" && candidate.gender !== "unknown") {
        totalScore -= 30; // Penalti jika jenis kelamin bertentangan
      }
    }

    // Evaluasi Tahun Lahir
    if (target.birth_date_year && candidate.birth_date_year) {
      const yearDiff = Math.abs(target.birth_date_year - candidate.birth_date_year);
      if (yearDiff === 0) {
        totalScore += 20;
        reasons.push(`Tahun lahir sama persis (${target.birth_date_year})`);
      } else if (yearDiff <= 2) {
        totalScore += 15;
        reasons.push(`Tahun lahir selisih ${yearDiff} tahun (${target.birth_date_year} vs ${candidate.birth_date_year})`);
      } else if (yearDiff > 10) {
        totalScore -= 25; // Penalti jika selisih usia sangat jauh
      }
    }

    const finalScore = Math.min(100, Math.max(0, Math.round(totalScore)));

    if (finalScore >= threshold && reasons.length > 0) {
      matches.push({
        candidate,
        score: finalScore,
        reasons,
      });
    }
  }

  // Urutkan dari skor tertinggi
  return matches.sort((a, b) => b.score - a.score);
}

