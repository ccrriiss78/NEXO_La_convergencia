import { Partida } from "./Partida.js";
import { Jugador } from "./Jugador.js";
import { Apuesta, ResumenFinal, ResumenRonda } from "./tipos.js";
import { guardarMejorMarca, guardarPerfil } from "./almacenamiento.js";
import {
  elemento,
  escribir,
  mostrar,
  mostrarEvento,
  mostrarPantalla,
  ocultar,
  ocultarEvento,
  ocultarResolucion,
  pintarApuestaElegida,
  pintarCabeceraRonda,
  pintarCapacidades,
  pintarCartasIA,
  pintarDeclaracionIA,
  pintarEvolucionVisual,
  pintarFinal,
  pintarMano,
  pintarMarcadores,
  pintarMejorMarca,
  pintarMemoria,
  pintarPistas,
  pintarResolucion
} from "./interfaz.js";

/**
 * El archivo que arranca el juego y conecta los clicks con la lógica.
 *
 * Aquí no hay reglas del juego: cuando el jugador pulsa un botón, este
 * archivo se lo cuenta a la clase Partida y luego le pide a interfaz.ts
 * que repinte la pantalla. Es el "director de orquesta".
 */

/**
 * Fases por las que pasa una ronda. Tener una variable con la fase evita
 * el lío de comprobar diez condiciones para saber qué se puede pulsar.
 */
type FaseRonda = "apuesta" | "carta" | "confirmada" | "velocidad" | "resuelta";

let partida: Partida | null = null;
let fase: FaseRonda = "apuesta";
let apuestaElegida: Apuesta | null = null;
let cartasSeleccionadas: number[] = [];
let cartaConfirmadaPrecision: number | null = null;
let mejorCartaVelocidad: number | null = null;

// Configuración elegida en la pantalla previa a la partida.
let avatarElegido: string = "explorador";
let rondasElegidas: number = 12;

// ---- Arranque ------------------------------------------------------------

/** Conecta todos los botones de la página. Se ejecuta una sola vez. */
function iniciar(): void {
  elemento("btn-jugar").addEventListener("click", function () {
    mostrarPantalla("pantalla-introduccion");
  });

  elemento("btn-ir-configuracion").addEventListener("click", function () {
    mostrarPantalla("pantalla-configuracion");
  });

  // Botones de navegacion que añade el diseño: saltar la introduccion,
  // volver atras y abrir o cerrar la ventana de ajustes.
  elemento("btn-saltar-intro").addEventListener("click", function () {
    mostrarPantalla("pantalla-configuracion");
  });

  elemento("btn-intro-atras").addEventListener("click", function () {
    mostrarPantalla("pantalla-inicio");
  });

  elemento("btn-ajustes").addEventListener("click", function () {
    mostrar("superposicion-ajustes");
  });

  elemento("btn-cerrar-ajustes").addEventListener("click", function () {
    ocultar("superposicion-ajustes");
  });

  elemento("btn-iniciar-partida").addEventListener("click", empezarPartida);

  elemento("btn-apuesta-par").addEventListener("click", function () {
    elegirApuesta("PAR");
  });
  elemento("btn-apuesta-impar").addEventListener("click", function () {
    elegirApuesta("IMPAR");
  });

  elemento("btn-confirmar-jugada").addEventListener("click", confirmar);
  elemento("btn-precision-mantener").addEventListener("click", mantenerCartaPrecision);
  elemento("btn-precision-corregir").addEventListener("click", corregirCartaPrecision);
  elemento("btn-velocidad-aplicar").addEventListener("click", aplicarVelocidad);
  elemento("btn-siguiente").addEventListener("click", siguiente);
  elemento("btn-cerrar-evento").addEventListener("click", ocultarEvento);

  elemento("btn-abandonar").addEventListener("click", function () {
    if (partida !== null) {
      partida.abandonar();
      terminarPartida();
    }
  });

  elemento("btn-volver-jugar").addEventListener("click", function () {
    partida = null;
    pintarMejorMarca();
    mostrarPantalla("pantalla-inicio");
  });

  prepararOpcionesConfig();
  pintarMejorMarca();
  mostrarPantalla("pantalla-inicio");
}

