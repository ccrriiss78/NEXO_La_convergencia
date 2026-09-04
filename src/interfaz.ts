import { Partida } from "./Partida.js";
import { Jugador } from "./Jugador.js";
import { Carta } from "./Carta.js";
import { Apuesta, ResumenFinal, ResumenRonda } from "./tipos.js";
import { PERFILES, SALUD_MAXIMA, buscarCapacidad } from "./datos.js";
import { leerMejorMarca, leerPerfiles, MejorMarca } from "./almacenamiento.js";

/**
 * La interfaz: todo lo que toca el HTML está en este archivo.
 *
 * Ninguna función de aquí calcula puntos ni decide nada del juego: reciben
 * datos ya calculados (la partida o el resumen de la ronda) y los pintan.
 * Gracias a eso, si mañana cambiamos el diseño de la pantalla no hay que
 * tocar ni una línea de las clases del juego.
 */

/** Evolución que llena la barra del todo (las barras necesitan un tope). */
const EVOLUCION_MAXIMA_BARRA: number = 80;

// ---- Ayudas para trabajar con el DOM ------------------------------------

/**
 * Busca un elemento por su id. Usamos "as HTMLElement" para decirle a
 * TypeScript que ese elemento existe: los ids están escritos en el HTML.
 */
export function elemento(id: string): HTMLElement {
  return document.getElementById(id) as HTMLElement;
}

/** Escribe un texto dentro de un elemento. */
export function escribir(id: string, texto: string): void {
  elemento(id).textContent = texto;
}

export function mostrar(id: string): void {
  elemento(id).classList.remove("oculta");
}

export function ocultar(id: string): void {
  elemento(id).classList.add("oculta");
}

/** Enseña una pantalla y esconde todas las demás. */
export function mostrarPantalla(idPantalla: string): void {
  const pantallas: string[] = [
    "pantalla-inicio",
    "pantalla-introduccion",
    "pantalla-configuracion",
    "pantalla-juego",
    "pantalla-final"
  ];
  // Las pantallas no usan la clase "oculta" sino "activa": en el CSS una
  // .pantalla esta escondida por defecto y solo se ve cuando lleva .activa.
  for (let i = 0; i < pantallas.length; i++) {
    if (pantallas[i] === idPantalla) {
      elemento(pantallas[i]).classList.add("activa");
    } else {
      elemento(pantallas[i]).classList.remove("activa");
    }
  }
}

// ---- Los tres marcadores y los avatares ----------------------------------

/** Pinta las tres barras con sus números. */
export function pintarMarcadores(partida: Partida): void {
  const jugador: Jugador = partida.getJugador();
  const ia: Jugador = partida.getIA();

  const anchoHumano: number = calcularPorcentaje(jugador.getEvolucion(), EVOLUCION_MAXIMA_BARRA);
  const anchoIA: number = calcularPorcentaje(ia.getEvolucion(), EVOLUCION_MAXIMA_BARRA);
  const anchoPlaneta: number = calcularPorcentaje(partida.getSaludPlaneta(), SALUD_MAXIMA);

  elemento("barra-evolucion-humana").style.width = anchoHumano + "%";
  elemento("barra-evolucion-ia").style.width = anchoIA + "%";
  elemento("barra-salud-planeta").style.width = anchoPlaneta + "%";

  escribir("valor-evolucion-humana", String(jugador.getEvolucion()));
  escribir("valor-evolucion-ia", String(ia.getEvolucion()));
  escribir("valor-salud-planeta", partida.getSaludPlaneta() + " / " + SALUD_MAXIMA);
}

/** Convierte un valor en un porcentaje entre 0 y 100. */
function calcularPorcentaje(valor: number, maximo: number): number {
  let porcentaje: number = Math.round((valor / maximo) * 100);
  if (porcentaje > 100) {
    porcentaje = 100;
  }
  if (porcentaje < 0) {
    porcentaje = 0;
  }
  return porcentaje;
}

/**
 * Cambia las clases CSS de los avatares y del fondo del planeta.
 *
 * Es la "evolución visual" del documento de diseño: no dibujamos nada,
 * solo cambiamos la clase y el CSS se encarga del resto.
 */
export function pintarEvolucionVisual(partida: Partida): void {
  const jugador: Jugador = partida.getJugador();
  const ia: Jugador = partida.getIA();

  elemento("avatar-humano").className =
    "avatar avatar-humano tipo-" + jugador.getAvatar() + " nivel-" + jugador.getNivelVisual();
  elemento("avatar-ia").className = "avatar avatar-ia nivel-" + ia.getNivelVisual();

  // En el fondo solo cambiamos la clase del planeta: si tocásemos className
  // entero borraríamos la clase "oculta" que controla las pantallas.
  const pantalla: HTMLElement = elemento("pantalla-juego");
  pantalla.classList.remove("planeta-critico");
  pantalla.classList.remove("planeta-deteriorado");
  pantalla.classList.remove("planeta-estable");
  pantalla.classList.remove("planeta-recuperado");
  pantalla.classList.add("planeta-" + partida.getEstadoPlaneta());
}

