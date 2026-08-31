# NEXO — La Convergencia

Videojuego de cartas Humano vs IA basado en la mecánica PAR / IMPAR de la Morra y ambientado en una crisis ecológica global.

## Estado actual del proyecto

Este README documenta el comportamiento del juego integrado hasta **V22.37**. Sustituye las descripciones funcionales de versiones anteriores cuando exista alguna diferencia.

La versión actual incluye:

- portada e introducción narrativa en cuatro bloques;
- configuración de nombre, avatar Humano, avatar IA y duración de partida;
- partidas de 8, 12 o 16 rondas y modo libre;
- declaración previa PAR / IMPAR de la IA;
- resultados de **Convergencia, Rivalidad y Fracaso**;
- Crisis del Planeta y evolución reversible de Humano e IA;
- cuatro estados visuales de evolución para cada avatar;
- cinco cartas/modificadores de crisis y cinco eventos especiales;
- ocho fortalezas conquistables con activaciones contextuales;
- Manual / Cómo jugar accesible durante la experiencia;
- avisos visuales diferenciados para modificadores positivos, negativos y mixtos;
- desenlaces y perfiles finales;
- persistencia local de jugadores y preferencias;
- pruebas automáticas con `npm test`.

## Historia

Los primeros años del siglo XXII están marcados por sucesivas crisis ecológicas que amenazan la supervivencia del planeta y, con ella, la existencia de la humanidad y de la Inteligencia Artificial.

La integración de la tecnología y la IA ha mejorado profundamente la vida humana, pero también ha incrementado la demanda de energía, agua, minerales e infraestructuras. Esa presión creciente sobre los recursos ha contribuido al deterioro del planeta.

La humanidad desarrolla una IA capaz de analizar enormes cantidades de datos, anticipar escenarios y encontrar soluciones imposibles para una sola mente humana. Sin embargo, carece de capacidades como creatividad, intuición, empatía y adaptación humana. La humanidad conserva esas fortalezas, pero necesita la memoria, precisión, análisis y velocidad de procesamiento de la IA.

Ninguna dispone por sí sola de todo lo necesario. Humano e IA deberán encontrar una solución capaz de frenar la crisis antes de que alcance un punto irreversible. Pueden converger y combinar sus capacidades o rivalizar y conquistar las fortalezas del contrario. De esa tensión nace el **Protocolo NEXO**.

## Objetivo

El objetivo es mantener al planeta con vida mientras Humano e IA evolucionan y deciden qué relación construir.

- **Convergencia:** ambos aciertan la paridad de la suma y la Crisis del Planeta mejora según las reglas de la ronda.
- **Rivalidad:** solo uno acierta; el vencedor evoluciona y puede conquistar una fortaleza del contrario.
- **Fracaso:** ninguno acierta; la Crisis del Planeta empeora.

La evolución individual puede proporcionar ventajas, pero no sirve de nada si el planeta colapsa.

## Configuración de partida

Antes de comenzar se puede elegir:

- nombre del jugador;
- avatar Humano;
- avatar de la IA;
- duración de 8, 12 o 16 rondas;
- modo libre (`∞`).

La selección predeterminada es de 12 rondas.

## Flujo de una ronda

1. Se presenta una crisis ecológica.
2. Puede aparecer una carta de crisis que modifica las reglas de esa ronda.
3. Cada cuatro rondas puede activarse un evento especial.
4. La IA selecciona su carta y declara primero PAR o IMPAR.
5. El jugador ve esa declaración y elige su apuesta y carta.
6. Las fortalezas disponibles pueden aportar información o alterar la decisión cuando cumplen su condición de activación.
7. Se revelan las cartas y se calcula la suma.
8. Se resuelve Convergencia, Rivalidad o Fracaso.
9. Se actualizan Crisis del Planeta, evolución y fortalezas conquistadas.
10. Se muestra el panel de resolución y se avanza a la siguiente ronda.

La mano contiene cartas del 1 al 5. Las cartas usadas se descartan y se recuperan al comenzar un nuevo ciclo de mano.

