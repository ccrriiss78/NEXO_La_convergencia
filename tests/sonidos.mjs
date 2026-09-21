import assert from "node:assert/strict";
import fs from "node:fs";

const sonidos = fs.readFileSync(new URL("../src/sonidos.ts", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const interfaz = fs.readFileSync(new URL("../src/interfaz.ts", import.meta.url), "utf8");
const suspense = fs.readFileSync(new URL("../src/suspense.ts", import.meta.url), "utf8");
const estilos = fs.readFileSync(new URL("../css/style.css", import.meta.url), "utf8");
const estilosMovil = fs.readFileSync(new URL("../css/movil.css", import.meta.url), "utf8");

assert.match(sonidos, /new Audio\(/);
assert.doesNotMatch(sonidos, /Math\.random\(\)/);
assert.match(sonidos, /nexo-sonido/);
assert.match(sonidos, /nexo-volumen/);
assert.doesNotMatch(sonidos, /AudioContext|GainNode|createGain|webkitAudioContext/);

const rutas = Array.from(sonidos.matchAll(/"(\.\/assets\/audio\/sfx\/[^"']+\.mp3)"/g));
const rutasUnicas = new Set(rutas.map(function (coincidencia) {
  return coincidencia[1];
}));
assert.equal(rutasUnicas.size, 18);
for (const coincidencia of rutas) {
  const rutaProyecto = "../" + coincidencia[1].slice(2);
  assert.equal(fs.existsSync(new URL(rutaProyecto, import.meta.url)), true, "Falta " + coincidencia[1]);
}

assert.match(main, /conectarSonidosInterfaz\(\)/);
assert.match(main, /reproducirFeedbackDeRonda\(resumen\)/);
assert.match(main, /reproducirEvento\(evento\.getId\(\)\)/);
assert.match(main, /reproducirCartaCrisis\(cartaCrisis\.tipo\)/);
assert.match(main, /actualizarVolumenEfectos\(volumenSonido\)/);
assert.match(main, /detenerEfectos\(\)/);

// Cada interacción reconocible tiene un único sonido fijo.
assert.match(sonidos, /boton\.classList\.contains\("boton-opcion"\)[\s\S]*reproducirSonido\("rondas"\)/);
assert.match(sonidos, /btn-apuesta-par[\s\S]*reproducirSonido\("apuesta"\)/);
assert.match(sonidos, /boton\.classList\.contains\("carta-mano"\)[\s\S]*reproducirSonido\("carta"\)/);
assert.match(sonidos, /closest\("\.tarjeta-avatar"\)[\s\S]*reproducirSonido\("avatar"\)/);
assert.match(sonidos, /esBotonPanel\(boton\.id\)[\s\S]*reproducirSonido\("panel"\)/);
assert.match(sonidos, /control\.id === "selector-jugadores"[\s\S]*reproducirSonido\("usuario"\)/);
assert.match(sonidos, /usuario: \{\s*ruta: "\.\/assets\/audio\/sfx\/ui\/clic-03\.mp3"/);
assert.match(sonidos, /audiosPreparados/);
assert.match(sonidos, /}, true\);/);
assert.match(sonidos, /function reproducirEvento[\s\S]*reproducirSonido\("eventoAlerta"\)/);
assert.match(sonidos, /function reproducirCartaCrisis[\s\S]*reproducirSonido\("cartaMixta"\)/);
assert.doesNotMatch(sonidos, /idEvento ===|tipo\.toLowerCase/);
assert.match(sonidos, /boton\.id === "btn-jugar"[\s\S]*boton\.id === "btn-iniciar-partida"[\s\S]*boton\.id === "btn-volver-jugar"[\s\S]*return;/);
assert.match(suspense, /if \(sonidoActivo\) \{[\s\S]*reproducirAudioInicio\(volumen\);/);
assert.doesNotMatch(suspense, /desbloquearAudioMovil|reproducirSonido/);
assert.doesNotMatch(suspense, /prepararAudioInicio/);
assert.doesNotMatch(suspense, /mostrarPantalla\("pantalla-inicio"\);\s*if \(sonidoActivo\) reproducirAudioInicio/);
assert.match(suspense, /function reproducirAudioInicio[\s\S]*audioInicio\.muted = false;[\s\S]*audioInicio\.play\(\)/);
assert.match(suspense, /function armarReintentoAudioInicio[\s\S]*pointerdown[\s\S]*touchend/);
assert.match(suspense, /addEventListener\("touchend", function \(\) \{\s*cercania = 0;\s*encima = false;\s*\}\);/);
assert.match(suspense, /addEventListener\("click", activarJuego\)/);
assert.match(suspense, /const DURACION_CICLO_AUDIO_INICIO = 11\.101995/);
assert.match(suspense, /audioInicio\.currentTime >= DURACION_CICLO_AUDIO_INICIO[\s\S]*audioInicio\.currentTime = 0/);
assert.doesNotMatch(main, /nexo-portada-visible/);
assert.doesNotMatch(main, /congelarPulsoPortada|addEventListener\("waiting"/);
assert.doesNotMatch(main, /audioInicio\.addEventListener\("playing", sincronizarPulsoPortada\)/);
assert.doesNotMatch(main, /audioInicio\.addEventListener\("seeked", sincronizarPulsoPortada\)/);
assert.doesNotMatch(main, /setTimeout\(sincronizarPulsoPortada, 700\)/);
assert.match(sonidos, /if \(audioMovilDesbloqueado\) return;/);
assert.match(sonidos, /const musicaGlobal = new Audio\(\)/);
assert.match(sonidos, /const audioEfectos = new Audio\(\)/);
assert.match(sonidos, /const pistas: HTMLAudioElement\[\] = \[musicaGlobal, audioEfectos\]/);
assert.match(main, /pantalla-suspense[\s\S]*desbloquearAudioMovil\(\)/);
assert.match(main, /conectarBotonApuesta[\s\S]*pointerdown[\s\S]*pointerType === "touch"[\s\S]*elegirApuesta\(apuesta\)/);
assert.match(main, /function prepararRescateControlesIPad[\s\S]*pointerdown[\s\S]*pointerType[\s\S]*maxTouchPoints[\s\S]*getBoundingClientRect[\s\S]*elegirApuesta/);
assert.match(main, /botonResolver\.disabled[\s\S]*cajaResolver[\s\S]*dentroResolver[\s\S]*confirmar\(\)/);
assert.match(main, /botonSiguiente\.disabled[\s\S]*cajaSiguiente[\s\S]*dentroSiguiente[\s\S]*preventDefault\(\)[\s\S]*siguiente\(\)/);
assert.match(main, /pointerdown[\s\S]*capture: true/);
const reinicioDesplazamientoPartida = main.match(/function reiniciarDesplazamientoPartida[\s\S]*?^}/m)?.[0] || "";
assert.match(reinicioDesplazamientoPartida, /requestAnimationFrame\(llevarAlInicio\)/);
assert.doesNotMatch(reinicioDesplazamientoPartida, /setTimeout\(llevarAlInicio/);

// La pista aprobada de portada conserva su ruta, bucle y objeto Audio normal.
assert.match(suspense, /new Audio\("\.\/assets\/audio\/inicio\/ambos-nexo\.mp3\?v=audio-inicio-v24-38"\)/);
assert.match(suspense, /audioInicio\.loop = true/);
assert.match(suspense, /const REFUERZO_AUDIO_INICIO = 2\.0/);
// El primer gesto se reserva a la música: otro Audio simultáneo puede
// apropiarse de la activación multimedia de Safari en iPhone.
assert.doesNotMatch(suspense, /reproducirSonido\("confirmar"\)/);

// La animación se activa al mostrar la portada, sin esperar eventos del MP3.
// Esto evita el retraso de un ciclo completo observado en Safari de iPad.
assert.match(interfaz, /idPantalla === "pantalla-inicio"[\s\S]*classList\.add\("animacion-portada-activa"\)/);
assert.match(interfaz, /ajustarFaseAnimacionPortada[\s\S]*--desfase-pulso-audio[\s\S]*--desfase-descarga-audio/);
assert.match(interfaz, /function ocultarResolucion[\s\S]*hidden = true[\s\S]*setAttribute\("inert"[\s\S]*pointer-events[\s\S]*none/);
assert.match(interfaz, /temporizadorPanelResultado = window\.setTimeout[\s\S]*hidden = false[\s\S]*removeAttribute\("inert"[\s\S]*removeProperty\("pointer-events"\)/);
assert.match(interfaz, /function ocultarEvento[\s\S]*\.blur\(\)[\s\S]*hidden = true[\s\S]*setAttribute\("inert"[\s\S]*display[\s\S]*pointer-events[\s\S]*offsetWidth/);
assert.match(interfaz, /function mostrarEvento[\s\S]*hidden = false[\s\S]*removeAttribute\("inert"[\s\S]*removeProperty\("display"\)[\s\S]*removeProperty\("pointer-events"\)/);
assert.match(suspense, /mostrarPantalla\("pantalla-inicio", audioInicio\.currentTime\)/);
assert.match(suspense, /sincronizarAnimacionPortadaCuandoAvance[\s\S]*audioInicio\.currentTime > tiempoInicial \+ 0\.012[\s\S]*ajustarFaseAnimacionPortada\(audioInicio\.currentTime\)/);
assert.doesNotMatch(main, /sincronizarPulsoPortada/);
assert.match(estilos, /logo-nexo-animado\.animacion-portada-activa::before[\s\S]*animation-name: nexo-x-base-latido-humano-v14/);
assert.match(estilos, /animation-delay: var\(--desfase-pulso-audio\)/);
assert.match(estilos, /@keyframes nexo-x-base-latido-humano-v14/);
assert.match(estilos, /@keyframes nexo-nodos-descarga-tecnologica-v14/);
assert.match(estilos, /animation-duration: 1\.009272s/);
assert.match(estilos, /animation-duration: 11\.101995s/);
assert.match(estilos, /Destellos medidos: 0,980 · 3,780 · 4,540 · 7,040 s/);

// En móvil horizontal los controles principales permanecen dentro de su caja
// y la corrección de Precisión deja accesibles las cartas y la confirmación.
assert.match(estilosMovil, /btn-ir-configuracion\.ultimo-paso::after[\s\S]*inset: 24% 13%/);
assert.match(estilosMovil, /carta-mano\.seleccionada:hover:not\(:disabled\):not\(\.descartada\)[\s\S]*translateY\(0\) scale\(1\.025\)/);
assert.match(estilosMovil, /precision-correccion-activa #zona-declaraciones[\s\S]*display: none/);
assert.match(estilosMovil, /precision-correccion-activa #panel-precision:not\(\.oculta\)[\s\S]*position: relative[\s\S]*height: 58px/);
assert.match(estilosMovil, /precision-decision-activa #panel-precision:not\(\.oculta\)[\s\S]*grid-template-rows:[\s\S]*precision-decision-activa #panel-precision \.precision-acciones[\s\S]*grid-template-columns/);

// En alturas habituales de portátil/escritorio, el cierre reserva espacio al
// botón final y no centra verticalmente un bloque que podría desbordarse.
assert.match(estilos, /min-height:821px\) and \(max-height:980px\)[\s\S]*align-content:start/);
assert.match(estilos, /#pantalla-final \.boton-final-nexo\{\s*min-height:46px;\s*max-height:50px;/);

// Toda la música larga reutiliza un canal y los efectos conservan otro canal.
assert.match(sonidos, /const musicaPartida = musicaGlobal/);
assert.match(sonidos, /musicaGlobal\.loop = true/);
assert.match(sonidos, /const audioEfectos = new Audio\(\)/);
assert.match(sonidos, /const VOLUMEN_BASE_MUSICA_PARTIDA = 0\.18/);
assert.match(sonidos, /musicaPartida\.volume = empiezaDesdeElPrincipio \? 0 : volumenObjetivoMusicaPartida/);
assert.match(sonidos, /const REFUERZO_MEZCLA_AUDIO = 2\.2/);
assert.match(sonidos, /Math\.min\(1, volumenBase \* volumenGeneral \* REFUERZO_MEZCLA_AUDIO\)/);
assert.match(main, /mostrarPantalla\("pantalla-juego"\);[\s\S]*?window\.scrollTo\(0, 0\);[\s\S]*?reproducirMusicaPartidaSiCorresponde\(\);/);
assert.match(main, /actualizarVolumenMusicaPartida\(volumenSonido\)/);
assert.match(main, /pausarMusicaPartida\(true\);\s*pausarMusicaPlanetaRestaurado\(true\);\s*pausarMusicaEquilibrioRestablecido\(true\);\s*pausarMusicaPlanetaColapso\(true\);\s*mostrarPantalla\("pantalla-final"\);/);

// Introducción y Configuración comparten el canal musical sin reiniciarlo.
assert.match(sonidos, /const RUTA_MUSICA_INTRO_CONFIG = "\.\/assets\/audio\/musica\/introduccion-configuracion\.mp3"/);
assert.match(sonidos, /const musicaIntroduccionConfiguracion = musicaGlobal/);
assert.match(sonidos, /const VOLUMEN_BASE_MUSICA_INTRO_CONFIG = 0\.22/);
assert.match(sonidos, /const INICIO_MUSICA_INTRO_CONFIG = 4/);
assert.match(sonidos, /const PASOS_ENTRADA_MUSICA_INTRO_CONFIG = 5/);
assert.match(sonidos, /const PASOS_FUNDIDO_MUSICA = 20/);
assert.match(sonidos, /musicaIntroduccionConfiguracion\.currentTime = INICIO_MUSICA_INTRO_CONFIG/);
assert.match(main, /mostrarPantalla\("pantalla-introduccion"\);\s*reproducirMusicaIntroduccionConfiguracionSiCorresponde\(\);/);
assert.match(main, /btn-jugar[\s\S]*pausarAudioInicio\(\);[\s\S]*mostrarPantalla\("pantalla-introduccion"\);/);
assert.match(main, /btn-jugar[\s\S]*addEventListener\("pointerdown"[\s\S]*pausarAudioInicio\(\);\s*desbloquearAudioMovil\(\);/);
assert.match(sonidos, /const pistas: HTMLAudioElement\[\] = \[musicaGlobal, audioEfectos\][\s\S]*if \(!pista\.muted\) return;[\s\S]*pista\.pause\(\)/);
assert.match(main, /pausarAudioInicio\(\);\s*pausarMusicaIntroduccionConfiguracion\(true\);[\s\S]*?mostrarPantalla\("pantalla-juego"\);/);
const funcionAbrirConfiguracion = main.match(/function abrirConfiguracion\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.doesNotMatch(funcionAbrirConfiguracion, /pausarMusicaIntroduccionConfiguracion|reproducirMusicaIntroduccionConfiguracion/);

// PLANETA RESTAURADO usa el canal común para 1–40% de Crisis.
assert.match(sonidos, /const RUTA_MUSICA_PLANETA_RESTAURADO = "\.\/assets\/audio\/final\/planeta-restaurado\.mp3"/);
assert.match(sonidos, /const musicaPlanetaRestaurado = musicaGlobal/);
assert.match(sonidos, /const VOLUMEN_BASE_PLANETA_RESTAURADO = 0\.22/);
assert.match(sonidos, /const CRISIS_MINIMA_PLANETA_RESTAURADO = 1/);
assert.match(sonidos, /const CRISIS_MAXIMA_PLANETA_RESTAURADO = 40/);
assert.match(sonidos, /function correspondeMusicaPlanetaRestaurado[\s\S]*const crisisPlaneta = 100 - saludPlaneta;[\s\S]*crisisPlaneta >= CRISIS_MINIMA_PLANETA_RESTAURADO[\s\S]*crisisPlaneta <= CRISIS_MAXIMA_PLANETA_RESTAURADO/);
assert.match(main, /const crisisPlaneta = 100 - saludPlaneta;[\s\S]*else if \(crisisPlaneta <= 40\) \{\s*reproducirMusicaPlanetaRestaurado\(volumenSonido\);\s*\}\s*else \{\s*reproducirMusicaRivalidadFinal\(volumenSonido\);/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaPlanetaRestaurado\(true\);[\s\S]*partida = null/);
assert.match(main, /reproducirMusicaFinalSiCorresponde\(\)/);
assert.match(main, /pausarMusicaIntroduccionConfiguracion\(\);[\s\S]*pausarMusicaPlanetaRestaurado\(\);\s*pausarMusicaEquilibrioRestablecido\(\);\s*pausarMusicaPlanetaColapso\(\);\s*pausarMusicaRivalidadFinal\(\);\s*detenerEfectos\(\);/);
assert.match(main, /actualizarVolumenMusicaPlanetaRestaurado\(volumenSonido\)/);

// EQUILIBRIO RESTABLECIDO es la música exclusiva del 0% de Crisis.
assert.match(sonidos, /const RUTA_MUSICA_EQUILIBRIO_RESTABLECIDO = "\.\/assets\/audio\/final\/equilibrio-restablecido\.mp3"/);
assert.match(sonidos, /const musicaEquilibrioRestablecido = musicaGlobal/);
assert.match(sonidos, /const VOLUMEN_BASE_EQUILIBRIO_RESTABLECIDO = 0\.22/);
assert.match(main, /if \(crisisPlaneta <= 0\) \{\s*reproducirMusicaEquilibrioRestablecido\(volumenSonido\);/);
assert.match(main, /function reproducirMusicaFinalSiCorresponde[\s\S]*reproducirMusicaDelDesenlace\(partida\.getSaludPlaneta\(\)\)/);
assert.match(main, /function terminarPartida[\s\S]*reproducirMusicaDelDesenlace\(resumen\.saludPlaneta\)/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaEquilibrioRestablecido\(true\);[\s\S]*partida = null/);
assert.match(main, /actualizarVolumenMusicaEquilibrioRestablecido\(volumenSonido\)/);
assert.match(main, /window\.addEventListener\("pagehide", detenerAudioAlSalir\)/);

// Al entrar en la partida, Safari no debe conservar ninguna música de las
// pantallas anteriores ni una pista final reanudada desde la caché.
assert.match(main, /function empezarPartida[\s\S]*pausarAudioInicio\(\);[\s\S]*pausarMusicaIntroduccionConfiguracion\(true\);[\s\S]*pausarMusicaPartida\(true\);[\s\S]*pausarMusicaPlanetaRestaurado\(true\);[\s\S]*pausarMusicaEquilibrioRestablecido\(true\);[\s\S]*pausarMusicaPlanetaColapso\(true\);[\s\S]*pausarMusicaRivalidadFinal\(true\);[\s\S]*reproducirMusicaPartidaSiCorresponde\(\)/);
assert.match(main, /function detenerAudioAlSalir[\s\S]*pausarMusicaEquilibrioRestablecido\(true\);/);

// COLAPSO PLANETARIO conserva su archivo exclusivo dentro del mismo canal.
assert.match(sonidos, /const RUTA_MUSICA_PLANETA_COLAPSO = "\.\/assets\/audio\/final\/planeta-colapso\.mp3"/);
assert.match(sonidos, /const musicaPlanetaColapso = musicaGlobal/);
assert.match(sonidos, /const VOLUMEN_BASE_PLANETA_COLAPSO = 0\.18/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaPlanetaColapso\(true\);[\s\S]*partida = null/);
assert.match(main, /else if \(crisisPlaneta >= 100\) \{\s*reproducirMusicaPlanetaColapso\(volumenSonido\);/);
assert.match(main, /actualizarVolumenMusicaPlanetaColapso\(volumenSonido\)/);

// Desde 41% de Crisis hasta 99%, cualquier desenlace completo necesita música;
// antes el equilibrio inestable quedaba en silencio al no ser una supremacía.
assert.match(sonidos, /const RUTA_MUSICA_RIVALIDAD_FINAL = "\.\/assets\/audio\/final\/rivalidad-final\.mp3"/);
assert.match(sonidos, /const musicaRivalidadFinal = musicaPartida/);
assert.match(sonidos, /musicaRivalidadFinal\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_RIVALIDAD_FINAL = 0\.18/);
assert.match(sonidos, /reproducirMusicaRivalidadFinal[\s\S]*prepararMusica\(RUTA_MUSICA_RIVALIDAD_FINAL\)/);
assert.doesNotMatch(main, /prepararMusicaRivalidadFinal/);
assert.match(sonidos, /reproducirMusicaRivalidadFinal[\s\S]*musicaRivalidadFinal\.muted = false[\s\S]*pointerdown[\s\S]*touchend/);
assert.doesNotMatch(main, /ultimoResultadoRonda/);
assert.doesNotMatch(main, /finalConMusicaRivalidad/);
assert.match(main, /cancelarEfectosProgramados\(\);\s*detenerEfectos\(\);\s*const resumen = partida\.calcularFinal\(\)/);
assert.match(main, /reproducirMusicaDelDesenlace\(resumen\.saludPlaneta\);[\s\S]*if \(crisisFinal < 41 \|\| crisisFinal >= 100\) reproducirDesenlace\(\);/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaRivalidadFinal\(true\);[\s\S]*partida = null/);
assert.match(main, /actualizarVolumenMusicaRivalidadFinal\(volumenSonido\)/);
assert.doesNotMatch(sonidos, /eventoPositivo|eventos\/positivo\.mp3/);
assert.equal(fs.existsSync(new URL("../assets/audio/final/planeta-restaurado.mp3", import.meta.url)), true);
assert.equal(fs.existsSync(new URL("../assets/audio/final/equilibrio-restablecido.mp3", import.meta.url)), true);
assert.equal(fs.existsSync(new URL("../assets/audio/final/planeta-colapso.mp3", import.meta.url)), true);
assert.equal(fs.existsSync(new URL("../assets/audio/final/rivalidad-final.mp3", import.meta.url)), true);
assert.equal(fs.existsSync(new URL("../assets/audio/musica/introduccion-configuracion.mp3", import.meta.url)), true);
assert.equal(fs.existsSync(new URL("../assets/audio/heartbeat.wav", import.meta.url)), false);
assert.equal(fs.existsSync(new URL("../assets/audio/sfx/eventos/positivo.mp3", import.meta.url)), false);

// Prueba de comportamiento con un Audio mínimo simulado: comprueba volumen,
// bucle, pausa y rebobinado sin necesitar reproducir sonido desde Node.
const audiosCreados = [];
let sonidoGuardado = "off";
globalThis.localStorage = {
  getItem: function (clave) {
    if (clave === "nexo-sonido") return sonidoGuardado;
    if (clave === "nexo-volumen") return "28";
    return null;
  }
};
globalThis.document = {
  body: {
    appendChild: function (audio) { audio.isConnected = true; }
  },
  addEventListener: function () {},
  removeEventListener: function () {},
  getElementById: function () { return null; }
};
globalThis.Audio = class {
  constructor(ruta) {
    this.src = ruta;
    this.currentTime = 0;
    this.volume = 1;
    this.loop = false;
    this.preload = "";
    this.muted = false;
    this.paused = true;
    this.reproducciones = 0;
    this.isConnected = false;
    audiosCreados.push(this);
  }
  load() {}
  getAttribute(nombre) { return nombre === "src" ? this.src : null; }
  setAttribute() {}
  pause() { this.paused = true; }
  play() {
    this.paused = false;
    this.reproducciones += 1;
    return Promise.resolve();
  }
};

const carpetaCompilada = process.env.NEXO_DIST_PRUEBA === "comprobacion"
  ? "../dist-comprobacion/sonidos.js"
  : "../dist/sonidos.js";
const moduloSonidos = await import(carpetaCompilada + "?test=audio-transiciones-v24-47");
// El módulo crea exactamente dos canales: música larga y efectos breves.
assert.equal(audiosCreados.length, 2);
const musicaCompartida = audiosCreados[0];
const canalEfectos = audiosCreados[1];
assert.equal(musicaCompartida.loop, true);
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(100), false); // 0% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(99), true);  // 1% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(60), true);  // 40% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(59), false); // 41% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(1), false);  // 99% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(0), false);  // 100% Crisis

// Aunque el sonido estuviera desactivado al entrar, el primer gesto prepara
// los dos canales de Safari móvil sin hacerlos audibles.
moduloSonidos.desbloquearAudioMovil();
await Promise.resolve();
assert.equal(musicaCompartida.src, "./assets/audio/musica/introduccion-configuracion.mp3");
assert.equal(canalEfectos.src, "./assets/audio/sfx/ui/clic-01.mp3");
assert.equal(audiosCreados.filter(function (audio) { return audio.reproducciones === 1; }).length, 2);
assert.equal(audiosCreados.every(function (audio) { return audio.muted === false; }), true);
assert.equal(audiosCreados.every(function (audio) { return audio.paused === true; }), true);
for (const audio of audiosCreados) audio.reproducciones = 0;

sonidoGuardado = "on";
moduloSonidos.reproducirSonido("confirmar");
assert.equal(canalEfectos.src, "./assets/audio/sfx/ui/confirmar.mp3");
assert.equal(canalEfectos.reproducciones, 1);
assert.equal(canalEfectos.paused, false);
assert.equal(canalEfectos.muted, false);

moduloSonidos.reproducirMusicaIntroduccionConfiguracion(28);
assert.equal(musicaCompartida.src, "./assets/audio/musica/introduccion-configuracion.mp3");
assert.equal(musicaCompartida.reproducciones, 1);
assert.equal(musicaCompartida.currentTime, 4);
assert.equal(musicaCompartida.volume, 0);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
assert.ok(Math.abs(musicaCompartida.volume - 0.13552) < 0.000001);
musicaCompartida.currentTime = 9;
moduloSonidos.pausarMusicaIntroduccionConfiguracion();
assert.equal(musicaCompartida.currentTime, 9);
moduloSonidos.reproducirMusicaIntroduccionConfiguracion(28);
assert.equal(musicaCompartida.reproducciones, 2);
assert.equal(musicaCompartida.currentTime, 9);
assert.equal(musicaCompartida.volume, 0);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
moduloSonidos.apagarMusicaIntroduccionConfiguracionSuavemente();
assert.equal(musicaCompartida.paused, false);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
assert.equal(musicaCompartida.paused, true);
assert.equal(musicaCompartida.currentTime, 0);
moduloSonidos.reproducirMusicaPartida(28);
assert.equal(musicaCompartida.src, "./assets/audio/musica/nexo-partida.mp3");
assert.equal(musicaCompartida.volume, 0);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
assert.ok(Math.abs(musicaCompartida.volume - 0.11088) < 0.000001);
moduloSonidos.pausarMusicaPartida(true);
moduloSonidos.reproducirMusicaRivalidadFinal(28);
assert.equal(musicaCompartida.src, "./assets/audio/final/rivalidad-final.mp3");
assert.equal(musicaCompartida.muted, false);
assert.ok(Math.abs(musicaCompartida.volume - 0.11088) < 0.000001);
musicaCompartida.currentTime = 15;
moduloSonidos.pausarMusicaRivalidadFinal(true);
assert.equal(musicaCompartida.currentTime, 0);
moduloSonidos.reproducirMusicaEquilibrioRestablecido(28);
assert.equal(musicaCompartida.src, "./assets/audio/final/equilibrio-restablecido.mp3");
assert.ok(Math.abs(musicaCompartida.volume - 0.13552) < 0.000001);
musicaCompartida.currentTime = 18;
moduloSonidos.pausarMusicaEquilibrioRestablecido();
assert.equal(musicaCompartida.currentTime, 18);
moduloSonidos.pausarMusicaEquilibrioRestablecido(true);
assert.equal(musicaCompartida.currentTime, 0);
moduloSonidos.reproducirMusicaPlanetaColapso(28);
assert.equal(musicaCompartida.src, "./assets/audio/final/planeta-colapso.mp3");
assert.ok(Math.abs(musicaCompartida.volume - 0.11088) < 0.000001);
musicaCompartida.currentTime = 12;
moduloSonidos.pausarMusicaPlanetaColapso();
assert.equal(musicaCompartida.currentTime, 12);
moduloSonidos.pausarMusicaPlanetaColapso(true);
assert.equal(musicaCompartida.currentTime, 0);

console.log("NEXO: mezcla audible, sonidos fijos y músicas finales verificadas.");
