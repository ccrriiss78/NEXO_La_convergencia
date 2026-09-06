import assert from "node:assert/strict";
import fs from "node:fs";
import { Partida } from "../dist/Partida.js";
import { CAPACIDADES_HUMANAS, CAPACIDADES_IA } from "../dist/datos.js";

function darCapacidades(jugador, lista, cantidad) {
  for (let i = 0; i < cantidad; i++) {
    jugador.conquistarSiguiente(lista);
  }
}

function probarAnalisisDaConsejoUtil() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 2;
  partida.cartaIA = 2;
  partida.apuestaDeclaradaIA = "PAR";
  darCapacidades(partida.getJugador(), CAPACIDADES_IA, 3);
  const consejo = partida.getConsejoAnalisis();
  assert.match(consejo.convergencia, /carta [1-5] · \d+% de combinaciones posibles/);
  assert.match(consejo.rivalidad, /carta [1-5] · \d+% de combinaciones posibles/);
}

function probarVelocidadPrevisualizaSinMutar() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 2;
  partida.cartaIA = 3;
  partida.apuestaDeclaradaIA = "PAR";
  const antes = partida.getSaludPlaneta();
  const a = partida.previsualizarResultado(1, "PAR");
  const b = partida.previsualizarResultado(2, "PAR");
  assert.equal(a.suma, 4);
  assert.equal(b.suma, 5);
  assert.equal(partida.getSaludPlaneta(), antes);
  assert.equal(partida.getJugador().getEvolucion(), 0);
}

function probarIntuicionRevisaCarta() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  const ia = partida.getIA();
  darCapacidades(ia, CAPACIDADES_HUMANAS, 2); // Creatividad + Intuición
  partida.ronda = 3;
  partida.apuestaDeclaradaIA = "PAR";
  ia.jugarCarta(2);
  partida.cartaIA = 2;
  const resumen = partida.resolverRonda(1, "IMPAR");
  assert.equal(resumen.intuicionIA, true);
  assert.equal(resumen.paridad, "PAR");
  assert.equal(resumen.ganador, "IA");
}


function probarPrecisionRevelaCartaFiableYPermiteCorreccion() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  const humano = partida.getJugador();
  const ia = partida.getIA();
  darCapacidades(humano, CAPACIDADES_IA, 2); // Memoria + Precisión
  darCapacidades(ia, CAPACIDADES_HUMANAS, 2); // Creatividad + Intuición
  partida.ronda = 3;
  partida.apuestaDeclaradaIA = "PAR";
  ia.jugarCarta(2);
  partida.cartaIA = 2;

  assert.equal(humano.puedeUsarPrecision(), true);
  humano.gastarPrecision();
  const revelada = partida.fijarCartaIAParaPrecision(1);
  assert.equal(revelada, 1); // Intuición se aplica antes de revelar y queda fijada.
  assert.equal(humano.puedeUsarPrecision(), false);

  // El humano corrige 1 -> 2 después de ver la carta IA. La IA no puede
  // cambiarla silenciosamente de nuevo: el dato revelado sigue siendo real.
  const resumen = partida.resolverRonda(2, "IMPAR");
  assert.equal(partida.getCartaIA(), revelada);
  assert.equal(resumen.cartaIA, revelada);
  assert.equal(resumen.suma, 3);
  assert.equal(resumen.ganador, "HUMANO");
}


function probarMemoriaRegistraJugadasIA() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  darCapacidades(partida.getJugador(), CAPACIDADES_IA, 1); // Memoria
  partida.ronda = 1;
  partida.cartaIA = 2;
  partida.apuestaDeclaradaIA = "PAR";
  partida.resolverRonda(1, "IMPAR");
  assert.deepEqual(partida.getIA().getHistorialCartas().slice(-1), [2]);
  assert.deepEqual(partida.getIA().getHistorialApuestas().slice(-1), ["PAR"]);
}