/** Botones de avatar y de número de rondas de la pantalla de configuración. */
function prepararOpcionesConfig(): void {
  // El avatar se elige con botones de radio: uno para el aspecto humano y
  // otro para el de la IA. Solo nos quedamos con el humano, que es el que
  // cambia el aspecto del jugador en la pantalla de juego.
  const avatares = document.querySelectorAll("input[name=\"avatar-humano\"]");
  for (let i = 0; i < avatares.length; i++) {
    const opcion: HTMLInputElement = avatares[i] as HTMLInputElement;
    opcion.addEventListener("change", function () {
      avatarElegido = opcion.value;
    });
    if (opcion.checked) {
      avatarElegido = opcion.value;
    }
  }

  // Las rondas son botones con data-rondas. El diseño marca el elegido con
  // la clase "boton-opcion-activa" y con aria-pressed, para los lectores.
  const rondas = document.querySelectorAll("[data-rondas]");
  for (let i = 0; i < rondas.length; i++) {
    const boton: HTMLElement = rondas[i] as HTMLElement;
    boton.addEventListener("click", function () {
      for (let j = 0; j < rondas.length; j++) {
        rondas[j].classList.remove("boton-opcion-activa");
        rondas[j].setAttribute("aria-pressed", "false");
      }
      boton.classList.add("boton-opcion-activa");
      boton.setAttribute("aria-pressed", "true");
      rondasElegidas = Number(boton.dataset.rondas);
    });
  }
}

/** Crea la partida con la configuración elegida y lanza la primera ronda. */
function empezarPartida(): void {
  // El diseño no pide el nombre por teclado: el jugador es el operador del
  // protocolo y su nombre depende del avatar que haya elegido.
  let nombre: string = "NEXO 01";
  if (avatarElegido === "humano-mujer") {
    nombre = "NEXO 02";
  }

  partida = new Partida(nombre, avatarElegido, rondasElegidas);
  escribir("nombre-humano", nombre);
  mostrarPantalla("pantalla-juego");
  nuevaRonda();
}

// ---- Ciclo de la ronda ----------------------------------------------------

/** Prepara la ronda siguiente y deja la pantalla lista para apostar. */
function nuevaRonda(): void {
  if (partida === null) {
    return;
  }

  partida.prepararRonda();

  fase = "apuesta";
  apuestaElegida = null;
  cartasSeleccionadas = [];
  cartaConfirmadaPrecision = null;
  mejorCartaVelocidad = null;

  ocultarResolucion();
  ocultar("zona-velocidad");
  ocultar("panel-precision");
  ocultar("btn-siguiente");
  mostrar("zona-apuesta");
  mostrar("zona-mano");
  escribir("btn-confirmar-jugada", "RESOLVER RONDA");
  mostrar("btn-confirmar-jugada");
  (elemento("btn-confirmar-jugada") as HTMLButtonElement).disabled = true;
  elemento("pantalla-juego").classList.remove("precision-modo-correccion");

  pintarApuestaElegida(null);
  refrescarPantalla();
  escribir("instruccion-mano", textoInstruccionMano());

  const evento = partida.getEventoActivo();
  if (evento !== null) {
    mostrarEvento(evento.getNombre(), evento.getDescripcion());
  }
}

/** Repinta todo lo que puede haber cambiado: marcadores, avatares, mano... */
function refrescarPantalla(): void {
  if (partida === null) {
    return;
  }
  pintarMarcadores(partida);
  pintarEvolucionVisual(partida);
  pintarCabeceraRonda(partida);
  pintarCartasIA(partida);
  pintarDeclaracionIA(partida);
  pintarPistas(partida);
  pintarMemoria(partida);
  pintarCapacidades("capacidades-humano", partida.getJugador().getCapacidades());
  pintarCapacidades("capacidades-ia", partida.getIA().getCapacidades());
  pintarMano(partida.getJugador(), cartasSeleccionadas, pulsarCarta);
}

/** Texto de ayuda de la mano, distinto si el poder Velocidad está activo. */
function textoInstruccionMano(): string {
  if (velocidadDisponible()) {
    return "VELOCIDAD: elige DOS cartas (las dos se descartan)";
  }
  return "Tu carta";
}

/**
 * Indica si esta ronda se puede usar el poder Velocidad: hay que tenerlo,
 * que no haya Tormenta solar y que queden al menos dos cartas en la mano.
 */
function velocidadDisponible(): boolean {
  if (partida === null) {
    return false;
  }
  const jugador: Jugador = partida.getJugador();
  return (
    jugador.tiene("velocidad") &&
    partida.capacidadesPermitidas() &&
    jugador.getCartasDisponibles().length >= 2
  );
}

/**
 * El jugador declara PAR o IMPAR. Se puede hacer antes o después de elegir
 * la carta: para calcular bien hay que poder decidir las dos cosas juntas,
 * mirando lo que le queda a la IA.
 */
function elegirApuesta(apuesta: Apuesta): void {
  if (fase !== "apuesta" && fase !== "carta") {
    return;
  }
  apuestaElegida = apuesta;
  pintarApuestaElegida(apuesta);
  actualizarBotonConfirmar();
}

