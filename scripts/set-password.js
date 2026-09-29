import fs from "node:fs";
import path from "node:path";
import { randomBytes, scryptSync } from "node:crypto";
import { fileURLToPath } from "node:url";

const newPassword = process.argv[2];

if (!newPassword || newPassword.length < 6) {
  console.log("Uso: node scripts/set-password.js <sua-nova-senha>");
  console.log("A senha deve ter pelo menos 6 caracteres.");
  process.exit(1);
}

const salt = randomBytes(16).toString("hex");
const hash = scryptSync(newPassword, salt, 64).toString("hex");
const encoded = `scrypt:${salt}:${hash}`;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "..", ".env.local");
let content = "";
if (fs.existsSync(envPath)) {
  content = fs.readFileSync(envPath, "utf8");
}

if (content.includes("ADMIN_PASSWORD_HASH=")) {
  content = content.replace(/ADMIN_PASSWORD_HASH=.*/, `ADMIN_PASSWORD_HASH=${encoded}`);
} else {
  content += `\nADMIN_PASSWORD_HASH=${encoded}\n`;
}

fs.writeFileSync(envPath, content, "utf8");
console.log(`\n✓ Senha atualizada com sucesso no .env.local!`);
console.log(`Nova senha configurada: ${newPassword}\n`);
