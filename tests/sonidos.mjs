import assert from "node:assert/strict";
import fs from "node:fs";

const sonidos = fs.readFileSync(new URL("../src/sonidos.ts", import.meta.url), "utf8");
const main = fs.readFileSync(new URL("../src/main.ts", import.meta.url), "utf8");
const suspense = fs.readFileSync(new URL("../src/suspense.ts", import.meta.url), "utf8");
const estilos = fs.readFileSync(new URL("../css/style.css", import.meta.url), "utf8");

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
assert.match(suspense, /reproducirSonido\("confirmar"\)[\s\S]*reproducirAudioInicio\(volumen, true\);[\s\S]*desbloquearAudioMovil\(\)/);
assert.match(suspense, /const RETRASO_ENTRADA_AUDIO_INICIO = 700/);
assert.match(suspense, /audioInicio\.muted = retrasarEntrada/);
assert.match(suspense, /audioInicio\.currentTime = 0;\s*audioInicio\.muted = false;[\s\S]*RETRASO_ENTRADA_AUDIO_INICIO/);
assert.match(suspense, /dispatchEvent\(new Event\("nexo-portada-visible"\)\)/);
assert.match(main, /audioInicio\.addEventListener\("nexo-portada-visible", sincronizarPulsoPortada\)/);
assert.doesNotMatch(main, /setTimeout\(sincronizarPulsoPortada, 700\)/);
assert.match(sonidos, /if \(audioMovilDesbloqueado\) return;/);
assert.match(sonidos, /if \(nombre !== "confirmar"\)/);
assert.match(sonidos, /musicaEquilibrioRestablecido\.load\(\)/);

// La pista aprobada de portada conserva su ruta, bucle y objeto Audio normal.
assert.match(suspense, /new Audio\("\.\/assets\/audio\/inicio\/ambos-nexo\.mp3\?v=audio-inicio-v24-38"\)/);
assert.match(suspense, /audioInicio\.loop = true/);
assert.match(suspense, /const REFUERZO_AUDIO_INICIO = 2\.0/);
assert.match(suspense, /reproducirSonido\("confirmar"\)/);
assert.equal((suspense.match(/reproducirSonido\("confirmar"\)/g) || []).length, 1);