/** Rellena una lista <ul> con los nombres de las capacidades conquistadas. */
export function pintarCapacidades(idLista: string, capacidades: string[]): void {
  const lista: HTMLElement = elemento(idLista);
  lista.innerHTML = "";

  if (capacidades.length === 0) {
    const vacio: HTMLLIElement = document.createElement("li");
    vacio.className = "capacidad-vacia";
    vacio.textContent = "Ninguna todavía";
    lista.appendChild(vacio);
    return;
  }

  for (let i = 0; i < capacidades.length; i++) {
    const ficha = buscarCapacidad(capacidades[i]);
    const linea: HTMLLIElement = document.createElement("li");
    if (ficha !== null) {
      linea.textContent = ficha.nombre;
      linea.title = ficha.efecto;
    } else {
      linea.textContent = capacidades[i];
    }
    lista.appendChild(linea);
  }
}

// ---- La zona de la ronda --------------------------------------------------

/** Escribe la ronda, la crisis y, si la hay, la carta de crisis. */
export function pintarCabeceraRonda(partida: Partida): void {
  let texto: string = "Ronda " + partida.getRonda();
  if (partida.getTotalRondas() > 0) {
    texto = texto + " de " + partida.getTotalRondas();
  } else {
    texto = texto + " · modo libre";
  }
  escribir("contador-ronda", texto);
  escribir("nombre-crisis", partida.getCrisisActual());

  const carta = partida.getCartaCrisis();
  if (carta === null) {
    ocultar("tarjeta-carta-crisis");
  } else {
    escribir("tipo-carta-crisis", carta.tipo.toUpperCase());
    escribir("nombre-carta-crisis", carta.nombre);
    escribir("descripcion-carta-crisis", carta.efecto);
    // Solo se cambia la clase del tipo: si reescribieramos className entero
    // borrariamos las clases del diseño de la tarjeta.
    const tarjeta: HTMLElement = elemento("tarjeta-carta-crisis");
    tarjeta.classList.remove("crisis-positiva");
    tarjeta.classList.remove("crisis-negativa");
    tarjeta.classList.remove("crisis-mixta");
    tarjeta.classList.add("crisis-" + carta.tipo.toLowerCase());
    mostrar("tarjeta-carta-crisis");
  }
}

/**
 * Pistas que ve el jugador antes de apostar:
 *   - Análisis predictivo: tendencia de la IA a PAR o IMPAR.
 *   - Chispa creativa (evento): la carta que la IA ha puesto boca abajo.
 */
export function pintarPistas(partida: Partida): void {
  const jugador: Jugador = partida.getJugador();
  const puede: boolean = partida.capacidadesPermitidas();

  if (jugador.tiene("analisis") && puede && !partida.hayEvento("sobrecarga")) {
    const consejo = partida.getConsejoAnalisis();
    escribir(
      "pista-analisis",
      "ANÁLISIS · Convergencia: " + consejo.convergencia + " · Rivalidad: " + consejo.rivalidad + "."
    );
    mostrar("pista-analisis");
  } else {
    ocultar("pista-analisis");
  }

  if (partida.hayEvento("chispa")) {
    escribir("pista-chispa", "CHISPA CREATIVA · la IA ha puesto un " + partida.getCartaIA() + ".");
    mostrar("pista-chispa");
  } else {
    ocultar("pista-chispa");
  }
}

/**
 * Pinta las cartas que la IA todavía no ha revelado en este ciclo.
 *
 * Es la información que convierte el juego en algo más que una moneda al
 * aire: sabiendo qué le queda a la IA, el jugador puede elegir su carta
 * para forzar que la suma salga par o impar.
 */
export function pintarCartasIA(partida: Partida): void {
  const contenedor: HTMLElement = elemento("lista-cartas-ia");
  contenedor.innerHTML = "";

  const porRevelar: number[] = partida.getCartasIAPorRevelar();
  for (let i = 0; i < porRevelar.length; i++) {
    const ficha: HTMLSpanElement = document.createElement("span");
    ficha.className = "carta-pequena";
    ficha.textContent = String(porRevelar[i]);
    contenedor.appendChild(ficha);
  }

  // Con Empatía y el planeta en peligro, la IA enseña su carta.
  if (partida.iaJuegaACartasVistas()) {
    escribir(
      "carta-vista-ia",
      "EMPATÍA · la IA juega a cartas vistas: ha puesto un " + partida.getCartaIA() + "."
    );
    mostrar("carta-vista-ia");
  } else {
    ocultar("carta-vista-ia");
  }
}

