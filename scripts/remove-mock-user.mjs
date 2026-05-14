// scripts/remove-mock-user.mjs
// Run: node scripts/remove-mock-user.mjs
// Uses only Node.js built-ins — no extra dependencies needed.
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs"
import { join } from "path"

function getAllTsx(dir, results = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) getAllTsx(full, results)
    else if (full.endsWith(".tsx")) results.push(full)
  }
  return results
}

const root     = process.cwd()
const dashDir  = join(root, "app", "dashboard")
const files    = getAllTsx(dashDir)
let   changed  = 0

for (const file of files) {
  let src      = readFileSync(file, "utf8")
  const before = src

  // 1. Remove the MOCK_USER constant line (handles any role/shape on one line)
  src = src.replace(/^const MOCK_USER\s*=\s*\{[^\n]+\}\n?/gm, "")

  // 2. Remove   user={MOCK_USER as any}  from DashboardLayout (inline or separate line)
  src = src.replace(/\s+user=\{MOCK_USER as any\}/g, "")
  src = src.replace(/\s+user=\{MOCK_USER\}/g, "")

  // 3. Collapse any resulting blank lines (max 1 blank between sections)
  src = src.replace(/\n{3,}/g, "\n\n")

  if (src !== before) {
    writeFileSync(file, src, "utf8")
    console.log("✅ Fixed:", file.replace(root, "").replace(/\\/g, "/"))
    changed++
  }
}

console.log(`\n🎉 Done! Removed MOCK_USER from ${changed} files.`)
console.log("DashboardLayout now reads the real user from NextAuth session automatically.")
