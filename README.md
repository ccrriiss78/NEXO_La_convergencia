# NEXO — La Convergencia

Videojuego de cartas Humano vs IA inspirado en la mecánica PAR / IMPAR de la Morra y ambientado en una crisis ecológica global.

Este documento describe el comportamiento actual del juego. El historial detallado de cambios se conserva en Git; el README se centra en cómo funciona hoy el proyecto.

## Estado actual

NEXO incluye:

- pantalla de suspense interactiva para habilitar el audio en navegadores móviles;
- portada e introducción narrativa en cuatro bloques;
- configuración de jugador, avatares y duración de partida;
- partidas de 8, 12 o 16 rondas y modo libre;
- rondas con declaración PAR / IMPAR, elección de carta y resolución;
- resultados de **Convergencia**, **Rivalidad** y **Fracaso**;
- Crisis del Planeta y evolución reversible de Humano e IA;
- cartas modificadoras, eventos especiales y ocho fortalezas conquistables;
- cambios visuales del planeta y de los avatares según su evolución;
- manual accesible durante la experiencia;
- desenlaces visuales y sonoros según la Crisis final;
- perfiles, mejores marcas y preferencias guardados en el navegador;
- diseño adaptado a PC, tablet/iPad y móvil, en vertical y horizontal;
- pruebas automáticas de lógica, persistencia, eventos, sonido e integridad.

## Historia y objetivo

Los primeros años del siglo XXII están marcados por sucesivas crisis ecológicas. La tecnología y la IA han mejorado profundamente la vida humana, pero también han incrementado la demanda de energía, agua, minerales e infraestructuras.

La humanidad conserva creatividad, intuición, empatía y adaptación. La IA aporta memoria, precisión, análisis y velocidad. Ninguna dispone por sí sola de todo lo necesario para evitar el colapso. De esa dependencia y tensión nace el **Protocolo NEXO**.

El objetivo es mantener al planeta con vida mientras Humano e IA evolucionan y deciden qué relación construir:

- **Convergencia:** ambos aciertan la paridad de la suma y reducen la Crisis según la ronda.
- **Rivalidad:** solo uno acierta; el vencedor evoluciona y puede conquistar una fortaleza del contrario.
- **Fracaso:** ninguno acierta y la Crisis aumenta.

La evolución individual proporciona ventajas, pero la partida se pierde si el planeta colapsa.

## Configuración de partida

Antes de comenzar se eligen:

- nombre del jugador;
- avatar Humano;
- avatar de la IA;
- duración de 8, 12 o 16 rondas, o modo libre (`∞`).

La duración predeterminada es de 12 rondas. Los jugadores guardados pueden reutilizarse desde el mismo navegador.

## Flujo de una ronda

1. Se presenta una crisis ecológica.
2. Puede aparecer una carta que modifica las reglas de esa ronda.
3. Cada cuatro rondas puede activarse un evento especial.
4. La IA selecciona su carta y declara PAR o IMPAR.
5. El jugador ve la declaración de la IA, declara su apuesta y elige carta.
6. Las fortalezas disponibles intervienen cuando se cumplen sus condiciones.
7. Se revelan las cartas y se calcula la suma.
8. Se resuelve Convergencia, Rivalidad o Fracaso.
9. Se actualizan Crisis, evolución y fortalezas conquistadas.
10. El panel de resolución permite avanzar a la ronda siguiente.

Cada mano contiene las cartas del 1 al 5. Las cartas usadas se descartan y se recuperan al comenzar un nuevo ciclo de mano. Humano e IA administran sus manos de forma independiente.

### Resolución base

| Resultado | Condición | Efecto base |
|---|---|---|
| **Convergencia** | Humano e IA aciertan la paridad | La Crisis se reduce según la suma de las cartas, salvo que un modificador indique otra cosa. |
| **Rivalidad humana** | Solo acierta el Humano | El Humano evoluciona, la IA retrocede y el Humano puede conquistar la siguiente fortaleza IA. |
| **Rivalidad IA** | Solo acierta la IA | La IA evoluciona, el Humano retrocede y la IA puede conquistar la siguiente fortaleza humana. |
| **Fracaso** | Ninguno acierta | La Crisis aumenta 3 puntos, salvo que un modificador o evento cambie el efecto. |