function probarEmpatiaSoloConPlanetaEnPeligro() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  const ia = partida.getIA();
  darCapacidades(ia, CAPACIDADES_HUMANAS, 3); // Creatividad + Intuición + Empatía
  partida.saludPlaneta = 24;
  assert.equal(partida.iaJuegaACartasVistas(), true);
  assert.match(partida.getAvisosFortalezasIA().join(" "), /EMPATÍA · PRIORIDAD PLANETARIA/);
  partida.saludPlaneta = 25;
  assert.equal(partida.iaJuegaACartasVistas(), false);
}

function probarVelocidadUsaCambiosRealesDeCrisis() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 2;
  partida.cartaIA = 1;
  partida.apuestaDeclaradaIA = "PAR";
  partida.cartaCrisis = { id: "sequia", nombre: "Sequía", efecto: "", tipo: "Negativa" };
  const a = partida.previsualizarResultado(1, "PAR"); // convergencia, pero sequía daña -2
  const b = partida.previsualizarResultado(3, "PAR"); // convergencia, sequía daña -4
  assert.equal(a.puntosPlaneta, -2);
  assert.equal(b.puntosPlaneta, -4);
}

function probarCreatividadCambiaApuestaTrasDosDerrotas() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  const ia = partida.getIA();
  darCapacidades(ia, CAPACIDADES_HUMANAS, 1); // Creatividad
  ia.registrarJugada(1, "PAR");
  ia.sumarDerrota();
  ia.sumarDerrota();
  const original = Math.random;
  Math.random = () => 0.1;
  partida.prepararRonda();
  Math.random = original;
  assert.equal(partida.getApuestaDeclaradaIA(), "IMPAR");
  assert.match(partida.getAvisosFortalezasIA().join(" "), /CREATIVIDAD · CAMBIO DE ENFOQUE/);
}

function probarAdaptacionReutilizaCartaGanadora() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  const ia = partida.getIA();
  darCapacidades(ia, CAPACIDADES_HUMANAS, 4); // incluye Adaptación
  ia.guardarJugadaGanadora(4, "PAR");
  const original = Math.random;
  Math.random = () => 0.9;
  partida.prepararRonda();
  Math.random = original;
  assert.equal(partida.getCartaIA(), 4);
  assert.match(partida.getAvisosFortalezasIA().join(" "), /ADAPTACIÓN · REUTILIZACIÓN EFICAZ/);
}

function probarFracasoNoCuentaComoDerrotaIA() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  const ia = partida.getIA();
  partida.ronda = 1;
  partida.cartaIA = 1;
  partida.apuestaDeclaradaIA = "PAR";
  // suma 2 = PAR; ambos apuestan IMPAR? IA está PAR, así no sería fracaso.
  partida.apuestaDeclaradaIA = "IMPAR";
  const resumen = partida.resolverRonda(1, "IMPAR"); // ambos aciertan: no sirve
  // Forzamos un fracaso claro en una segunda partida: suma PAR, ambos declaran IMPAR => ambos aciertan;
  // para fracaso deben apostar ambos lo contrario de la paridad, por eso IA PAR y suma IMPAR.
  const p2 = new Partida("HUMANO", "humano-hombre", 12);
  p2.ronda = 1;
  p2.cartaIA = 2;
  p2.apuestaDeclaradaIA = "PAR";
  const r2 = p2.resolverRonda(1, "PAR"); // suma 3 IMPAR, ambos fallan
  assert.equal(r2.resultado, "FRACASO");
  assert.equal(p2.getIA().getDerrotasSeguidas(), 0);
}

function probarConfirmacionNoTieneEstadoMuerto() {
  const main = fs.readFileSync(new URL("../dist/main.js", import.meta.url), "utf8");
  assert.match(main, /cartasSeleccionadas\.length < necesarias/);
  assert.match(main, /fase = "carta";/);
  assert.match(main, /puedeUsarPrecision && activarPrecision\(\)/);
  assert.doesNotMatch(main, /ACTIVAR PRECISIÓN/);
  assert.match(main, /RESOLVER RONDA/);
  assert.match(main, /puedeUsarPrecision && activarPrecision\(\)/);
}

