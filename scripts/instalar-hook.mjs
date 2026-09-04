import { execFileSync } from "node:child_process";

try {
  execFileSync("git", ["rev-parse", "--show-toplevel"], { stdio: "ignore" });
  execFileSync("git", ["config", "core.hooksPath", ".githooks"], { stdio: "inherit" });
  console.log("Guardián NEXO instalado: Git ejecutará la auditoría antes de cada commit.");
} catch {
  console.error("No se encontró un repositorio Git. Inicialízalo o ejecuta este comando dentro del repositorio.");
  process.exit(1);
}