## Resolución base

| Resultado | Condición | Efecto base |
|---|---|---|
| **Convergencia** | Humano e IA aciertan la paridad | La Crisis del Planeta se reduce según la suma de las cartas, salvo que un modificador indique otra cosa. |
| **Rivalidad humana** | Solo acierta el Humano | El Humano evoluciona, la IA retrocede y el Humano puede conquistar la siguiente fortaleza IA disponible. |
| **Rivalidad IA** | Solo acierta la IA | La IA evoluciona, el Humano retrocede y la IA puede conquistar la siguiente fortaleza humana disponible. |
| **Fracaso** | Ninguno acierta | La Crisis del Planeta aumenta 3 puntos, salvo modificadores o eventos. |

Los porcentajes se mantienen dentro de sus límites válidos.

## Crisis del Planeta

El juego conserva internamente la salud del planeta y la interfaz la presenta como **Crisis del Planeta**:

- salud 100 = crisis 0 %;
- salud 50 = crisis 50 %;
- salud 0 = crisis 100 % y colapso.

Las ocho crisis narrativas son:

- Incendios forestales
- Contaminación oceánica
- Sequía prolongada
- Pérdida de biodiversidad
- Desertificación
- Residuos electrónicos
- Calentamiento global
- Escasez energética

### Evolución visual del planeta

La pantalla de partida utiliza un fondo completo por cada tramo de Crisis. Así, el deterioro del planeta se entiende de forma inmediata y no depende de superponer capas visuales.

La partida y la pantalla final usan **dos series deliberadamente distintas** porque cumplen funciones visuales diferentes:

- durante la partida se conserva la **esfera/núcleo NEXO integrada en el escenario**, ya que desde su centro nace el feedback visual de Convergencia;
- en la pantalla final se emplean composiciones más abiertas, sin una esfera flotante protagonista, para que el paisaje y el estado del mundo sean el cierre emocional.

Assets de partida:

- `assets/images/partida/fondos-planeta/partida-planeta-0-24-equilibrio-saludable.webp`
- `assets/images/partida/fondos-planeta/partida-planeta-25-49-equilibrio-fragil.webp`
- `assets/images/partida/fondos-planeta/partida-planeta-50-74-equilibrio-critico.webp`
- `assets/images/partida/fondos-planeta/partida-planeta-75-99-colapso-inminente.webp`
- `assets/images/partida/fondos-planeta/partida-planeta-100-crisis-catastrofica.webp`

La evolución usa **un fondo completo por estado**, nunca capas superpuestas ni filtros de color que intenten simular el deterioro. La degradación está dibujada en los propios assets y el cambio es reversible al subir o bajar la Crisis.

Los cinco estados visuales del planeta se precargan al abrir la página para evitar interrupciones durante los cambios de Crisis. Durante la partida, el fondo principal mantiene la imagen anterior hasta que el nuevo asset termina de cargar, evitando huecos negros al cruzar de un estado visual a otro.

## Cartas de crisis / modificadores

Una carta de crisis puede aparecer antes de que el jugador tome su decisión:

| Carta | Tipo | Efecto ejecutable |
|---|---|---|
| **Energía Renovable** | Positiva | Duplica la reducción de Crisis obtenida por Convergencia. |
| **Economía Circular** | Positiva | Añade 3 puntos extra a la reducción de Crisis por Convergencia. |
| **Incendio Forestal** | Negativa | Si no hay Convergencia, la Crisis aumenta 3 puntos adicionales. |
| **Sequía** | Negativa | La suma de las cartas aumenta la Crisis incluso si hay Convergencia. |
| **Punto de Inflexión** | Mixta | Duplica cualquier cambio de Crisis e impide conquistar fortalezas esa ronda. |

### Aviso visual de modificadores — V22.37

El panel **IMPACTO EN ESTA RONDA** cambia de jerarquía visual según el tipo de modificador:

- **Negativo:** borde y halo rojo, con varios pulsos de entrada para atraer la atención.
- **Positivo:** halo verde/cian más suave.
- **Mixto:** halo ámbar/naranja.

