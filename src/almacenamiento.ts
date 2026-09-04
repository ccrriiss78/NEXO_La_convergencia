import { ResumenFinal } from "./tipos.js";

/**
 * Guardado de datos en el navegador con localStorage.
 *
 * localStorage solo guarda TEXTO, así que para guardar un objeto lo
 * convertimos a texto con JSON.stringify() y al leerlo lo volvemos a
 * convertir en objeto con JSON.parse().
 *
 * Guardamos dos cosas: la mejor marca conseguida y la lista de perfiles
 * que se han desbloqueado alguna vez.
 */

/** Nombre con el que guardamos la mejor marca. */
const CLAVE_MEJOR: string = "nexo_mejor_marca";

/** Nombre con el que guardamos la colección de perfiles. */
const CLAVE_PERFILES: string = "nexo_perfiles";

/** Datos que guardamos de la mejor partida jugada en este navegador. */
export type MejorMarca = {
  nombre: string;
  evolucion: number;
  planeta: number;
  perfil: string;
  desenlace: string;
};

/**
 * Lee la mejor marca guardada. Si todavía no hay ninguna (o el texto
 * guardado está estropeado) devuelve null.
 */
export function leerMejorMarca(): MejorMarca | null {
  const texto: string | null = localStorage.getItem(CLAVE_MEJOR);
  if (texto === null) {
    return null;
  }
  try {
    return JSON.parse(texto) as MejorMarca;
  } catch (error) {
    return null;
  }
}

/**
 * Guarda la partida como mejor marca si supera a la anterior.
 *
 * Para comparar usamos la suma de evolución y salud del planeta, porque
 * el juego premia las dos cosas a la vez: no es mejor jugador el que más
 * evoluciona, sino el que evoluciona sin dejar el planeta hecho un desastre.
 */
export function guardarMejorMarca(nombre: string, resumen: ResumenFinal): boolean {
  const marca: MejorMarca = {
    nombre: nombre,
    evolucion: resumen.evolucionJugador,
    planeta: resumen.saludPlaneta,
    perfil: resumen.perfil.nombre,
    desenlace: resumen.desenlace
  };

  const anterior: MejorMarca | null = leerMejorMarca();
  if (anterior !== null) {
    const puntuacionNueva: number = marca.evolucion + marca.planeta;
    const puntuacionAnterior: number = anterior.evolucion + anterior.planeta;
    if (puntuacionNueva <= puntuacionAnterior) {
      return false;
    }
  }

  localStorage.setItem(CLAVE_MEJOR, JSON.stringify(marca));
  return true;
}

/** Lee la lista de perfiles ya desbloqueados. */
export function leerPerfiles(): string[] {
  const texto: string | null = localStorage.getItem(CLAVE_PERFILES);
  if (texto === null) {
    return [];
  }
  try {
    return JSON.parse(texto) as string[];
  } catch (error) {
    return [];
  }
}

/** Añade un perfil a la colección si no estaba ya guardado. */
export function guardarPerfil(nombrePerfil: string): void {
  const perfiles: string[] = leerPerfiles();
  for (let i = 0; i < perfiles.length; i++) {
    if (perfiles[i] === nombrePerfil) {
      return;
    }
  }
  perfiles.push(nombrePerfil);
  localStorage.setItem(CLAVE_PERFILES, JSON.stringify(perfiles));
}