// La X y los nodos usan los ciclos medidos del MP3 y reinician su reloj CSS.
assert.match(main, /const DURACION_PULSO_PORTADA = 1\.009272/);
assert.match(main, /const DURACION_DESCARGAS_PORTADA = 11\.101995/);
assert.match(main, /classList\.add\("reiniciar-animacion-audio"\)/);
assert.match(main, /requestAnimationFrame\(function \(\) \{\s*logo\.classList\.remove\("reiniciar-animacion-audio"\)/);
assert.match(estilos, /@keyframes nexo-x-base-latido-humano-v14/);
assert.match(estilos, /@keyframes nexo-nodos-descarga-tecnologica-v14/);
assert.match(estilos, /animation-duration: 1\.009272s/);
assert.match(estilos, /animation-duration: 11\.101995s/);
assert.match(estilos, /Destellos medidos: 0,980 · 3,780 · 4,540 · 7,040 s/);

// En alturas habituales de portátil/escritorio, el cierre reserva espacio al
// botón final y no centra verticalmente un bloque que podría desbordarse.
assert.match(estilos, /min-height:821px\) and \(max-height:980px\)[\s\S]*align-content:start/);
assert.match(estilos, /#pantalla-final \.boton-final-nexo\{\s*min-height:46px;\s*max-height:50px;/);

// La música de partida usa otro objeto Audio para no cortar los efectos.
assert.match(sonidos, /new Audio\("\.\/assets\/audio\/musica\/nexo-partida\.mp3"\)/);
assert.match(sonidos, /musicaPartida\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_MUSICA_PARTIDA = 0\.18/);
assert.match(sonidos, /musicaPartida\.volume = empiezaDesdeElPrincipio \? 0 : volumenObjetivoMusicaPartida/);
assert.match(sonidos, /const REFUERZO_MEZCLA_AUDIO = 2\.2/);
assert.match(sonidos, /Math\.min\(1, volumenBase \* volumenGeneral \* REFUERZO_MEZCLA_AUDIO\)/);
assert.match(main, /mostrarPantalla\("pantalla-juego"\);[\s\S]*?window\.scrollTo\(0, 0\);[\s\S]*?reproducirMusicaPartidaSiCorresponde\(\);/);
assert.match(main, /actualizarVolumenMusicaPartida\(volumenSonido\)/);
assert.match(main, /pausarMusicaPartida\(true\);\s*pausarMusicaPlanetaRestaurado\(true\);\s*pausarMusicaEquilibrioRestablecido\(true\);\s*pausarMusicaPlanetaColapso\(true\);\s*pausarMusicaRivalidadFinal\(true\);\s*mostrarPantalla\("pantalla-final"\);/);

// Introducción y Configuración comparten un solo Audio sin reiniciarlo entre pantallas.
assert.match(sonidos, /new Audio\("\.\/assets\/audio\/musica\/introduccion-configuracion\.mp3"\)/);
assert.match(sonidos, /musicaIntroduccionConfiguracion\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_MUSICA_INTRO_CONFIG = 0\.22/);
assert.match(sonidos, /const INICIO_MUSICA_INTRO_CONFIG = 4/);
assert.match(sonidos, /const PASOS_ENTRADA_MUSICA_INTRO_CONFIG = 5/);
assert.match(sonidos, /const PASOS_FUNDIDO_MUSICA = 20/);
assert.match(sonidos, /musicaIntroduccionConfiguracion\.currentTime = INICIO_MUSICA_INTRO_CONFIG/);
assert.match(main, /mostrarPantalla\("pantalla-introduccion"\);\s*reproducirMusicaIntroduccionConfiguracionSiCorresponde\(\);/);
assert.match(main, /apagarMusicaIntroduccionConfiguracionSuavemente\(\);\s*mostrarPantalla\("pantalla-juego"\);/);
const funcionAbrirConfiguracion = main.match(/function abrirConfiguracion\(\) \{[\s\S]*?\n\}/)?.[0] || "";
assert.doesNotMatch(funcionAbrirConfiguracion, /pausarMusicaIntroduccionConfiguracion|reproducirMusicaIntroduccionConfiguracion/);

// PLANETA RESTAURADO dispone de una música independiente y repetible para 1–40% de Crisis.
assert.match(sonidos, /new Audio\("\.\/assets\/audio\/final\/planeta-restaurado\.mp3"\)/);
assert.match(sonidos, /musicaPlanetaRestaurado\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_PLANETA_RESTAURADO = 0\.22/);
assert.match(sonidos, /const CRISIS_MINIMA_PLANETA_RESTAURADO = 1/);
assert.match(sonidos, /const CRISIS_MAXIMA_PLANETA_RESTAURADO = 40/);
assert.match(sonidos, /function correspondeMusicaPlanetaRestaurado[\s\S]*const crisisPlaneta = 100 - saludPlaneta;[\s\S]*crisisPlaneta >= CRISIS_MINIMA_PLANETA_RESTAURADO[\s\S]*crisisPlaneta <= CRISIS_MAXIMA_PLANETA_RESTAURADO/);
assert.match(main, /else if \(correspondeMusicaPlanetaRestaurado\(saludPlaneta\)\) \{\s*reproducirMusicaPlanetaRestaurado\(volumenSonido\);\s*\}\s*else if \(finalConMusicaRivalidad\)/);
assert.match(main, /else if \(correspondeMusicaPlanetaRestaurado\(resumen\.saludPlaneta\)\) \{\s*reproducirMusicaPlanetaRestaurado\(volumenSonido\);\s*\}\s*else if \(finalConMusicaRivalidad\)/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaPlanetaRestaurado\(true\);[\s\S]*partida = null/);
assert.match(main, /reproducirMusicaFinalSiCorresponde\(\)/);
assert.match(main, /pausarMusicaIntroduccionConfiguracion\(\);[\s\S]*pausarMusicaPlanetaRestaurado\(\);\s*pausarMusicaEquilibrioRestablecido\(\);\s*pausarMusicaPlanetaColapso\(\);\s*pausarMusicaRivalidadFinal\(\);\s*detenerEfectos\(\);/);
assert.match(main, /actualizarVolumenMusicaPlanetaRestaurado\(volumenSonido\)/);

// EQUILIBRIO RESTABLECIDO es la música exclusiva del 0% de Crisis.
assert.match(sonidos, /new Audio\("\.\/assets\/audio\/final\/equilibrio-restablecido\.mp3"\)/);
assert.match(sonidos, /musicaEquilibrioRestablecido\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_EQUILIBRIO_RESTABLECIDO = 0\.22/);
assert.match(main, /if \(resumen\.saludPlaneta >= 100\) \{\s*reproducirMusicaEquilibrioRestablecido\(volumenSonido\);/);
assert.match(main, /if \(saludPlaneta >= 100\) \{\s*reproducirMusicaEquilibrioRestablecido\(volumenSonido\);/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaEquilibrioRestablecido\(true\);[\s\S]*partida = null/);
assert.match(main, /actualizarVolumenMusicaEquilibrioRestablecido\(volumenSonido\)/);
assert.match(main, /window\.addEventListener\("pagehide", detenerAudioAlSalir\)/);
assert.match(main, /function detenerAudioAlSalir[\s\S]*pausarMusicaEquilibrioRestablecido\(true\);/);

// COLAPSO PLANETARIO dispone de otra música exclusiva y repetible.
assert.match(sonidos, /new Audio\("\.\/assets\/audio\/final\/planeta-colapso\.mp3"\)/);
assert.match(sonidos, /musicaPlanetaColapso\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_PLANETA_COLAPSO = 0\.18/);
assert.match(main, /else if \(resumen\.saludPlaneta <= 0\) \{\s*reproducirMusicaPlanetaColapso\(volumenSonido\);/);
assert.match(main, /btn-volver-jugar[\s\S]*pausarMusicaPlanetaColapso\(true\);[\s\S]*partida = null/);
assert.match(main, /else if \(saludPlaneta <= 0\) \{\s*reproducirMusicaPlanetaColapso\(volumenSonido\);/);
assert.match(main, /actualizarVolumenMusicaPlanetaColapso\(volumenSonido\)/);

// La música de Rivalidad se habilita en un final no extremo y guardado cuando
// el desenlace completo es supremacía Humana o IA, no por la última ronda.
assert.match(sonidos, /new Audio\("\.\/assets\/audio\/final\/rivalidad-final\.mp3"\)/);
assert.match(sonidos, /musicaRivalidadFinal\.loop = true/);
assert.match(sonidos, /const VOLUMEN_BASE_RIVALIDAD_FINAL = 0\.18/);
assert.doesNotMatch(main, /ultimoResultadoRonda/);
assert.match(main, /finalConMusicaRivalidad = guardarProgreso[\s\S]*resumen\.saludPlaneta > 0[\s\S]*resumen\.saludPlaneta < 100[\s\S]*resumen\.desenlace === "SUPREMACIA HUMANA"[\s\S]*resumen\.desenlace === "SUPREMACIA IA"/);
assert.match(main, /else if \(finalConMusicaRivalidad\) \{\s*reproducirMusicaRivalidadFinal\(volumenSonido\);/);
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
    audiosCreados.push(this);
  }
  load() {}
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
const musicaIntroConfig = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/musica/introduccion-configuracion.mp3");
});
const musicaRivalidad = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/final/rivalidad-final.mp3");
});
const musicaEquilibrioRestablecido = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/final/equilibrio-restablecido.mp3");
});
const musicaColapso = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/final/planeta-colapso.mp3");
});
const musicaDePartida = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/musica/nexo-partida.mp3");
});
assert.notEqual(musicaIntroConfig, undefined);
assert.notEqual(musicaRivalidad, undefined);
assert.notEqual(musicaEquilibrioRestablecido, undefined);
assert.notEqual(musicaColapso, undefined);
assert.notEqual(musicaDePartida, undefined);
assert.equal(musicaIntroConfig.loop, true);
assert.equal(musicaRivalidad.loop, true);
assert.equal(musicaEquilibrioRestablecido.loop, true);
assert.equal(musicaColapso.loop, true);
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(100), false); // 0% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(99), true);  // 1% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(60), true);  // 40% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(59), false); // 41% Crisis
assert.equal(moduloSonidos.correspondeMusicaPlanetaRestaurado(0), false);  // 100% Crisis

