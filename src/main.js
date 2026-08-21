/* ================================================================
   NEXO — NAVEGACIÓN PROVISIONAL ENTRE PANTALLAS

   Este archivo sirve únicamente para revisar visualmente las escenas.
   Cuando esté listo el JavaScript definitivo, se puede sustituir entero.
   No contiene reglas de partida, rondas, cartas ni selección de avatar.
================================================================ */

/*
  Cada línea relaciona el id de un botón con el id de su pantalla destino.

  Para añadir otro botón de navegación en el futuro:
  1. Pon un id al botón y otro id a la sección de destino en index.html.
  2. Añade aquí una nueva línea con el formato:
     "id-del-boton": "id-de-la-pantalla",
*/
const rutasPantallas = {
  "btn-jugar": "pantalla-introduccion",
  "btn-ir-configuracion": "pantalla-configuracion",
  "btn-iniciar-partida": "pantalla-juego",
  "btn-volver-jugar": "pantalla-inicio",
};

/**
 * Oculta todas las pantallas y muestra solamente la indicada.
 * La clase "activa" ya está definida en el CSS del proyecto.
 */
function mostrarPantalla(idPantalla) {
  const pantallaDestino = document.getElementById(idPantalla);

  if (!pantallaDestino) {
    console.warn(`NEXO: no existe la pantalla con id "${idPantalla}".`);
    return;
  }

  document.querySelectorAll(".pantalla").forEach((pantalla) => {
    pantalla.classList.remove("activa");
  });

  pantallaDestino.classList.add("activa");
  window.scrollTo({ top: 0, left: 0, behavior: "auto" });
}

/**
 * Conecta los botones existentes con sus destinos.
 * Si un botón todavía no existe, el resto de conexiones sigue funcionando.
 */
Object.entries(rutasPantallas).forEach(([idBoton, idPantalla]) => {
  const boton = document.getElementById(idBoton);

  if (!boton) {
    console.warn(`NEXO: no existe el botón con id "${idBoton}".`);
    return;
  }

  boton.addEventListener("click", () => {
    mostrarPantalla(idPantalla);
  });
});

