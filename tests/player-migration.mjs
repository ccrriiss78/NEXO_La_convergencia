import assert from "node:assert/strict";

const memoria = new Map();
globalThis.localStorage = {
  getItem: (clave) => memoria.has(clave) ? memoria.get(clave) : null,
  setItem: (clave, valor) => memoria.set(clave, String(valor)),
  removeItem: (clave) => memoria.delete(clave)
};

localStorage.setItem("nexo_jugadores_v22", JSON.stringify({
  activo: "cris",
  jugadores: {
    cris: {
      nombre: "CRIS",
      perfiles: ["EL GUARDIÁN"],
      mejorMarca: { evolucion: 8, planeta: 70, perfil: "EL GUARDIÁN" }
    }
  }
}));

const almacenamiento = await import("../dist/almacenamiento.js?test=migration");
assert.equal(almacenamiento.leerJugadorActivo(), "CRIS");
assert.deepEqual(almacenamiento.leerPerfiles(), ["EL GUARDIÁN"]);
assert.equal(almacenamiento.leerMejorMarca().perfil, "EL GUARDIÁN");

const migrated = JSON.parse(localStorage.getItem("nexo.playerProfiles.v1"));
assert.equal(migrated.schemaVersion, 1);
assert.ok(migrated.activePlayerId.startsWith("player_"));

console.log("NEXO: migración del guardado V22 verificada.");
