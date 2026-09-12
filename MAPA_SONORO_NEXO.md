# Mapa sonoro de NEXO — continuidad narrativa y finales V24.46

Esta fase conserva la música de partida y todos los efectos breves que tienen una función activa. `ambos-nexo.mp3` sigue siendo la segunda mezcla entregada para la portada. La X se mantiene ajustada al ciclo medido de `1,009272 s` y los nodos a las cuatro descargas del ciclo de `11,101995 s`. Introducción y Configuración comparten una pista continua. Los dos extremos del resultado mantienen música propia: **0% de Crisis** utiliza `equilibrio-restablecido.mp3`, **100% de Crisis** utiliza `planeta-colapso.mp3`; la franja de **1–40% de Crisis** utiliza `planeta-restaurado.mp3`. Desde el 41% se conserva la música que ya corresponda al desenlace, incluido el final de Rivalidad para **SUPREMACÍA HUMANA** o **SUPREMACÍA IA**.

En V24.46, la portada conserva un refuerzo moderado de volumen. Introducción y Configuración empiezan en el segundo 2 de su MP3 y entran con un fundido de 900 ms. Al pulsar **INICIAR PROTOCOLO**, esa pista baja y la música de partida sube en paralelo durante el mismo intervalo. Todo se realiza con objetos `Audio`, `volume` y `setInterval`.

## Criterio de uso

- Acciones equivalentes comparten sonido para que el jugador aprenda el lenguaje de la interfaz.
- Cada función conserva siempre una única pista: no hay selección aleatoria en los clics.
- Los objetos `Audio` breves se precargan y reutilizan para evitar que el primer clic se pierda.
- Los efectos largos tienen un volumen menor y cada familia usa un canal: un sonido nuevo solo corta al anterior de su misma familia.
- Los cambios de planeta y avatares solo suenan al cruzar 25%, 50%, 75% o 100%, no en cada actualización.
- Evento y carta de crisis se presentan de forma consecutiva si aparecen en la misma ronda.
- Todos los eventos especiales usan `eventos/alerta.mp3`, independientemente del evento sorteado.
- Todas las cartas/modificadores de crisis usan `eventos/carta-mixta.mp3`, independientemente de su tipo.
- El refuerzo común de mezcla mantiene las proporciones originales y limita cada `audio.volume` al máximo `1`.

## Selección aplicada

| Uso en el juego | Archivo del proyecto | Archivo recibido seleccionado |
| --- | --- | --- |
| Clic secundario sin función específica | `ui/clic-01.mp3` | `denielcz-immersivecontrol...` |
| Navegar, atrás, saltar introducción o abandonar | `ui/menu.mp3` | `universfield-menu-button-click-147349.mp3` |
| Acción principal: JUGAR, iniciar, resolver o continuar ronda | `ui/confirmar.mp3` | `creatorshome-low-button-click-331780.mp3` |
| Abrir/cerrar Cómo jugar o Ajustes | `ui/panel.mp3` | `freesoundeffects-modern-button-click-291234.mp3` |
| Elegir avatar | `cartas/seleccionar-02.mp3` | `freesoundeffects-button-click-289742.mp3` |
| Elegir número de rondas | `ui/clic-03.mp3` | `freesound_gamestudio-button-394464.mp3` |
| Elegir un usuario registrado | `ui/clic-03.mp3` | Se reutiliza el mismo clic corto de selección |
| Elegir PAR o IMPAR | `ui/clic-02.mp3` | `emilianodleon-button-ui-sound-effect-395762.mp3` |
| Elegir una carta de la mano | `cartas/seleccionar-01.mp3` | `audley_fergine-ui-button-click-8...` |
| Activación de Precisión, Velocidad o conquista | `cartas/fortaleza.mp3` | `audley_fergine-ui-button-click-4-284571.mp3` |
| Carta de crisis mixta / cambio IA | `eventos/carta-mixta.mp3` | `soundshelfstudio-ui-button-click-mechanical-515078.mp3` |
| Cualquier evento especial | `eventos/alerta.mp3` | `fxprosound-dizzy-ellectric-bolt-spell-1-186768.mp3` |
| Cualquier carta/modificador de crisis | `eventos/carta-mixta.mp3` | `soundshelfstudio-ui-button-click-mechanical-515078.mp3` |
| Empeoramiento de tramo planetario | `eventos/critico.mp3` | `audiopapkin-riser-hit-sfx-001-289802.mp3` |
| Convergencia | `resultados/convergencia.mp3` | `humordome-magic-button-click-453255.mp3` |
| Rivalidad | `resultados/rivalidad.mp3` | `dragon-studio-cinematic-pulsing-467483.mp3` |
| Fracaso | `resultados/fracaso.mp3` | `olenchic-electric-155027 (1).mp3` |
| Mejora del planeta al cruzar un tramo | `transiciones/planeta-mejora.mp3` | `universfield-swoosh-012-352858.mp3` |
| Avatar que alcanza 100% | `transiciones/evolucion-maxima.mp3` | `dragon-studio-cinematic-pulse-463209.mp3` |
| Aparición de pantalla final | `transiciones/desenlace.mp3` | `8doxo-reverb-ui-button-1-231246.mp3` |
| Música continua de Introducción y Configuración | `musica/introduccion-configuracion.mp3` | `pantallaIntroConfig - Treblo.mp3` |
| Música de fondo de la partida | `musica/nexo-partida.mp3` | `nexoPartidaFinal.mp3` |
| Música de EQUILIBRIO RESTABLECIDO · 0% Crisis | `final/equilibrio-restablecido.mp3` | `equilibrioRestaurado.mp3` |
| Música de PLANETA RESTAURADO · 1–40% Crisis | `final/planeta-restaurado.mp3` | `planetaRestaurado1.mp3` |
| Música de COLAPSO PLANETARIO | `final/planeta-colapso.mp3` | `fracaso Engranaje Detenido modificado - Treblo.mp3` |
| Música final de SUPREMACÍA HUMANA o SUPREMACÍA IA tras agotar rondas | `final/rivalidad-final.mp3` | `rivalidad.mp3` |

Los efectos están dentro de `assets/audio/sfx/`; las músicas de portada, partida y desenlace se organizan en sus propias carpetas dentro de `assets/audio/`.

## Explicación defendible en clase

`src/sonidos.ts` contiene un objeto que relaciona cada efecto con una ruta, volumen y canal. Al arrancar se crea y guarda un objeto `Audio` para cada función. En cada clic se rebobina ese mismo audio, se aplica el volumen guardado y se llama a `play()`. Las músicas largas utilizan objetos `Audio` independientes con `loop = true`, de modo que no cortan los efectos. Introducción y Configuración reutilizan exactamente el mismo objeto sin pausarlo ni reiniciarlo entre ambas pantallas; el clic en **INICIAR PROTOCOLO** lo detiene y da paso a la música de partida. `main.ts` decide qué música final corresponde según la Crisis y el desenlace completo calculado por `Partida`: 0% usa `equilibrio-restablecido.mp3`, 1–40% usa `planeta-restaurado.mp3` con prioridad sobre Rivalidad, 100% usa `planeta-colapso.mp3` y desde 41% se mantiene la música del desenlace que ya corresponda. Una función aritmética refuerza el nivel general y usa `Math.min` para no superar el volumen máximo. No se utiliza Web Audio API, librerías externas, herencia ni una clase adicional.