/** El jugador pulsa una carta de su mano. */
function pulsarCarta(valor: number): void {
  if (partida === null || (fase !== "apuesta" && fase !== "carta")) {
    return;
  }
  fase = "carta";

  if (velocidadDisponible()) {
    // Con Velocidad se eligen dos cartas: la tercera pulsación empieza de cero.
    if (yaSeleccionada(valor)) {
      cartasSeleccionadas = quitarSeleccion(valor);
    } else if (cartasSeleccionadas.length < 2) {
      cartasSeleccionadas.push(valor);
    } else {
      cartasSeleccionadas = [valor];
    }
  } else {
    cartasSeleccionadas = [valor];
  }

  pintarMano(partida.getJugador(), cartasSeleccionadas, pulsarCarta);
  actualizarBotonConfirmar();
}

function yaSeleccionada(valor: number): boolean {
  for (let i = 0; i < cartasSeleccionadas.length; i++) {
    if (cartasSeleccionadas[i] === valor) {
      return true;
    }
  }
  return false;
}

function quitarSeleccion(valor: number): number[] {
  const restantes: number[] = [];
  for (let i = 0; i < cartasSeleccionadas.length; i++) {
    if (cartasSeleccionadas[i] !== valor) {
      restantes.push(cartasSeleccionadas[i]);
    }
  }
  return restantes;
}

/** Habilita el botón de confirmar solo cuando la jugada está completa. */
function actualizarBotonConfirmar(): void {
  const boton: HTMLButtonElement = elemento("btn-confirmar-jugada") as HTMLButtonElement;
  const necesarias: number = velocidadDisponible() ? 2 : 1;
  const jugadaIncompleta: boolean = apuestaElegida === null || cartasSeleccionadas.length < necesarias;
  const jugadaCompleta: boolean = !jugadaIncompleta;
  const puedeUsarPrecision: boolean =
    partida !== null &&
    jugadaCompleta &&
    partida.getJugador().puedeUsarPrecision() &&
    partida.capacidadesPermitidas() &&
    !velocidadDisponible();

  boton.disabled = jugadaIncompleta;
  boton.textContent = puedeUsarPrecision ? "ACTIVAR PRECISIÓN" : "RESOLVER RONDA";
}

/**
 * Botón CONFIRMAR. Si el jugador tiene Precisión sin gastar, la jugada se
 * queda "confirmada" y todavía puede cambiar la carta; si no, se revela.
 */
function confirmar(): void {
  if (partida === null) {
    return;
  }

  if (fase === "carta") {
    const jugador: Jugador = partida.getJugador();
    const puedeUsarPrecision: boolean =
      jugador.puedeUsarPrecision() && partida.capacidadesPermitidas() && !velocidadDisponible();

    if (puedeUsarPrecision && activarPrecision()) {
      return;
    }
    revelar();
    return;
  }

  if (fase === "confirmada") {
    revelar();
  }
}

/** Activa Precisión: revela y fija la carta real de la IA antes de resolver. */
function activarPrecision(): boolean {
  if (partida === null || cartasSeleccionadas.length !== 1) {
    return false;
  }

  cartaConfirmadaPrecision = cartasSeleccionadas[0];
  const cartaIA: number = partida.fijarCartaIAParaPrecision(cartaConfirmadaPrecision);
  partida.getJugador().gastarPrecision();

  escribir("precision-carta-ia", String(cartaIA));
  escribir("precision-carta-humano", String(cartaConfirmadaPrecision));
  escribir("precision-texto-mantener", "MANTENER " + cartaConfirmadaPrecision);
  const imagen: HTMLImageElement = elemento("precision-imagen-carta-ia") as HTMLImageElement;
  imagen.src = "./assets/images/partida/cartas/ia/carta-ia-" + cartaIA + ".webp";
  imagen.alt = "Carta " + cartaIA + " seleccionada por la IA";

  fase = "confirmada";
  ocultar("btn-confirmar-jugada");
  mostrar("panel-precision");
  elemento("pantalla-juego").classList.add("precision-modo-correccion");
  return true;
}

/** Mantiene la carta confirmada tras usar Precisión. */
function mantenerCartaPrecision(): void {
  if (cartaConfirmadaPrecision === null) {
    return;
  }
  ocultar("panel-precision");
  elemento("pantalla-juego").classList.remove("precision-modo-correccion");
  resolverConCarta(cartaConfirmadaPrecision);
}

