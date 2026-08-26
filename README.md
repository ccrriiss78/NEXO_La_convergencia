# NEXO — La Convergencia

Videojuego de cartas para un jugador contra una Inteligencia Artificial, inspirado en la Morra y ambientado en una crisis ecológica global.

## Estado de esta versión

Este README describe el comportamiento real de **NEXO V21**. Sustituye los documentos de propuesta y las notas de versiones intermedias.

La versión incluye:

- portada e introducción narrativa en cuatro bloques;
- configuración de avatares y duración;
- partidas de 8, 12 o 16 rondas y modo libre;
- declaración previa de la IA;
- resultados de Convergencia, Rivalidad y Fracaso;
- evolución reversible de Humano e IA;
- Crisis del Planeta, cartas de crisis y eventos;
- capacidades conquistables;
- evolución visual de avatares y planeta;
- desenlaces, perfiles finales y persistencia local.

## Historia

Los primeros años del siglo XXII están marcados por sucesivas crisis ecológicas que amenazan la supervivencia del planeta y, con ella, la existencia de la humanidad y de la Inteligencia Artificial.

La integración de la tecnología y la IA ha mejorado profundamente la vida humana, pero también ha incrementado la demanda de energía, agua, minerales e infraestructuras. Esa presión creciente sobre los recursos ha contribuido al deterioro del planeta.

La humanidad desarrolla la IA más avanzada jamás creada: capaz de analizar millones de datos, anticipar escenarios y encontrar soluciones imposibles para una mente humana. Sin embargo, carece de creatividad, intuición, empatía y juicio moral. La humanidad conserva esas capacidades, pero necesita la precisión y la potencia de cálculo de la IA.

Ninguna dispone por sí sola de todo lo necesario. Humano e IA deberán encontrar una solución capaz de frenar y revertir la crisis antes de que alcance un punto irreversible. Pueden converger y combinar sus capacidades o evolucionar mediante la rivalidad, incorporando cada una las fortalezas de la otra. De esa tensión nace el **Protocolo NEXO**.

## Portada e introducción

El lema actual de la portada es:

> Un planeta ante un futuro devastador.  
> Dos inteligencias decidirán su destino.  
> Converger o rivalizar.  
> El futuro es ahora.

La introducción conserva una navegación manual de cuatro bloques:

1. Crisis planetaria y presión tecnológica sobre los recursos.
2. Potencia y límites de la Inteligencia Artificial.
3. Capacidades humanas y necesidad de una solución conjunta.
4. Convergencia, Rivalidad y nacimiento del Protocolo NEXO.

El contenido narrativo, el progreso, los botones y la cabecera forman una composición común situada en la zona segura del fondo para mantener visibles las figuras Humano e IA.

## Objetivo

El objetivo no es limitarse a sobrevivir. Humano e IA deben intentar frenar y revertir el deterioro planetario mientras deciden qué relación construir entre ellos.

La partida obliga a equilibrar dos impulsos:

- **Convergencia:** ambos interpretan correctamente la ronda y el planeta se recupera.
- **Rivalidad:** uno se impone, evoluciona y conquista una capacidad del contrario, mientras el perdedor retrocede.

La evolución individual puede proporcionar ventajas, pero no sirve de nada si el planeta colapsa.

## Configuración de partida

Antes de comenzar se puede elegir:

- avatar humano;
- avatar de la IA;
- duración de 8, 12 o 16 rondas;
- modo libre (`∞`).

La selección predeterminada es de 12 rondas.

## Flujo de una ronda

1. Comienza una nueva crisis ecológica.
2. Puede aparecer una carta de crisis que modifica la puntuación de esa ronda.
3. Cada cuatro rondas se activa un evento especial no repetido mientras queden eventos disponibles.
4. La IA selecciona su carta y **declara primero** PAR o IMPAR.
5. El jugador ve esa declaración y elige su propia apuesta y carta.
6. Se revelan las cartas y se calcula la suma.
7. La paridad real se compara con ambas apuestas.
8. Se aplica Convergencia, Rivalidad o Fracaso.
9. La interfaz muestra los cambios de Crisis, evolución y capacidades.
10. El jugador avanza a la siguiente ronda.

La mano contiene las cartas del 1 al 5. Cada carta usada se descarta; al agotarse el ciclo, la mano vuelve a estar disponible.

## Resolución

| Resultado | Condición | Efecto base |
|---|---|---|
| **Convergencia** | Ambos aciertan la paridad | La salud del planeta aumenta en la suma de las cartas. Ninguno evoluciona. |
| **Rivalidad humana** | Solo acierta el jugador | El Humano avanza la suma, la IA retrocede la misma cantidad y el Humano conquista la siguiente capacidad disponible. |
| **Rivalidad IA** | Solo acierta la IA | La IA avanza la suma, el Humano retrocede la misma cantidad y la IA conquista la siguiente capacidad disponible. |
| **Fracaso** | Ninguno acierta | La salud del planeta pierde 3 puntos. |

La evolución nunca baja de 0. La salud del planeta se mantiene entre 0 y 100.

## Crisis del Planeta

Internamente el juego conserva la **salud** del planeta, que comienza en 50 y puede alcanzar un máximo de 100. La interfaz muestra el valor inverso como **Crisis del Planeta**:

- salud 100 = crisis 0 %;
- salud 50 = crisis 50 %;
- salud 0 = crisis 100 % y colapso.

La presentación visual del planeta cambia por tramos conforme aumenta la crisis.

Las ocho crisis narrativas son incendios forestales, contaminación oceánica, sequía prolongada, pérdida de biodiversidad, desertificación, residuos electrónicos, calentamiento global y escasez energética.