Todos los porcentajes permanecen dentro del intervalo de 0 a 100.

## Crisis del Planeta

Internamente el juego conserva la salud del planeta; la interfaz muestra su valor inverso como **Crisis del Planeta**:

- salud 100 = Crisis 0 %;
- salud 50 = Crisis 50 %;
- salud 0 = Crisis 100 % y colapso.

Las ocho crisis narrativas son:

- Incendios forestales
- Contaminación oceánica
- Sequía prolongada
- Pérdida de biodiversidad
- Desertificación
- Residuos electrónicos
- Calentamiento global
- Escasez energética

La pantalla de partida utiliza fondos completos y reversibles para los tramos 0–24 %, 25–49 %, 50–74 %, 75–99 % y 100 % de Crisis. El 0 % exacto dispone además de un escenario propio de recuperación total.

Los assets se encuentran en:

- `assets/images/partida/fondos-planeta/`
- `assets/images/final/fondos/`

Los fondos de partida conservan el núcleo NEXO para el feedback de las rondas. Los fondos finales utilizan composiciones más abiertas para dar prioridad al desenlace.

## Cartas de crisis y modificadores

| Carta | Tipo | Efecto |
|---|---|---|
| **Energía Renovable** | Positiva | Duplica la reducción de Crisis obtenida por Convergencia. |
| **Economía Circular** | Positiva | Añade 3 puntos a la reducción de Crisis por Convergencia. |
| **Incendio Forestal** | Negativa | Si no hay Convergencia, añade 3 puntos al aumento de Crisis. |
| **Sequía** | Negativa | La suma de las cartas aumenta la Crisis incluso si hay Convergencia. |
| **Punto de Inflexión** | Mixta | Duplica cualquier cambio de Crisis e impide conquistar fortalezas esa ronda. |

El panel **IMPACTO EN ESTA RONDA** diferencia visualmente los modificadores positivos, negativos y mixtos. En pantallas pequeñas el contenido puede crecer con el documento para que el texto permanezca completo y legible.

## Eventos especiales

Los eventos aparecen cada cuatro rondas y afectan a una sola ronda:

| Evento | Efecto |
|---|---|
| **Tormenta solar** | Desactiva temporalmente las fortalezas conquistadas. |
| **Cumbre de emergencia** | Duplica la reducción de Crisis obtenida por Convergencia. |
| **Sobrecarga de datos** | Bloquea Análisis y Precisión y hace que la carta IA cuente `+1` en la suma. |
| **Chispa creativa** | Revela la carta de la IA antes de apostar. |
| **Punto sin retorno** | Un Fracaso aumenta la Crisis 6 puntos en lugar de 3. |

La presentación inicial del evento se cierra con **CONTINUAR**. Si el evento necesita permanecer visible durante la ronda, su resumen se integra en una zona propia y no cubre las declaraciones ni las cartas.

## Fortalezas conquistables

Las fortalezas se conquistan en orden durante una Rivalidad. No se seleccionan manualmente. Una fortaleza adquirida permanece disponible, pero el aviso de activación solo aparece cuando interviene realmente.

### Fortalezas IA que puede conquistar el Humano

1. **Memoria:** conserva el registro de las últimas apuestas y cartas de la IA.
2. **Precisión:** una vez por ciclo de mano revela la carta real de la IA y permite mantener o corregir la carta humana antes de resolver.
3. **Análisis predictivo:** estudia las cartas disponibles de la IA y recomienda opciones para buscar Convergencia o Rivalidad.
4. **Velocidad:** permite seleccionar dos cartas; NEXO compara sus resultados y aplica la más favorable. Ambas cartas se descartan.

