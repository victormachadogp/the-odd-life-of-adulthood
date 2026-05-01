/**
 * sync-content.mjs
 *
 * Copia as imagens de content/comics/*\/pages/ para public/comics/*\/pages/
 * antes de cada dev ou build.
 *
 * Por que isso existe:
 *   - Imagens em content/ são a fonte da verdade (portável, versionada no git)
 *   - O Vite só serve arquivos estáticos de public/ — ele não enxerga content/
 *   - Sem esse sync, as URLs /comics/<slug>/pages/01.jpg retornam 404
 *
 * Por que não importar as imagens direto via Vite (import img from "...")?
 *   - Imports de módulo Vite acoplam o asset ao pipeline do framework
 *   - URLs estáticas em public/ são portáveis: qualquer framework as serve igual
 *   (ver docs/aprendizados.md para o raciocínio completo)
 *
 * public/comics/ está no .gitignore — é pasta gerada, não commitada.
 */
import { cpSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const contentDir = join(root, "content", "comics");
const publicDir = join(root, "public", "comics");

const slugs = readdirSync(contentDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

for (const slug of slugs) {
  const src = join(contentDir, slug, "pages");
  const dst = join(publicDir, slug, "pages");
  if (existsSync(src)) {
    mkdirSync(dst, { recursive: true });
    cpSync(src, dst, { recursive: true });
  }
}

console.log(`Synced ${slugs.length} comics to public/comics/`);