// Aunque el sonido estuviera desactivado al entrar, el primer gesto prepara
// las pistas de Safari móvil sin hacerlas audibles. El clic "confirmar" queda
// fuera de esa preparación porque se reproduce de verdad inmediatamente.
moduloSonidos.desbloquearAudioMovil();
await Promise.resolve();
const confirmarPreparado = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/sfx/ui/confirmar.mp3");
});
assert.equal(confirmarPreparado, undefined);
assert.equal(audiosCreados.filter(function (audio) { return audio.reproducciones === 1; }).length, 25);
assert.equal(audiosCreados.every(function (audio) { return audio.muted === false; }), true);
assert.equal(audiosCreados.every(function (audio) { return audio.paused === true; }), true);
for (const audio of audiosCreados) audio.reproducciones = 0;

sonidoGuardado = "on";
moduloSonidos.reproducirSonido("confirmar");
const confirmarReal = audiosCreados.find(function (audio) {
  return audio.src.endsWith("/assets/audio/sfx/ui/confirmar.mp3");
});
assert.notEqual(confirmarReal, undefined);
assert.equal(confirmarReal.reproducciones, 1);
assert.equal(confirmarReal.paused, false);
assert.equal(confirmarReal.muted, false);

moduloSonidos.reproducirMusicaIntroduccionConfiguracion(28);
assert.equal(musicaIntroConfig.reproducciones, 1);
assert.equal(musicaIntroConfig.currentTime, 4);
assert.equal(musicaIntroConfig.volume, 0);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
assert.ok(Math.abs(musicaIntroConfig.volume - 0.13552) < 0.000001);
musicaIntroConfig.currentTime = 9;
moduloSonidos.pausarMusicaIntroduccionConfiguracion();
assert.equal(musicaIntroConfig.currentTime, 9);
moduloSonidos.reproducirMusicaIntroduccionConfiguracion(28);
assert.equal(musicaIntroConfig.reproducciones, 2);
assert.equal(musicaIntroConfig.currentTime, 9);
assert.equal(musicaIntroConfig.volume, 0);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
moduloSonidos.apagarMusicaIntroduccionConfiguracionSuavemente();
assert.equal(musicaIntroConfig.paused, false);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
assert.equal(musicaIntroConfig.paused, true);
assert.equal(musicaIntroConfig.currentTime, 0);
moduloSonidos.reproducirMusicaPartida(28);
assert.equal(musicaDePartida.volume, 0);
await new Promise(function (resolver) { setTimeout(resolver, 1000); });
assert.ok(Math.abs(musicaDePartida.volume - 0.11088) < 0.000001);
moduloSonidos.pausarMusicaPartida(true);
moduloSonidos.reproducirMusicaRivalidadFinal(28);
assert.equal(musicaRivalidad.reproducciones, 1);
assert.ok(Math.abs(musicaRivalidad.volume - 0.11088) < 0.000001);
musicaRivalidad.currentTime = 15;
moduloSonidos.pausarMusicaRivalidadFinal(true);
assert.equal(musicaRivalidad.currentTime, 0);
moduloSonidos.reproducirMusicaEquilibrioRestablecido(28);
assert.equal(musicaEquilibrioRestablecido.reproducciones, 1);
assert.ok(Math.abs(musicaEquilibrioRestablecido.volume - 0.13552) < 0.000001);
musicaEquilibrioRestablecido.currentTime = 18;
moduloSonidos.pausarMusicaEquilibrioRestablecido();
assert.equal(musicaEquilibrioRestablecido.currentTime, 18);
moduloSonidos.pausarMusicaEquilibrioRestablecido(true);
assert.equal(musicaEquilibrioRestablecido.currentTime, 0);
moduloSonidos.reproducirMusicaPlanetaColapso(28);
assert.equal(musicaColapso.reproducciones, 1);
assert.ok(Math.abs(musicaColapso.volume - 0.11088) < 0.000001);
musicaColapso.currentTime = 12;
moduloSonidos.pausarMusicaPlanetaColapso();
assert.equal(musicaColapso.currentTime, 12);
moduloSonidos.pausarMusicaPlanetaColapso(true);
assert.equal(musicaColapso.currentTime, 0);

console.log("NEXO: mezcla audible, sonidos fijos y músicas finales verificadas.");