El efecto de entrada no es continuo y respeta `prefers-reduced-motion`.

## Eventos especiales

Los eventos aparecen cada cuatro rondas y afectan a una sola ronda:

| Evento | Efecto ejecutable |
|---|---|
| **Tormenta solar** | Desactiva temporalmente las fortalezas conquistadas. |
| **Cumbre de emergencia** | Duplica la reducción de Crisis obtenida por Convergencia. |
| **Sobrecarga de datos** | Bloquea Análisis y Precisión y hace que la carta IA cuente `+1` en la suma. |
| **Chispa creativa** | Revela la carta de la IA antes de apostar. |
| **Punto sin retorno** | Un Fracaso aumenta la Crisis 6 puntos en lugar de 3. |

## Fortalezas conquistables

Las fortalezas se conquistan en orden durante una Rivalidad. No se seleccionan manualmente.

### Regla de interfaz: ADQUIRIDA ≠ ACTIVA

Una fortaleza conquistada permanece disponible durante la partida, pero **el aviso grande de activación solo debe aparecer cuando esa fortaleza está interviniendo realmente en la ronda**.

Los laterales utilizan títulos inequívocos:

- panel Humano: **CONQUISTADAS POR EL HUMANO**;
- panel IA: **CONQUISTADAS POR LA IA**.

Los avisos contextuales aparecen en el lateral del jugador que posee actualmente la fortaleza, aunque la información obtenida se refiera al rival. Las fortalezas que requieren una decisión directa del jugador, como Precisión, pueden utilizar además un panel central de interacción.

### Fortalezas IA que puede conquistar el Humano

1. **Memoria**  
   Conserva un registro de las últimas jugadas de la IA y permite consultar sus apuestas y cartas recientes. El registro puede permanecer disponible, pero no se presenta permanentemente como una activación nueva.

2. **Precisión**  
   Una vez por ciclo de mano, después de confirmar la jugada, revela **la carta real de la IA**, no su apuesta PAR/IMPAR. La carta IA queda fijada para esa resolución y el jugador puede:
   - mantener su carta original;
   - corregirla antes de resolver.

3. **Análisis predictivo**  
   Analiza las cartas que todavía puede jugar la IA y recomienda una opción para buscar Convergencia y otra para buscar Rivalidad. El dato mostrado representa **combinaciones posibles**, no una probabilidad estadística sobre la conducta futura de la IA.

4. **Velocidad**  
   Permite seleccionar **dos cartas**. NEXO compara los resultados que producirían ambas opciones y aplica automáticamente la más beneficiosa para el Humano teniendo en cuenta los cambios reales de evolución y Crisis de la ronda. Las dos cartas seleccionadas se descartan.

### Fortalezas humanas que puede conquistar la IA

1. **Creatividad**  
   Tras **dos derrotas consecutivas frente al Humano**, la IA rompe su patrón y cambia su apuesta respecto a la anterior. Un Fracaso no cuenta como derrota frente al Humano.

2. **Intuición**  
   Aproximadamente cada tres rondas, la IA utiliza la elección humana como pista. Si existe una carta disponible que mejora el ajuste a la apuesta que ya había declarado, puede sustituir su carta. El aviso aparece solo si realmente se produce el ajuste.

3. **Empatía**  
   Cuando el planeta entra en una situación crítica, la IA revela su carta para favorecer que el Humano pueda buscar una posible Convergencia. No fuerza automáticamente la Convergencia.

4. **Adaptación**  
   Si dispone de ella, la IA recupera y reutiliza una carta con la que anteriormente consiguió una victoria, aprovechando una opción que ya funcionó.

## Evolución visual de los avatares

Existen cuatro personajes base:

- Humano hombre → IA
- Humano mujer → IA
- IA femenina → Humano
- IA masculina → Humano

Cada personaje tiene cuatro estados visuales reversibles:

- 0–24 %
- 25–49 %
- 50–74 %
- 75–100 %