/**
 * Escribe la apuesta que ha cantado la IA y recuerda al jugador qué pasa
 * según se alinee con ella o la desafíe. Es la decisión de la ronda, así
 * que va en grande y con las consecuencias delante.
 */
export function pintarDeclaracionIA(partida: Partida): void {
  const declarada: Apuesta = partida.getApuestaDeclaradaIA();
  escribir("apuesta-declarada", declarada);

  const contraria: string = declarada === "PAR" ? "IMPAR" : "PAR";
  escribir(
    "consecuencia-apuesta",
    "Si apuestas " + declarada + " buscas la CONVERGENCIA: o acertáis los dos y " +
      "el planeta sana, o falláis los dos y el planeta cae. Si apuestas " +
      contraria + " fuerzas un DUELO: acierta uno solo, seguro, y ese conquista " +
      "una capacidad."
  );
}

/** Panel lateral de la capacidad Memoria: últimas tres jugadas de la IA. */
export function pintarMemoria(partida: Partida): void {
  const jugador: Jugador = partida.getJugador();
  if (!jugador.tiene("memoria") || !partida.capacidadesPermitidas()) {
    ocultar("panel-memoria");
    return;
  }

  const cartas: number[] = partida.getIA().getHistorialCartas();
  const apuestas: Apuesta[] = partida.getIA().getHistorialApuestas();
  const lista: HTMLElement = elemento("lista-memoria");
  lista.innerHTML = "";

  let desde: number = cartas.length - 3;
  if (desde < 0) {
    desde = 0;
  }
  for (let i = desde; i < cartas.length; i++) {
    const linea: HTMLLIElement = document.createElement("li");
    linea.textContent = "Ronda " + (i + 1) + ": carta " + cartas[i] + " · " + apuestas[i];
    lista.appendChild(linea);
  }
  if (cartas.length === 0) {
    const vacio: HTMLLIElement = document.createElement("li");
    vacio.textContent = "Sin jugadas todavía";
    lista.appendChild(vacio);
  }
  mostrar("panel-memoria");
}

/**
 * Pinta la mano de cartas del jugador.
 *
 * Recibe la función que hay que ejecutar al pulsar una carta: así este
 * archivo no necesita saber qué pasa después, solo avisa de que se ha
 * pulsado. Las cartas ya jugadas aparecen descartadas y no se pueden pulsar.
 */
export function pintarMano(
  jugador: Jugador,
  seleccionadas: number[],
  alPulsar: (valor: number) => void
): void {
  const contenedor: HTMLElement = elemento("mano-cartas");
  contenedor.innerHTML = "";

  const mano: Carta[] = jugador.getMano();
  for (let i = 0; i < mano.length; i++) {
    const carta: Carta = mano[i];
    const boton: HTMLButtonElement = document.createElement("button");
    boton.textContent = String(carta.getValor());
    boton.className = "carta-mano";

    if (!carta.estaDisponible()) {
      boton.classList.add("descartada");
      boton.disabled = true;
    }
    for (let j = 0; j < seleccionadas.length; j++) {
      if (seleccionadas[j] === carta.getValor()) {
        boton.classList.add("seleccionada");
      }
    }

    const valor: number = carta.getValor();
    boton.addEventListener("click", function () {
      alPulsar(valor);
    });

    contenedor.appendChild(boton);
  }
}

/** Marca visualmente qué botón de apuesta ha elegido el jugador. */
export function pintarApuestaElegida(apuesta: Apuesta | null): void {
  elemento("btn-apuesta-par").classList.remove("seleccionada");
  elemento("btn-apuesta-impar").classList.remove("seleccionada");
  if (apuesta === "PAR") {
    elemento("btn-apuesta-par").classList.add("seleccionada");
  }
  if (apuesta === "IMPAR") {
    elemento("btn-apuesta-impar").classList.add("seleccionada");
  }
}

// ---- Resolución de la ronda ------------------------------------------------

/** Muestra las cartas reveladas, la suma y qué ha pasado. */
export function pintarResolucion(resumen: ResumenRonda): void {
  // Debajo de cada carta va LA APUESTA de cada uno, y debajo de la suma el
  // resultado real. Se escribe la frase entera para que no se confundan:
  // el "IMPAR" de tu carta es lo que apostaste, no la paridad de la carta.
  escribir("valor-carta-jugador", String(resumen.cartaJugador));
  escribir("apuesta-jugador", "apostaste " + resumen.apuestaJugador);
  escribir("valor-carta-ia", String(resumen.cartaIA));
  escribir("apuesta-ia", "apostó " + resumen.apuestaIA);
  escribir("valor-suma", String(resumen.suma));
  escribir("resultado-paridad", "la suma es " + resumen.paridad);

  escribir("resultado-ronda", resumen.resultado);
  elemento("resultado-ronda").className =
    "resultado-ronda resultado-" + resumen.resultado.toLowerCase();

  escribir("detalle-ronda", construirDetalle(resumen));
  mostrar("zona-resolucion");
}