## Cartas de crisis

Una carta de crisis aparece aproximadamente en una de cada tres rondas y se revela antes de que el jugador decida:

| Carta | Efecto ejecutable |
|---|---|
| **Energía Renovable** | Duplica la recuperación obtenida por Convergencia. |
| **Economía Circular** | Añade 3 puntos a la recuperación por Convergencia. |
| **Incendio Forestal** | Si no hay Convergencia, añade 3 puntos de daño al planeta. |
| **Sequía** | La suma de las cartas aumenta la crisis, incluso si hay Convergencia. |
| **Punto de Inflexión** | Duplica cualquier cambio del planeta e impide conquistar capacidades. |

## Eventos

Los eventos aparecen cada cuatro rondas y modifican una sola ronda:

| Evento | Efecto ejecutable |
|---|---|
| **Tormenta solar** | Desactiva todas las capacidades conquistadas. |
| **Cumbre de emergencia** | Duplica la recuperación obtenida por Convergencia. |
| **Sobrecarga de datos** | Oculta la pista de Análisis y hace que la carta de la IA valga `+1`. |
| **Chispa creativa** | Revela la carta de la IA antes de apostar. |
| **Punto sin retorno** | Un Fracaso causa 6 puntos de daño en lugar de 3. |

### Discrepancia conocida

El texto interno de **Sobrecarga de datos** afirma que también bloquea Precisión. En V21, el código ejecutable no bloquea el control de Precisión: únicamente bloquea la pista de Análisis y suma `+1` al valor de la carta de la IA. Este README documenta el comportamiento real.

## Capacidades

Las capacidades se conquistan en orden fijo durante una Rivalidad. No existe una pantalla de selección.

### Capacidades de la IA que puede conquistar el Humano

1. **Memoria:** muestra las tres últimas cartas y apuestas de la IA.
2. **Precisión:** permite cambiar la carta una vez por ciclo de mano después de confirmar y antes de revelar.
3. **Análisis predictivo:** muestra si la IA tiende a declarar PAR o IMPAR.
4. **Velocidad:** permite seleccionar dos cartas y elegir cuál de los dos resultados aplicar.

### Capacidades humanas que puede conquistar la IA

1. **Creatividad:** intenta reutilizar una carta y, en ocasiones, una apuesta con la que ya ganó.
2. **Intuición:** cada tres rondas puede cambiar su apuesta en el último momento.
3. **Empatía:** si la salud del planeta baja de 25, revela su carta para favorecer una posible Convergencia.
4. **Adaptación:** después de dos derrotas seguidas, cambia su apuesta respecto a la anterior.

Los avatares tienen cuatro niveles visuales: sin capacidades, con 1–2, con 3 y con las 4 capacidades conquistadas.

## Final de partida

Una partida termina cuando ocurre una de estas condiciones:

- la salud del planeta llega a 0;
- finaliza el número de rondas elegido;
- en modo libre, la salud del planeta llega a 100;
- el jugador abandona la partida.

Los desenlaces se calculan en este orden:

1. **Colapso:** salud del planeta igual a 0.
2. **Convergencia Total:** salud superior a 75 y diferencia entre las evoluciones de Humano e IA igual o inferior a 5.
3. **Supremacía Humana:** el Humano tiene una evolución igual o superior a la IA y no se cumplen las condiciones anteriores.
4. **Supremacía IA:** la IA tiene más evolución y no se cumplen las condiciones anteriores.

La pantalla final muestra también un perfil de evolución calculado a partir de las capacidades conquistadas y el estado del planeta.

## Pantallas

1. **Portada:** identidad de NEXO, lema y acceso al juego.
2. **Introducción:** historia dividida en cuatro bloques, con avance, retroceso y opción de omitir.
3. **Configuración:** nombre, avatares y duración.
4. **Partida:** crisis, declaraciones, cartas, capacidades, evolución y Crisis del Planeta.
5. **Final:** desenlace, perfil y resumen.

Los eventos y la resolución de ronda se muestran como capas o zonas de la partida, no como modos independientes.

## Persistencia y sonido

El navegador utiliza `localStorage` para conservar:

- la mejor marca;
- los perfiles obtenidos;
- el estado de activación del sonido;
- el volumen elegido.

Los datos son locales al navegador y no se envían a ningún servidor.

## Estructura del proyecto

```text
NEXO_v21/
├── index.html
├── css/
│   ├── style.css
│   └── partida.css
├── src/
│   ├── main.ts
│   ├── Partida.ts
│   ├── Jugador.ts
│   ├── ia.ts
│   └── tipos.ts
├── dist/
│   ├── main.js
│   ├── Partida.js
│   ├── Jugador.js
│   ├── ia.js
│   ├── interfaz.js
│   ├── datos.js
│   └── almacenamiento.js
└── assets/
    └── images/
```

`src/` contiene el código fuente principal y `dist/` los módulos JavaScript que ejecuta el navegador.

## Ejecución

Al utilizar módulos JavaScript, conviene abrir el proyecto mediante un servidor local, por ejemplo con la extensión **Live Server** de VS Code. También puede utilizarse:

```bash
python -m http.server 8000
```

Después se abre `http://localhost:8000` en el navegador.

## Tecnologías

- HTML5
- CSS3
- TypeScript
- JavaScript ES Modules
- Web Storage (`localStorage`)

## Alcance de V21

V21 es una versión jugable completa. Las referencias internas a números de versiones anteriores en comentarios o nombres de recursos describen la evolución técnica de determinados elementos visuales; no representan pantallas o modos alternativos activos.
