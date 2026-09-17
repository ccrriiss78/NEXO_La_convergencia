import assert from "node:assert/strict";
import fs from "node:fs";
import { EVENTOS } from "../dist/datos.js";

const idsEsperados = ["tormenta", "cumbre", "sobrecarga", "chispa", "sinretorno"];

assert.equal(EVENTOS.length, idsEsperados.length, "Deben existir los cinco eventos especiales.");
assert.deepEqual(EVENTOS.map((evento) => evento.id), idsEsperados);
assert.equal(new Set(EVENTOS.map((evento) => evento.id)).size, EVENTOS.length, "No puede haber ids de evento repetidos.");

for (const evento of EVENTOS) {
  assert.equal(typeof evento.nombre, "string");
  assert.notEqual(evento.nombre.trim(), "");
  assert.notEqual(evento.nombre.trim(), "—");
  assert.equal(typeof evento.descripcion, "string");
  assert.notEqual(evento.descripcion.trim(), "");
  assert.notEqual(evento.descripcion.trim(), "—");
}

const interfaz = fs.readFileSync(new URL("../src/interfaz.ts", import.meta.url), "utf8");
const estilos = fs.readFileSync(new URL("../css/partida.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");

assert.match(interfaz, /for \(let i = 0; i < EVENTOS\.length; i\+\+\)/);
assert.match(interfaz, /superposicion\.hidden = false/);
assert.match(interfaz, /superposicion\.hidden = true/);
assert.match(interfaz, /setAttribute\("aria-hidden", "false"\)/);
assert.match(interfaz, /setAttribute\("aria-hidden", "true"\)/);
assert.match(estilos, /#superposicion-evento\[hidden\]\{display:none!important\}/);
assert.match(html, /id="superposicion-evento"[^>]*aria-describedby="descripcion-evento"[^>]*aria-hidden="true"[^>]*hidden/);
assert.match(main, /btn-cerrar-evento[\s\S]*cerrarEventoDeRonda/);
assert.match(main, /function cerrarEventoDeRonda\(\): void \{\s*ocultarEvento\(\)/);

console.log("NEXO: 5 eventos con nombre, explicación y cierre verificados.");