### Fortalezas humanas que puede conquistar la IA

1. **Creatividad:** después de dos derrotas consecutivas frente al Humano, la IA cambia su patrón de apuesta.
2. **Intuición:** aproximadamente cada tres rondas puede ajustar su carta usando la elección humana como pista.
3. **Empatía:** cuando el planeta está en situación crítica, la IA revela su carta para facilitar una posible Convergencia.
4. **Adaptación:** permite a la IA recuperar una carta con la que anteriormente consiguió una victoria.

## Evolución visual de los avatares

Existen cuatro personajes base:

- Humano hombre → IA
- Humano mujer → IA
- IA femenina → Humano
- IA masculina → Humano

Cada personaje dispone de cinco imágenes reversibles:

- 0–24 %
- 25–49 %
- 50–74 %
- 75–99 %
- 100 %

En total hay 20 retratos evolutivos en `assets/images/partida/avatares-evolucion/`. El cambio de imagen ocurre al cruzar cada umbral y conserva la identidad reconocible del personaje.

## Final de partida

El número de rondas elegido es la duración máxima. La partida termina cuando:

- la Crisis alcanza el 0 % y el planeta se recupera completamente;
- la Crisis alcanza el 100 % y el planeta colapsa;
- se completa la duración elegida;
- el jugador abandona.

En modo libre se continúa hasta recuperación, colapso o abandono.

El estado principal del mundo se clasifica así:

| Crisis final | Estado del planeta |
|---|---|
| 0 % | Planeta recuperado |
| 1–24 % | Equilibrio restablecido |
| 25–49 % | Equilibrio frágil |
| 50–74 % | Equilibrio crítico |
| 75–99 % | Colapso inminente |
| 100 % | Colapso planetario |

El resultado secundario describe la relación evolutiva entre Humano e IA: Colapso, Convergencia Total, Supremacía Humana, Supremacía IA o Equilibrio inestable.

## Sonido

El sistema utiliza objetos `Audio` reutilizables y no depende de Web Audio API.

- Suspense y portada: `assets/audio/inicio/ambos-nexo.mp3`
- Introducción y configuración: `assets/audio/musica/introduccion-configuracion.mp3`
- Partida: `assets/audio/musica/nexo-partida.mp3`
- Efectos: `assets/audio/sfx/`

La primera interacción real prepara las pistas para cumplir las restricciones de reproducción de Safari móvil. Cada pantalla controla su propia música y detiene las pistas que ya no corresponden. El interruptor y el volumen generales afectan a músicas y efectos.

Todos los desenlaces reproducen primero los tres segundos principales de `assets/audio/sfx/transiciones/desenlace.mp3`. Después se detiene su cola tenue y comienza, sin solapamiento, la música larga correspondiente:

| Crisis final | Música |
|---|---|
| 0 % | `assets/audio/final/planeta-restaurado.mp3` |
| 1–40 % | `assets/audio/final/equilibrio-restablecido.mp3` |
| 41–99 % | `assets/audio/final/rivalidad-final.mp3` |
| 100 % | `assets/audio/final/planeta-colapso.mp3` |

El inventario sonoro completo está documentado en `MAPA_SONORO_NEXO.md`.

## Persistencia

El navegador utiliza `localStorage` para conservar:

- jugadores creados;
- mejor marca de cada jugador;
- perfiles obtenidos;
- estado del sonido;
- volumen.

Los datos permanecen en el navegador y no se envían a ningún servidor. Existe una migración para guardados anteriores y los identificadores internos son independientes del nombre visible.

## Diseño responsive y compatibilidad

La interfaz mantiene composiciones específicas para:

- PC;
- tablet e iPad en vertical y horizontal;
- móvil en vertical y horizontal;
- ventanas divididas y alturas útiles reducidas por las barras del navegador.

En móvil horizontal, la zona de decisión aparece primero y el documento permite desplazarse después hasta los paneles de Humano e IA, sus evoluciones, fortalezas y cartas disponibles. Los eventos persistentes y modificadores ocupan zonas propias para no tapar PAR / IMPAR, las cartas ni **RESOLVER RONDA**.

