import assert from "node:assert/strict";
import { Partida } from "../dist/Partida.js";

function evento(id) {
  return { getId: () => id };
}

function probarParidadYConvergencia() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 1;
  partida.cartaIA = 3;
  partida.apuestaDeclaradaIA = "PAR";
  const resumen = partida.resolverRonda(1, "PAR");
  assert.equal(resumen.suma, 4);
  assert.equal(resumen.paridad, "PAR");
  assert.equal(resumen.resultado, "CONVERGENCIA");
  assert.equal(partida.getSaludPlaneta(), 54);
}

function probarFracaso() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 1;
  partida.cartaIA = 2;
  partida.apuestaDeclaradaIA = "IMPAR";
  const resumen = partida.resolverRonda(2, "IMPAR");
  assert.equal(resumen.paridad, "PAR");
  assert.equal(resumen.resultado, "FRACASO");
  assert.equal(partida.getSaludPlaneta(), 47);
}

function probarCumbreNoAgravaSequia() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 1;
  partida.cartaIA = 3;
  partida.apuestaDeclaradaIA = "PAR";
  partida.cartaCrisis = { id: "sequia" };
  partida.eventoActivo = evento("cumbre");
  const resumen = partida.resolverRonda(1, "PAR");
  assert.equal(resumen.resultado, "CONVERGENCIA");
  assert.equal(resumen.puntosPlaneta, -4);
  assert.equal(partida.getSaludPlaneta(), 46);
}


function probarRecuperacionTerminaPartidaEnModoFijo() {
  const partida = new Partida("HUMANO", "humano-hombre", 12);
  partida.ronda = 4;
  partida.saludPlaneta = 96;
  partida.cartaIA = 3;
  partida.apuestaDeclaradaIA = "PAR";
  const resumen = partida.resolverRonda(1, "PAR");
  assert.equal(resumen.resultado, "CONVERGENCIA");
  assert.equal(partida.getSaludPlaneta(), 100);
  assert.equal(partida.estaTerminada(), true);
  assert.equal(partida.calcularFinal().desenlace, "CONVERGENCIA TOTAL");
}
function probarEmpateFinal() {
  const partida = new Partida("HUMANO", "humano-hombre", 1);
  partida.ronda = 1;
  const final = partida.calcularFinal();
  assert.equal(final.desenlace, "EQUILIBRIO INESTABLE");
}

probarParidadYConvergencia();
probarFracaso();
probarCumbreNoAgravaSequia();
probarRecuperacionTerminaPartidaEnModoFijo();
probarEmpateFinal();

console.log("NEXO: 5 comprobaciones funcionales superadas.");