La evolución representa **hibridación**, no sustitución completa de identidad: incluso en 75–100 %, Humano e IA conservan rasgos reconocibles de su origen. En la IA femenina, los estados 25–49 % y 50–74 % se han diferenciado visualmente para que el primer tramo siga siendo claramente artificial y el segundo muestre una convergencia humano–IA más avanzada.

La evolución se representa mediante assets WebP específicos; no depende de filtros, halos o transformaciones CSS para simular el cambio del personaje.

Los 16 retratos se encuentran en:

`assets/images/partida/avatares-evolucion/`

Cuando la barra sube o baja y cruza un umbral, se muestra el asset correspondiente al tramo actual.

## Manual / Cómo jugar

El juego incorpora un manual independiente para evitar sobrecargar la introducción narrativa. Puede consultarse desde la experiencia y explica:

- objetivo general;
- flujo de ronda;
- PAR / IMPAR;
- Convergencia, Rivalidad y Fracaso;
- ocho fortalezas;
- cartas de crisis;
- eventos especiales;
- condiciones de final de partida.

## Final de partida

Una partida termina cuando ocurre alguna de estas condiciones:

El número de rondas elegido representa la **duración máxima**, no una obligación de llegar hasta la última ronda.

- **Crisis 100%:** el planeta colapsa y la derrota es inmediata;
- **Crisis 0%:** el planeta alcanza la recuperación completa y la partida termina de forma anticipada en cualquier modalidad;
- si ninguno de esos extremos ocurre, finaliza al agotarse el número de rondas elegido;
- en modo libre se continúa hasta recuperación completa, colapso o abandono;
- el jugador abandona la partida.

Cuando la Crisis llega a 0%, la resolución se convierte en un momento de cierre: aparece **PLANETA RECUPERADO** y el botón **DESCUBRIR EL DESENLACE**. El desenlace posterior sigue valorando el equilibrio de evolución entre Humano e IA: recuperar el planeta no implica necesariamente que ambos hayan evolucionado de forma equilibrada.

La pantalla final se ha rediseñado para que el planeta tenga la mayor jerarquía narrativa. El título principal describe el estado final del mundo y el desenlace Humano/IA aparece como resultado secundario:

- **0% Crisis:** `PLANETA RECUPERADO` + `OBJETIVO DEL PROTOCOLO NEXO ALCANZADO`;
- **1–24% Crisis:** `EQUILIBRIO RESTABLECIDO`;
- **25–49% Crisis:** `EQUILIBRIO FRÁGIL`;
- **50–74% Crisis:** `EQUILIBRIO CRÍTICO`;
- **75–99% Crisis:** `COLAPSO INMINENTE`;
- **100% Crisis:** `COLAPSO PLANETARIO`.

La pantalla final usa una **serie propia de cinco fondos** preparada para el epílogo. No reutiliza los fondos de partida porque en el cierre la esfera central resultaba repetitiva y competía con el mensaje final. La progresión visual sigue el mismo orden de Crisis —verde/azul limpio → pérdida de vitalidad → gris/ocre y humo → tonos cálidos de colapso → rojo/fuego en la catástrofe—, pero con composiciones más abiertas y emocionales.

Assets de la pantalla final:

- `assets/images/final/fondos/final-planeta-0-24-equilibrio-saludable.webp`
- `assets/images/final/fondos/final-planeta-25-49-equilibrio-fragil.webp`
- `assets/images/final/fondos/final-planeta-50-74-equilibrio-critico.webp`
- `assets/images/final/fondos/final-planeta-75-99-colapso-inminente.webp`
- `assets/images/final/fondos/final-planeta-100-crisis-catastrofica.webp`

Los paneles finales son holográficos y translúcidos, con esquinas técnicas y líneas de luz, de manera que el escenario siga siendo protagonista. El resumen numérico se presenta como una sola franja de lectura y las capacidades dejan de comportarse como tarjetas de dashboard independientes.

