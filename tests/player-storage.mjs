import assert from "node:assert/strict";

const memoria = new Map();
globalThis.localStorage = {
  getItem: (clave) => memoria.has(clave) ? memoria.get(clave) : null,
  setItem: (clave, valor) => memoria.set(clave, String(valor)),
  removeItem: (clave) => memoria.delete(clave)
};

const almacenamiento = await import("../dist/almacenamiento.js?test=jugadores");

almacenamiento.seleccionarJugador("CRIS");
almacenamiento.guardarPerfil("EL GUARDIÁN");
assert.equal(almacenamiento.leerPerfiles().length, 1);

almacenamiento.seleccionarJugador("ANA");
assert.deepEqual(almacenamiento.leerPerfiles(), []);
almacenamiento.guardarPerfil("EL ESTRATEGA");

almacenamiento.seleccionarJugador("CRIS");
assert.deepEqual(almacenamiento.leerPerfiles(), ["EL GUARDIÁN"]);
assert.deepEqual(almacenamiento.listarJugadores(), ["ANA", "CRIS"]);

const store = JSON.parse(localStorage.getItem("nexo.playerProfiles.v1"));
assert.equal(store.schemaVersion, 1);
assert.ok(store.activePlayerId.startsWith("player_"));
assert.equal(store.players[store.activePlayerId].displayName, "CRIS");

console.log("NEXO: progreso independiente de jugadores verificado.");