function probarPrecisionNoOfreceCorreccionImposible() {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const main = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
  assert.match(html, /id="precision-opciones-texto"/);
  assert.match(main, /SIN CARTAS ALTERNATIVAS/);
  assert.match(main, /las cinco se recuperarán al comenzar la ronda siguiente/);
  assert.match(main, /botonCorregir\.disabled = !hayCartaAlternativa/);
  assert.match(main, /if \(!hayCartaAlternativa\) \{\s*return;/);
}

function probarManualYLimpiezaUI() {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const main = fs.readFileSync(new URL("../dist/main.js", import.meta.url), "utf8");
  assert.match(html, /id="superposicion-manual"/);
  assert.match(html, /id="btn-como-jugar-intro"/);
  assert.match(html, /id="btn-ayuda-juego"/);
  assert.match(html, /id="panel-precision"/);
  assert.match(html, /id="btn-precision-mantener"/);
  assert.match(html, /id="btn-precision-corregir"/);
  assert.match(html, /Lectura exacta detectada/);
  assert.match(html, /id="precision-imagen-carta-ia"/);
  assert.doesNotMatch(html, /precision-carta-revelada|precision-carta-ia-persistente/);
  assert.doesNotMatch(html, /btn-veloz-a|btn-veloz-b/);
  assert.match(main, /fijarCartaIAParaPrecision/);
  assert.match(main, /precision-modo-correccion/);
  assert.doesNotMatch(main, /precision-carta-revelada|precision-carta-ia-persistente/);
  assert.doesNotMatch(main, /mostrarOpcionesVelocidad|textoOpcionVelocidad|laIACambiaDeIdea/);
}

function probarAvisoVelocidadVisible() {
  const main = fs.readFileSync(new URL("../dist/main.js", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../css/partida.css", import.meta.url), "utf8");
  assert.match(main, /FORTALEZA ACTIVA · VELOCIDAD — ELIGE DOS CARTAS/);
  assert.match(main, /const necesarias = usaVelocidad \? 2 : 1/);
  assert.match(main, /NEXO selecciona la carta/);
  assert.match(css, /V24\.21 EFECTIVA · HOVER Y AVISO DE VELOCIDAD PROTEGIDOS/);
  assert.match(css, /z-index:60!important/);
  assert.match(css, /z-index:61!important/);
}

function probarChispaYVelocidadNoCompartenEspacio() {
  const main = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
  const css = fs.readFileSync(new URL("../css/partida.css", import.meta.url), "utf8");
  assert.match(main, /"chispa-velocidad-activa"/);
  assert.match(main, /evento\.getId\(\) === "chispa" && velocidadDisponible\(\)/);
  assert.match(css, /V24\.23 · CHISPA CREATIVA \+ VELOCIDAD SIN SOLAPE/);
  assert.match(css, /#pantalla-juego\.chispa-velocidad-activa \.mano-cartas/);
  assert.match(css, /#pantalla-juego\.chispa-velocidad-activa \.carta-mano/);
}

probarMemoriaRegistraJugadasIA();
probarAnalisisDaConsejoUtil();
probarVelocidadPrevisualizaSinMutar();
probarVelocidadUsaCambiosRealesDeCrisis();
probarIntuicionRevisaCarta();
probarEmpatiaSoloConPlanetaEnPeligro();
probarCreatividadCambiaApuestaTrasDosDerrotas();
probarAdaptacionReutilizaCartaGanadora();
probarFracasoNoCuentaComoDerrotaIA();
probarPrecisionRevelaCartaFiableYPermiteCorreccion();
probarConfirmacionNoTieneEstadoMuerto();
probarPrecisionNoOfreceCorreccionImposible();
probarManualYLimpiezaUI();
probarAvisoVelocidadVisible();
probarChispaYVelocidadNoCompartenEspacio();
console.log("NEXO: 8 fortalezas y coherencia V22.36 verificadas.");
