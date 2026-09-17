import assert from "node:assert/strict";

const memoria = new Map();
globalThis.localStorage = {
  getItem: (clave) => memoria.has(clave) ? memoria.get(clave) : null,
  setItem: (clave, valor) => memoria.set(clave, String(valor)),
  removeItem: (clave) => memoria.delete(clave)
};

globalThis.Image = class {
  src = "";
};

const salida = { textContent: "" };
globalThis.document = {
  getElementById: (id) => id === "mejor-marca" ? salida : null
};

const almacenamiento = await import("../dist/almacenamiento.js?test=mejor-marca");
const interfaz = await import("../dist/interfaz.js?test=mejor-marca");

almacenamiento.seleccionarJugador("CRIS");
almacenamiento.guardarMejorMarca("CRIS", {
  evolucionJugador: 20,
  saludPlaneta: 60,
  perfil: { nombre: "EL GUARDIÁN" },
  desenlace: "EQUILIBRIO"
});

interfaz.pintarMejorMarca();

assert.equal(
  salida.textContent,
  "Mejor marca · CRIS — EL GUARDIÁN (evolución 20, crisis 40%)"
);
assert.equal(salida.textContent.includes("undefined"), false);

console.log("NEXO: nombre de la mejor marca mostrado correctamente.");