En dispositivos táctiles se refuerzan los controles de PAR / IMPAR, **RESOLVER RONDA**, **SIGUIENTE RONDA** y **CONTINUAR** para evitar mapas táctiles obsoletos de Safari al cambiar de ronda u orientación.

El campo del nombre mantiene un tamaño efectivo mínimo de 16 px en los formatos móviles necesarios para evitar el zoom automático de Safari sin desactivar el zoom global. La configuración puede desplazarse cuando la barra inferior reduce el área visible, por lo que **INICIAR PROTOCOLO** permanece accesible y completo.

La página se mantiene oculta hasta que los cuatro estilos principales han terminado de cargar, evitando que aparezca durante unos instantes contenido sin formato sobre fondo blanco.

## Estructura principal

```text
NEXO_La_convergencia_cris/
├── index.html
├── css/
│   ├── style.css
│   ├── partida.css
│   ├── suspense.css
│   └── movil.css
├── src/
│   ├── almacenamiento.ts
│   ├── Carta.ts
│   ├── datos.ts
│   ├── Evento.ts
│   ├── ia.ts
│   ├── interfaz.ts
│   ├── Jugador.ts
│   ├── main.ts
│   ├── Partida.ts
│   ├── sonidos.ts
│   ├── suspense.ts
│   ├── tipos.ts
│   └── efecto-energia-esfera.js
├── dist/
│   └── módulos JavaScript generados desde src/
├── tests/
│   ├── functional.mjs
│   ├── fortalezas.mjs
│   ├── eventos.mjs
│   ├── stress-partidas.mjs
│   ├── player-storage.mjs
│   ├── player-migration.mjs
│   ├── mejor-marca.mjs
│   └── sonidos.mjs
├── assets/
│   ├── audio/
│   └── images/
├── scripts/
├── package.json
├── package-lock.json
└── tsconfig.json
```

`src/` es la fuente mantenible y `dist/` contiene los módulos JavaScript ejecutados por el navegador. `src/efecto-energia-esfera.js` es una excepción intencionada: se carga directamente desde `index.html`.

## Ejecución local

El juego debe servirse por HTTP porque utiliza módulos ES. Desde la raíz del proyecto puede usarse un servidor estático sencillo:

```powershell
py -m http.server 8080 --bind 0.0.0.0
```

Después:

- en el mismo ordenador: `http://127.0.0.1:8080/`
- desde otro dispositivo de la misma red: `http://IP_DEL_ORDENADOR:8080/`

Para pruebas en iPhone o iPad se recomienda este servidor estable. Live Server puede inyectar recarga automática y provocar reinicios aparentes de la partida si detecta cambios.

## Desarrollo y pruebas

Instalar dependencias una vez:

```bash
npm install
```

Flujo recomendado:

1. `npm run audit` — comprueba archivos esenciales, assets, referencias y correspondencia entre `src/` y `dist/`.
2. `npm run build:check` — compila en `dist-comprobacion/` sin sobrescribir el juego activo.
3. `npm test` — ejecuta las ocho suites funcionales.
4. Revisar manualmente los cambios visuales e interactivos en los dispositivos afectados.
5. `npm run build` — actualiza `dist/` cuando todo lo anterior es correcto.

Las suites actuales verifican:

1. funcionamiento principal;
2. fortalezas;
3. eventos;
4. 900 partidas completas de estrés;
5. almacenamiento independiente por jugador;
6. migración de guardados;
7. mejor marca;
8. sonidos y músicas finales.

El hook de protección puede instalarse con:

```bash
npm run guardian:install
```

Las reglas de mantenimiento para agentes están en `AGENTS.md` y `CLAUDE.md`.

## Tecnologías

- HTML5
- CSS3
- TypeScript
- JavaScript ES Modules
- Web Storage (`localStorage`)
- Node.js para compilación, auditoría y pruebas
