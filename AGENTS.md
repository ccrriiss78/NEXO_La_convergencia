# Reglas obligatorias para trabajar en NEXO

Estas instrucciones deben aplicarse antes de analizar, modificar, compilar o empaquetar el proyecto.

## Principio fundamental

`src/` es la fuente del programa y `dist/` es el resultado compilado. Nunca implementar una funcionalidad únicamente en `dist/*.js`.

Cada módulo JavaScript de `dist/` debe conservar su correspondiente fuente TypeScript en `src/`. No sustituir `src/main.ts` por un archivo de prueba, demostración o contenido mínimo.

## Antes de cualquier cambio

1. Identificar la última versión estable confirmada por la usuaria.
2. Trabajar sobre una copia nueva y conservar intacta la versión estable.
3. Revisar `README.md`, `INFORME_RECONSTRUCCION_TYPESCRIPT.md`, `package.json` y `tsconfig.json`.
4. Comprobar que existen 10 fuentes `.ts` y 10 módulos `.js` correspondientes.
5. Separar los cambios funcionales de los cambios visuales y evitar modificaciones ajenas a la petición.
6. Ejecutar `npm run audit`. Si falla, detener el trabajo y restaurar primero la integridad del proyecto.

## Guardián de archivos

- `proteccion-archivos.json` contiene el inventario de archivos y assets imprescindibles.
- No modificar el inventario para hacer desaparecer un error de auditoría.
- Antes de borrar, renombrar, mover o sustituir un archivo, buscar todas sus referencias y explicar por qué el cambio es necesario.
- Solo actualizar el inventario cuando la usuaria haya pedido expresamente ese cambio y el proyecto completo haya sido verificado.
- Después de cualquier cambio ejecutar `npm test`; este comando lanza primero la auditoría automática.
- Si el repositorio usa Git, ejecutar una vez `npm run guardian:install` para activar la auditoría antes de cada commit.

## Dónde realizar los cambios

- Lógica, estado, almacenamiento o interacción: modificar primero el archivo correspondiente de `src/*.ts`.
- HTML, estilos o recursos: modificar únicamente `index.html`, `css/` o `assets/` cuando no sea necesario tocar la lógica.
- No editar manualmente `dist/*.js` como fuente principal.
- No eliminar archivos de `src/` porque parezcan duplicados sin comprobar antes su relación con `dist/`.
- No copiar fuentes antiguas sobre las actuales sin trasladar y verificar todas las mejoras posteriores.

## Flujo obligatorio de compilación

Seguir este orden:

1. Ejecutar `npm run build:check`.
2. Ejecutar `npm test`.
3. Probar en navegador las pantallas o interacciones afectadas.
4. Revisar que no haya errores ni advertencias relevantes en el navegador.
5. Ejecutar `npm run build` únicamente cuando los pasos anteriores hayan terminado correctamente.
6. Ejecutar nuevamente `npm test` después de reconstruir `dist/`.
7. Verificar que los módulos generados proceden de las fuentes actuales y que no ha desaparecido ninguna funcionalidad.

Si falla cualquier paso, no sobrescribir la versión estable ni preparar el ZIP final hasta resolverlo.

## Comprobaciones mínimas del juego

Cuando el cambio pueda afectar al flujo general, comprobar al menos:

- Portada e introducción.
- Configuración de jugador, avatares y número de rondas.
- Inicio de partida.
- Elección de PAR/IMPAR.
- Selección de carta.
- Habilitación y funcionamiento de `RESOLVER RONDA`.
- Aparición y funcionamiento de `SIGUIENTE RONDA`.
- Varias rondas consecutivas.
- Persistencia de jugadores y migración de guardados.
- Pantalla final cuando el cambio pueda afectarla.
- Responsive y ausencia de solapamientos cuando haya cambios visuales.

## Protección de versiones

- Nunca sobrescribir el último ZIP estable.
- Crear una nueva versión numerada para cada entrega.
- No incluir `dist-comprobacion/`, pruebas duplicadas, capturas temporales ni archivos generados accidentalmente.
- Antes de entregar, extraer el ZIP final en una carpeta nueva y volver a ejecutar `npm run build:check` y `npm test`.
- Informar exactamente de los archivos modificados, la causa del problema y las verificaciones realizadas.

## Convenciones académicas

No traducir todos los identificadores, eliminar tipos unión, sustituir `private` por `#` ni eliminar `try/catch` sin confirmar primero que esas reglas del documento de otro equipo son obligatorias para NEXO.

Priorizar primero la estabilidad y la correspondencia reproducible `src → tsc → dist`.

## Mejoras futuras

No incorporar mejoras anotadas como futuras sin una petición expresa. En particular, mantener aplazado el análisis personalizado del historial de la partida relacionado con teoría de juegos hasta que la usuaria decida implementarlo.