/** Construye la frase que explica los puntos repartidos en la ronda. */
function construirDetalle(resumen: ResumenRonda): string {
  let detalle: string = resumen.explicacion;

  if (resumen.intuicionIA) {
    detalle =
      "INTUICIÓN · la IA te ha leído y ha cambiado su apuesta a última hora. " + detalle;
  }

  if (resumen.puntosJugador > 0) {
    detalle = detalle + " Ganas " + resumen.puntosJugador + " puntos de evolución.";
  }
  if (resumen.puntosIA > 0) {
    detalle = detalle + " La IA gana " + resumen.puntosIA + " puntos de evolución.";
  }
  if (resumen.puntosPlaneta > 0) {
    detalle = detalle + " El planeta recupera " + resumen.puntosPlaneta + " puntos.";
  }
  if (resumen.puntosPlaneta < 0) {
    detalle = detalle + " El planeta pierde " + Math.abs(resumen.puntosPlaneta) + " puntos.";
  }
  if (resumen.capacidadConquistada !== "") {
    if (resumen.ganador === "HUMANO") {
      detalle = detalle + " Has conquistado: " + resumen.capacidadConquistada + ".";
    } else {
      detalle = detalle + " La IA te ha conquistado: " + resumen.capacidadConquistada + ".";
    }
  }
  return detalle;
}

export function ocultarResolucion(): void {
  ocultar("zona-resolucion");
  escribir("valor-carta-jugador", "?");
  escribir("valor-carta-ia", "?");
  escribir("valor-suma", "?");
  escribir("resultado-paridad", "—");
  escribir("apuesta-jugador", "—");
  escribir("apuesta-ia", "—");
}

/** Muestra la tarjeta superpuesta de un evento especial. */
export function mostrarEvento(nombre: string, descripcion: string): void {
  escribir("nombre-evento", nombre);
  escribir("descripcion-evento", descripcion);
  mostrar("superposicion-evento");
}

export function ocultarEvento(): void {
  ocultar("superposicion-evento");
}

// ---- Pantallas de inicio y final --------------------------------------------

/** Enseña en la pantalla de inicio la mejor marca guardada, si existe. */
export function pintarMejorMarca(): void {
  const marca: MejorMarca | null = leerMejorMarca();
  if (marca === null) {
    escribir("mejor-marca", "Todavía no has jugado ninguna partida en este navegador.");
    return;
  }
  escribir(
    "mejor-marca",
    "Mejor marca · " + marca.nombre + " — " + marca.perfil + " (evolución " +
      marca.evolucion + ", planeta " + marca.planeta + ")"
  );
}

/** Rellena toda la pantalla final con el desenlace y el perfil. */
export function pintarFinal(partida: Partida, resumen: ResumenFinal): void {
  escribir("titulo-desenlace", resumen.desenlace);
  elemento("titulo-desenlace").className =
    "final-desenlace final-" + resumen.desenlace.toLowerCase().replace(" ", "-");
  escribir("mensaje-desenlace", resumen.mensaje);

  escribir("nombre-perfil", resumen.perfil.nombre);
  escribir("descripcion-perfil", resumen.perfil.descripcion);

  escribir("final-evo-humano", String(resumen.evolucionJugador));
  escribir("final-evo-ia", String(resumen.evolucionIA));
  escribir("final-planeta", resumen.saludPlaneta + " / " + SALUD_MAXIMA);
  escribir("final-rondas", String(resumen.rondasJugadas));
  // El diseño reparte el porcentaje en dos textos y una barra.
  escribir("texto-porcentaje-humano", resumen.porcentajeJugador + "%");
  escribir("texto-porcentaje-ia", resumen.porcentajeIA + "%");
  elemento("barra-porcentaje-humano").style.width = resumen.porcentajeJugador + "%";

  pintarCapacidades("lista-capacidades", partida.getJugador().getCapacidades());
  pintarCapacidades("lista-capacidades-ia", partida.getIA().getCapacidades());

  const perfiles: string[] = leerPerfiles();
  const total: number = PERFILES.length;
  let texto: string = "Ninguno todavía";
  if (perfiles.length > 0) {
    texto = perfiles.join(" · ");
  }
  escribir("coleccion-perfiles", texto + "  (" + perfiles.length + " desbloqueados de " + total + ")");
}
