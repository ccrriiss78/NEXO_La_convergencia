import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifiesto = JSON.parse(fs.readFileSync(path.join(raiz, "proteccion-archivos.json"), "utf8"));
const errores = [];

const relativo = (ruta) => path.relative(raiz, ruta).split(path.sep).join("/");
const existe = (ruta) => fs.existsSync(path.join(raiz, ruta));

for (const archivo of manifiesto.archivosProtegidos) {
  if (!existe(archivo)) errores.push(`Falta el archivo protegido: ${archivo}`);
}

const listar = (carpeta, extension) => fs.readdirSync(path.join(raiz, carpeta), { withFileTypes: true })
  .filter((entrada) => entrada.isFile() && entrada.name.endsWith(extension))
  .map((entrada) => path.basename(entrada.name, extension))
  .sort();

const fuentes = listar("src", ".ts");
const compilados = listar("dist", ".js");
for (const modulo of fuentes.filter((nombre) => !compilados.includes(nombre))) {
  errores.push(`Falta dist/${modulo}.js para src/${modulo}.ts`);
}
for (const modulo of compilados.filter((nombre) => !fuentes.includes(nombre))) {
  errores.push(`Falta src/${modulo}.ts para dist/${modulo}.js`);
}
if (fuentes.length !== manifiesto.numeroModulos) errores.push(`Se esperaban ${manifiesto.numeroModulos} fuentes TypeScript y hay ${fuentes.length}`);
if (compilados.length !== manifiesto.numeroModulos) errores.push(`Se esperaban ${manifiesto.numeroModulos} módulos JavaScript y hay ${compilados.length}`);

const extensionesTexto = new Set([".html", ".css", ".js", ".ts", ".md"]);
const ignorar = new Set(["node_modules", "dist-comprobacion", ".git"]);
const textos = [];
function recorrer(carpeta) {
  for (const entrada of fs.readdirSync(carpeta, { withFileTypes: true })) {
    if (ignorar.has(entrada.name)) continue;
    const destino = path.join(carpeta, entrada.name);
    if (entrada.isDirectory()) recorrer(destino);
    else if (extensionesTexto.has(path.extname(entrada.name).toLowerCase())) textos.push(destino);
  }
}
recorrer(raiz);

const referencias = new Set();
const patron = /(?:\.\.\/|\.\/)?assets\/[A-Za-z0-9_./-]+\.(?:webp|png|jpe?g|gif|svg|wav|mp3|ogg)/gi;
for (const archivo of textos) {
  const contenido = fs.readFileSync(archivo, "utf8");
  for (const coincidencia of contenido.matchAll(patron)) referencias.add(coincidencia[0].replace(/^(?:\.\.\/|\.\/)/, ""));
}
for (const referencia of referencias) {
  if (!existe(referencia)) errores.push(`Referencia rota: ${referencia}`);
}

function listarAssets(carpeta) {
  const resultado = [];
  for (const entrada of fs.readdirSync(carpeta, { withFileTypes: true })) {
    const destino = path.join(carpeta, entrada.name);
    if (entrada.isDirectory()) resultado.push(...listarAssets(destino));
    else resultado.push(relativo(destino));
  }
  return resultado;
}
const assetsActuales = new Set(listarAssets(path.join(raiz, "assets")));
for (const asset of manifiesto.assetsProtegidos) {
  if (!assetsActuales.has(asset)) errores.push(`Ha desaparecido un asset del inventario: ${asset}`);
}

if (errores.length) {
  console.error("\nGUARDIÁN NEXO: auditoría fallida\n");
  for (const error of errores) console.error(`- ${error}`);
  console.error("\nRestaura los archivos o actualiza el inventario únicamente después de verificar el cambio.");
  process.exit(1);
}

console.log(`GUARDIÁN NEXO: correcto · ${manifiesto.archivosProtegidos.length} archivos esenciales · ${assetsActuales.size} assets · ${fuentes.length} módulos src/dist · ${referencias.size} referencias verificadas.`);