/** Permite elegir otra carta tras ver la carta fijada por Precisión. */
function corregirCartaPrecision(): void {
  if (partida === null) {
    return;
  }
  cartasSeleccionadas = [];
  fase = "carta";
  ocultar("panel-precision");
  mostrar("btn-confirmar-jugada");
  elemento("pantalla-juego").classList.add("precision-modo-correccion");
  escribir("btn-confirmar-jugada", "RESOLVER RONDA");
  escribir("instruccion-mano", "PRECISIÓN usada: elige otra carta");
  pintarMano(partida.getJugador(), cartasSeleccionadas, pulsarCarta);
  actualizarBotonConfirmar();
}

/**
 * Revela la jugada. Sin Velocidad se resuelve directamente; con Velocidad
 * se descartan las dos cartas y el jugador elige con qué resultado se queda.
 */
function revelar(): void {
  if (partida === null || apuestaElegida === null) {
    return;
  }

  ocultar("btn-confirmar-jugada");

  if (cartasSeleccionadas.length === 2) {
    const jugador: Jugador = partida.getJugador();
    jugador.jugarCarta(cartasSeleccionadas[0]);
    jugador.jugarCarta(cartasSeleccionadas[1]);
    prepararVelocidad(cartasSeleccionadas[0], cartasSeleccionadas[1]);
    return;
  }

  resolverConCarta(cartasSeleccionadas[0]);
}

/** Muestra los dos resultados posibles del poder Velocidad. */
function prepararVelocidad(cartaA: number, cartaB: number): void {
  if (partida === null || apuestaElegida === null) {
    return;
  }
  fase = "velocidad";

  const resultadoA = partida.previsualizarResultado(cartaA, apuestaElegida);
  const resultadoB = partida.previsualizarResultado(cartaB, apuestaElegida);
  const ventajaA: number = resultadoA.puntosJugador - resultadoA.puntosIA + resultadoA.puntosPlaneta;
  const ventajaB: number = resultadoB.puntosJugador - resultadoB.puntosIA + resultadoB.puntosPlaneta;
  mejorCartaVelocidad = ventajaB > ventajaA ? cartaB : cartaA;

  escribir("resultado-veloz-a", describirVelocidad(cartaA, resultadoA.suma, resultadoA.paridad, resultadoA.ganador));
  escribir("resultado-veloz-b", describirVelocidad(cartaB, resultadoB.suma, resultadoB.paridad, resultadoB.ganador));
  escribir("velocidad-eleccion-nexo", "NEXO aplicará la carta " + mejorCartaVelocidad + " porque deja el mejor balance para el Humano.");
  mostrar("zona-velocidad");
}

function describirVelocidad(carta: number, suma: number, paridad: Apuesta, ganador: string): string {
  return "Carta " + carta + " · suma " + suma + " (" + paridad + ") · " + ganador;
}

function aplicarVelocidad(): void {
  if (mejorCartaVelocidad === null) {
    return;
  }
  ocultar("zona-velocidad");
  resolverConCarta(mejorCartaVelocidad, true);
}

/** Resuelve la ronda con la carta elegida y pinta el resultado. */
function resolverConCarta(carta: number, cartaYaDescartada: boolean = false): void {
  if (partida === null || apuestaElegida === null) {
    return;
  }

  if (!cartaYaDescartada) {
    partida.getJugador().jugarCarta(carta);
  }
  const resumen: ResumenRonda = partida.resolverRonda(carta, apuestaElegida);

  fase = "resuelta";
  elemento("pantalla-juego").classList.remove("precision-modo-correccion");
  ocultar("zona-apuesta");
  ocultar("zona-mano");
  refrescarPantalla();
  pintarResolucionYSiguiente(resumen);
}

/** Pinta la resolución y prepara el botón de continuar. */
function pintarResolucionYSiguiente(resumen: ResumenRonda): void {
  if (partida === null) {
    return;
  }
  pintarResolucion(resumen);

  if (partida.estaTerminada()) {
    escribir("btn-siguiente", "VER RESULTADO FINAL");
  } else {
    escribir("btn-siguiente", "SIGUIENTE RONDA");
  }
  mostrar("btn-siguiente");
}

/** Botón de continuar: siguiente ronda o pantalla final. */
function siguiente(): void {
  if (partida === null) {
    return;
  }
  if (partida.estaTerminada()) {
    terminarPartida();
    return;
  }
  nuevaRonda();
}

/** Calcula el final, lo guarda en localStorage y enseña la pantalla final. */
function terminarPartida(): void {
  if (partida === null) {
    return;
  }
  const resumen: ResumenFinal = partida.calcularFinal();

  guardarPerfil(resumen.perfil.nombre);
  guardarMejorMarca(partida.getJugador().getNombre(), resumen);

  pintarFinal(partida, resumen);
  mostrarPantalla("pantalla-final");
}

// Arrancamos cuando el HTML ya está cargado, para que existan los elementos.
window.addEventListener("DOMContentLoaded", iniciar);
