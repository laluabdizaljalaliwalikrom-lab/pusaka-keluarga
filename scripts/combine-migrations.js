const fs = require("fs");
const path = require("path");

const migrationsDir = path.join(__dirname, "..", "supabase", "migrations");
const files = [
  "20250101000000_initial_schema.sql",
  "20250102000000_domain_functions.sql",
  "20250103000000_auth_and_rls.sql",
  "20250104000000_proposals_and_media.sql",
];

let combined = `-- ==============================================================================
-- PUSAKA KELUARGA — COMBINED ALL MIGRATIONS (FASE 1 S/D 9)
-- Untuk dijalankan langsung di Supabase Dashboard SQL Editor
-- Proyek: https://supabase.com/dashboard/project/exdeymrasimtkhnrxpwc/sql/new
-- ==============================================================================
\n`;

for (const f of files) {
  const filePath = path.join(migrationsDir, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, "utf8");
    // Idempotency: Tambahkan DROP POLICY IF EXISTS sebelum setiap CREATE POLICY
    content = content.replace(
      /CREATE POLICY "([^"]+)" ON ([a-zA-Z0-9_.]+)/g,
      'DROP POLICY IF EXISTS "$1" ON $2;\nCREATE POLICY "$1" ON $2'
    );
    combined += `\n-- >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n`;
    combined += `-- FILE: ${f}\n`;
    combined += `-- <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n\n`;
    combined += content + "\n";
  }
}

const outputPath = path.join(__dirname, "..", "supabase", "combined_migration.sql");
fs.writeFileSync(outputPath, combined, "utf8");
console.log("Combined migration created at:", outputPath);
console.log("File size bytes:", fs.statSync(outputPath).size);

