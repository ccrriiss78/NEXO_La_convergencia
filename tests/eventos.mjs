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
const estilosMovil = fs.readFileSync(new URL("../css/movil.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");

assert.match(interfaz, /for \(let i = 0; i < EVENTOS\.length; i\+\+\)/);
assert.match(interfaz, /superposicion\.hidden = false/);
assert.match(interfaz, /superposicion\.hidden = true/);
assert.match(interfaz, /setAttribute\("aria-hidden", "false"\)/);
assert.match(interfaz, /setAttribute\("aria-hidden", "true"\)/);
assert.match(estilos, /#superposicion-evento\[hidden\]\{display:none!important\}/);
assert.match(html, /id="superposicion-evento"[^>]*aria-describedby="descripcion-evento"[^>]*aria-hidden="true"[^>]*hidden/);
assert.match(html, /body \{ visibility: hidden; \}[\s\S]*nexo-estilos-listos body \{ visibility: visible; \}/);
assert.match(html, /var pendientes = 4[\s\S]*window\.nexoEstiloCargado[\s\S]*setTimeout\(mostrar, 4000\)/);
assert.equal((html.match(/onload="nexoEstiloCargado\(\)"/g) || []).length, 4);
assert.match(main, /btn-cerrar-evento[\s\S]*cerrarEventoDeRonda/);
assert.match(main, /function cerrarEventoDeRonda\(\): void \{\s*ocultarEvento\(\)/);
assert.match(main, /function prepararRescateControlesIPad[\s\S]*modalEvento[\s\S]*btn-cerrar-evento[\s\S]*tocaControl\(botonCerrarEvento\)[\s\S]*cerrarEventoDeRonda\(\)[\s\S]*return/);
assert.match(estilosMovil, /Chispa Creativa en móvil horizontal[\s\S]*chispa-activa[\s\S]*grid-template-rows: 52px 58px 12px[\s\S]*pista-chispa-nexo[\s\S]*grid-row: 2/);
assert.match(estilosMovil, /Los demás eventos conservan su efecto[\s\S]*evento-activo-resumen:not\(\.oculta\)[\s\S]*top: 143px[\s\S]*margin-top: 174px[\s\S]*chispa-activa[\s\S]*display: none/);
assert.match(estilosMovil, /Modificador de ronda:[\s\S]*tarjeta-carta-crisis:not\(\.oculta\)[\s\S]*grid-template-rows: 116px 30px[\s\S]*descripcion-carta-crisis[\s\S]*display: block[\s\S]*margin-top: 214px/);
assert.match(estilosMovil, /El aviso de evento ya no comparte la fila[\s\S]*evento-activo-resumen:not\(\.oculta\)[\s\S]*justify-content: center[\s\S]*btn-confirmar-jugada[\s\S]*margin-left: auto/);
assert.match(estilosMovil, /El último botón de la introducción usa una imagen 1552:400[\s\S]*btn-ir-configuracion\.ultimo-paso[\s\S]*width: min\(42vw, 190px\)[\s\S]*height: auto[\s\S]*aspect-ratio: 1552 \/ 400[\s\S]*overflow: hidden/);

console.log("NEXO: 5 eventos con nombre, explicación y cierre verificados.");