El logo de la pantalla final reutiliza el asset oficial de portada `nexo-logo-completo-x-estatica-v7.webp`. El nombre del jugador se muestra de forma explícita junto al perfil alcanzado. Las capacidades conquistadas, el balance Humano/IA, las rondas y la Crisis final se mantienen, pero se presentan mediante paneles y líneas holográficas translúcidas, dejando visible el mundo final y evitando el antiguo bloque tipo dashboard.

Los desenlaces secundarios contemplan:

1. **Colapso**
2. **Convergencia Total**
3. **Supremacía Humana**
4. **Supremacía IA**
5. **Equilibrio inestable**

La pantalla final muestra también un perfil de evolución relacionado con fortalezas conquistadas y estado del planeta.

## Persistencia y sonido

El navegador utiliza `localStorage` para conservar información local como:

- jugadores creados;
- mejor marca de cada jugador;
- perfiles obtenidos;
- estado del sonido;
- volumen.

Los datos permanecen en el navegador y no se envían a ningún servidor.

La estructura actual incluye una migración para guardados anteriores y mantiene identificadores internos independientes del nombre visible del jugador.

## Estructura principal del proyecto

```text
NEXO_La_convergencia_cris/
├── index.html
├── css/
│   ├── style.css
│   └── partida.css
├── src/
│   ├── Carta.ts
│   ├── Jugador.ts
│   ├── Partida.ts
│   ├── ia.ts
│   ├── tipos.ts
│   ├── main.ts
│   └── efecto-energia-esfera.js
├── dist/
│   ├── main.js
│   ├── Carta.js
│   ├── Jugador.js
│   ├── Partida.js
│   ├── ia.js
│   ├── tipos.js
│   ├── Evento.js
│   ├── interfaz.js
│   ├── datos.js
│   └── almacenamiento.js
├── tests/
│   ├── functional.mjs
│   ├── fortalezas.mjs
│   ├── player-storage.mjs
│   └── player-migration.mjs
├── assets/
│   ├── audio/
│   └── images/
├── package.json
├── package-lock.json
└── tsconfig.json
```

`dist/` contiene los módulos JavaScript que ejecuta actualmente el navegador. Parte de la arquitectura mantiene archivos fuente TypeScript en `src/`, por lo que los cambios funcionales deben mantener sincronizados los archivos correspondientes cuando proceda.

## Ejecución local

Puede abrirse con **Live Server** desde VS Code, que es el flujo de trabajo utilizado en el proyecto.

## Pruebas

Ejecutar:

```bash
npm test
```

Actualmente se ejecutan cuatro grupos de pruebas:

1. `tests/functional.mjs` — comprobaciones funcionales principales.
2. `tests/fortalezas.mjs` — lógica y coherencia de las ocho fortalezas.
3. `tests/player-storage.mjs` — progreso independiente de jugadores.
4. `tests/player-migration.mjs` — migración de guardados anteriores.

Antes de realizar un commit importante conviene ejecutar `npm test` y comprobar manualmente en navegador los cambios visuales o de interacción.

## Tecnologías

- HTML5
- CSS3
- TypeScript
- JavaScript ES Modules
- Web Storage (`localStorage`)
- Node.js únicamente para scripts de prueba/desarrollo

## Estado de trabajo tras V22.37

La versión documentada incorpora las mejoras acumuladas de avatares evolutivos, fortalezas, manual, Precisión, Velocidad, organización de avisos por propietario y alertas visuales de modificadores.

Los próximos cambios artísticos del planeta pueden desarrollarse como una fase independiente para poder versionarlos en Git mediante commits específicos sin mezclar de nuevo lógica, interfaz y assets.

### Corrección de interacción — Resolver ronda

Se ha reforzado el botón `RESOLVER RONDA` para que una jugada completa no pueda quedar en un estado visual habilitado sin respuesta. Cuando `Precisión` está disponible, el botón indica `ACTIVAR PRECISIÓN`; en el resto de casos resuelve la ronda normalmente. También se ha elevado la prioridad de interacción del botón para evitar que una capa visual de cartas intercepte el clic.
