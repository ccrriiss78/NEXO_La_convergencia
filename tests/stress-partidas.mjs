import assert from "node:assert/strict";
import { Partida } from "../dist/Partida.js";

const APUESTAS = ["PAR", "IMPAR"];
const RONDAS = [8, 12, 16];
const PARTIDAS_POR_DURACION = 300;

let semilla = 20260918;
function azar() {
  semilla = (semilla * 1664525 + 1013904223) >>> 0;
  return semilla / 4294967296;
}

function elegir(lista) {
  return lista[Math.floor(azar() * lista.length)];
}

function apuestaHumana(partida, estrategia) {
  const apuestaIA = partida.getApuestaDeclaradaIA();
  if (estrategia === 0) return apuestaIA;
  if (estrategia === 1) return apuestaIA === "PAR" ? "IMPAR" : "PAR";
  return elegir(APUESTAS);
}

const finales = new Set();
const eventos = new Set();
const cartasCrisis = new Set();
let rondasResueltas = 0;

const azarOriginal = Math.random;
Math.random = azar;

try {
  for (const totalRondas of RONDAS) {
    for (let numero = 0; numero < PARTIDAS_POR_DURACION; numero++) {
      const avatarHumano = numero % 2 === 0 ? "humano-hombre" : "humano-mujer";
      const avatarIA = numero % 2 === 0 ? "ia-01" : "ia-02";
      const partida = new Partida("PRUEBA " + numero, avatarHumano, totalRondas, avatarIA);

      while (!partida.estaTerminada()) {
        partida.prepararRonda();
        const disponibles = partida.getJugador().getCartasDisponibles();
        assert.ok(disponibles.length > 0, "La mano humana debe ofrecer alguna carta");

        const carta = elegir(disponibles).getValor();
        const apuesta = apuestaHumana(partida, numero % 3);
        partida.getJugador().jugarCarta(carta);

        const resumen = partida.resolverRonda(carta, apuesta);
        rondasResueltas++;

        assert.equal(resumen.suma, resumen.cartaJugador + resumen.cartaIA);
        assert.equal(resumen.paridad, resumen.suma % 2 === 0 ? "PAR" : "IMPAR");
        assert.ok(["CONVERGENCIA", "RIVALIDAD", "FRACASO"].includes(resumen.resultado));
        assert.ok(["HUMANO", "IA", "NADIE"].includes(resumen.ganador));
        assert.equal(resumen.saludPlanetaDespues, partida.getSaludPlaneta());
        assert.ok(partida.getSaludPlaneta() >= 0 && partida.getSaludPlaneta() <= 100);
        assert.ok(partida.getJugador().getEvolucion() >= 0 && partida.getJugador().getEvolucion() <= 100);
        assert.ok(partida.getIA().getEvolucion() >= 0 && partida.getIA().getEvolucion() <= 100);

        const evento = partida.getEventoActivo();
        if (evento !== null) eventos.add(evento.getId());
        const crisis = partida.getCartaCrisis();
        if (crisis !== null) cartasCrisis.add(crisis.id);

        if (!partida.estaTerminada()) {
          assert.ok(partida.getRonda() < totalRondas);
          assert.ok(partida.getSaludPlaneta() > 0 && partida.getSaludPlaneta() < 100);
        }
      }

      const final = partida.calcularFinal();
      finales.add(final.desenlace);
      assert.equal(final.rondasJugadas, partida.getRonda());
      assert.equal(final.saludPlaneta, partida.getSaludPlaneta());
      assert.equal(final.porcentajeJugador + final.porcentajeIA, 100);
      assert.ok(final.rondasJugadas <= totalRondas);
    }
  }
} finally {
  Math.random = azarOriginal;
}

assert.ok(finales.size >= 4, "Las simulaciones deben recorrer desenlaces variados");
assert.equal(eventos.size, 5, "Deben aparecer los cinco eventos especiales");
assert.equal(cartasCrisis.size, 5, "Deben aparecer las cinco cartas de crisis");

console.log(
  `NEXO: ${RONDAS.length * PARTIDAS_POR_DURACION} partidas completas y ` +
  `${rondasResueltas} rondas simuladas sin estados inválidos.`
);
