import { Jugador } from "./Jugador.js";
import { Apuesta } from "./tipos.js";
import { Carta } from "./Carta.js";

/**
 * El "cerebro" de la IA.
 *
 * La máquina decide DOS cosas al empezar la ronda: qué carta pone boca abajo
 * y qué apuesta declara. Y las declara ANTES que el jugador.
 *
 * Ese orden es la regla más importante del juego. Como el humano ve la
 * apuesta de la IA antes de decidir la suya, puede elegir entre alinearse
 * con ella (y jugar a la convergencia) o llevarle la contraria (y forzar un
 * duelo). Si la IA apostase después, el jugador no decidiría nada: el
 * resultado de la ronda sería puro azar.
 *
 * Está en funciones sueltas y no dentro de la clase Jugador a propósito:
 * Jugador guarda datos (es igual para el humano y para la IA) y este
 * archivo decide, que es otra cosa.
 */

/** Devuelve "PAR" o "IMPAR" lanzando una moneda. */
function apuestaAlAzar(): Apuesta {
  if (Math.random() < 0.5) {
    return "PAR";
  }
  return "IMPAR";
}

/** Devuelve la apuesta contraria a la recibida. */
export function apuestaContraria(apuesta: Apuesta): Apuesta {
  if (apuesta === "PAR") {
    return "IMPAR";
  }
  return "PAR";
}

/**
 * Elige la carta que la IA pone boca abajo y la descarta de su mano.
 *
 * Normalmente elige al azar entre las que le quedan. Si ha conquistado
 * CREATIVIDAD deja de jugar al azar: repite la carta con la que ya ganó
 * una ronda, siempre que todavía la tenga disponible.
 */
export function decidirCartaIA(ia: Jugador, capacidadesPermitidas: boolean): number {
  const disponibles: Carta[] = ia.getCartasDisponibles();
  if (disponibles.length === 0) {
    return 0;
  }

  if (capacidadesPermitidas && ia.tiene("creatividad") && ia.getCartaGanadora() > 0) {
    for (let i = 0; i < disponibles.length; i++) {
      if (disponibles[i].getValor() === ia.getCartaGanadora()) {
        return ia.jugarCarta(ia.getCartaGanadora());
      }
    }
  }

  const posicion: number = Math.floor(Math.random() * disponibles.length);
  return ia.jugarCarta(disponibles[posicion].getValor());
}

/**
 * La apuesta que la IA declara al empezar la ronda, antes de saber nada de
 * lo que va a hacer el jugador.
 *
 * @param ia                     la jugadora artificial
 * @param capacidadesPermitidas  false durante la Tormenta solar
 */
export function declararApuestaIA(ia: Jugador, capacidadesPermitidas: boolean): Apuesta {
  if (!capacidadesPermitidas) {
    return apuestaAlAzar();
  }

  // ADAPTACIÓN: si lleva dos derrotas seguidas cambia de estrategia y
  // declara lo contrario de lo que declaró la última vez.
  const historial: Apuesta[] = ia.getHistorialApuestas();
  if (ia.tiene("adaptacion") && ia.getDerrotasSeguidas() >= 2 && historial.length > 0) {
    return apuestaContraria(historial[historial.length - 1]);
  }

  // CREATIVIDAD: la mitad de las veces repite la apuesta con la que ganó.
  const ganadora: Apuesta | null = ia.getApuestaGanadora();
  if (ia.tiene("creatividad") && ganadora !== null && Math.random() < 0.5) {
    return ganadora;
  }

  return apuestaAlAzar();
}

/**
 * INTUICIÓN: una de cada tres rondas, la IA lee la intención del jugador y
 * cambia su apuesta a última hora.
 *
 * Basta con darle la vuelta a su propia apuesta para arruinar el plan del
 * humano, sea cual sea: si el jugador se había alineado buscando la
 * convergencia, ahora se encuentra un duelo; y si buscaba el duelo, ahora
 * se encuentra alineado y sin capacidad que conquistar.
 */
export function laIACambiaDeIdea(
  ia: Jugador,
  ronda: number,
  capacidadesPermitidas: boolean
): boolean {
  return capacidadesPermitidas && ia.tiene("intuicion") && ronda % 3 === 0;
}

/**
 * EMPATÍA: con el planeta en peligro, la IA renuncia a ganar y juega a
 * cartas vistas para que el humano pueda buscar la convergencia.
 */
export function laIAJuegaACartasVistas(
  ia: Jugador,
  saludPlaneta: number,
  limitePeligro: number,
  capacidadesPermitidas: boolean
): boolean {
  return capacidadesPermitidas && ia.tiene("empatia") && saludPlaneta < limitePeligro;
}
