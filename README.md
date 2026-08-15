# NEXO_La_convergencia
Juego de cartas Humano vs IA basado en la Morra, desarrollo con TypeScript
NEXO
LA CONVERGENCIA
Dos inteligencias · Un planeta · Una misma evolución
Documento de diseño de la propuesta fusionada
Videojuego de cartas basado en la mecánica tradicional de la Morra (PAR / IMPAR)
Agosto 2026
 
Índice
1. Qué es este documento
2. Diagnóstico: qué funcionaba y qué fallaba en cada propuesta
3. La idea que une los dos proyectos
4. Concepto central y frase de presentación
5. Historia y ambientación
6. Los dos bandos y sus capacidades
7. La Morra convertida en juego de cartas
8. Estructura de una ronda
9. El triple marcador: el corazón de la fusión
10. Cartas de crisis (efectos sobre la ronda)
11. Capacidades conquistadas: poderes que sí cambian la partida
12. Eventos especiales
13. Evolución visual: avatares y planeta
14. Finales y perfiles de evolución
15. Pantallas del juego
16. Qué programaremos realmente (nivel del curso)
17. Programación Orientada a Objetos: cuatro clases
18. Desarrollo por fases
19. Qué se ha descartado y por qué
20. Argumentario para la defensa
21. Nombre, lema y alcance recomendado
 
1. Qué es este documento
Este documento no es una tercera propuesta distinta de las dos anteriores. Es la fusión razonada de NEXO y de HumanIA: La Convergencia, construida tomando de cada una exactamente lo que la hacía fuerte y eliminando lo que la hacía frágil.
El punto de partida se mantiene intacto: la mecánica tradicional de la Morra —dos participantes eligen un número, se suman y se comprueba si el resultado es PAR o IMPAR— adaptada a un juego de cartas en pantalla. Todo lo que se añade encima existe para dar profundidad a esa mecánica, nunca para sustituirla.
El segundo límite es igual de firme: todo lo descrito aquí debe poder programarse con lo aprendido en el curso. Variables, arrays, objetos, funciones, condicionales, Math.random(), eventos de click, manipulación del DOM y clases sencillas. No aparece en este diseño ni una sola función que exija conocimientos que no tengamos.
Regla de oro de este diseño: si una idea no se puede programar con un if, un array y un cambio de imagen, la idea se simplifica o se descarta. La ambición está en el concepto, no en la dificultad técnica.
2. Diagnóstico: qué funcionaba y qué fallaba en cada propuesta
Antes de fusionar hay que ser honestos con los dos documentos originales. Cada uno resolvía bien una mitad del problema y dejaba la otra mitad sin resolver.
Lo que NEXO hacía mejor
•	La mecánica de Morra estaba clara, limpia y bien explicada: elegir número, sumar, comprobar PAR/IMPAR.
•	La temática ecológica daba un porqué al juego. No era decoración: las crisis del planeta eran el motivo del enfrentamiento.
•	La dualidad conceptual (cooperar o competir) era la mejor idea de las dos propuestas.
•	El mensaje era propio y difícil de encontrar en el mercado.
Lo que NEXO no resolvía
•	Dos modos separados significan, en la práctica, programar dos juegos. Duplica el trabajo y multiplica el riesgo de llegar a la defensa con uno de los dos a medias.
•	Las cartas solo sumaban o restaban puntos. No cambiaban nada de la partida.
•	Humanidad e IA eran conceptos abstractos, no personajes. No había nada a lo que agarrarse emocionalmente.
•	El jugador no tenía decisiones interesantes: elegía un número y esperaba.
Lo que HumanIA hacía mejor
•	Los poderes conquistados cambiaban de verdad las posibilidades de juego. Esa era su mejor aportación.
•	La evolución visual progresiva de los personajes convertía el progreso en algo que se ve, no solo en un número.
•	Los perfiles finales hacían que cada partida contase una historia ligeramente distinta.
•	Los eventos especiales rompían la monotonía de las rondas.
•	El alcance técnico estaba medido con realismo.
Lo que HumanIA no resolvía
•	Perdía la Morra. El reparto de energía es una mecánica distinta y menos original.
•	No había un porqué: humano e IA competían, pero nada explicaba qué estaba en juego más allá de ellos mismos.
•	El tema «la IA quiere ser humana» está muy explorado y sonaba a idea vista.
•	Al desaparecer la cooperación, desaparecía la mitad más interesante del planteamiento.
Conclusión del diagnóstico: NEXO tenía el alma del proyecto y HumanIA tenía el cuerpo. La fusión consiste en meter el alma de NEXO dentro del cuerpo de HumanIA.
 
3. La idea que une los dos proyectos
El error de la propuesta original de NEXO fue tratar la cooperación y la competición como dos modos de juego separados. La fusión parte de la idea contraria y de ahí sale todo lo demás:
Cooperar y competir no son dos modos distintos. Son dos resultados posibles de la misma jugada. En cada ronda, según lo que hagan el jugador y la IA, la partida se inclina hacia la convergencia o hacia la rivalidad, y ambas cosas tienen consecuencias sobre el planeta.
Traducido a la mecánica de la Morra: los dos participantes no solo eligen un número, también apuestan si la suma será PAR o IMPAR. Lo interesante es lo que ocurre al comparar las dos apuestas.
Resultado de la ronda	Qué significa	Consecuencia
Los dos aciertan su apuesta	CONVERGENCIA: humano e IA han leído la situación igual y han actuado juntos	El planeta se recupera. Ninguno de los dos evoluciona.
Solo acierta uno de los dos	RIVALIDAD: uno se ha impuesto al otro	El que acierta gana puntos de evolución y conquista una capacidad del rival. El planeta no mejora.
No acierta ninguno	FRACASO: nadie ha entendido la crisis	Baja la Salud del Planeta.

Esto genera exactamente la tensión que ninguna de las dos propuestas tenía por separado. El jugador quiere ganar —quiere evolucionar, conquistar capacidades, terminar la partida siendo más completo que la IA— pero cada vez que gana en solitario el planeta se queda igual. Y si la Salud del Planeta se agota, la partida termina en colapso y pierden los dos, por muchos puntos de evolución que haya acumulado.
El jugador tiene que decidir, ronda a ronda, si juega para imponerse o si juega para coincidir. Esa decisión es el juego. Y, además, es exactamente el mensaje del proyecto: la ambición individual y la supervivencia colectiva no siempre apuntan en la misma dirección.
De dónde viene cada pieza
Elemento de la fusión	Procedencia
Mecánica de la Morra con cartas y apuesta PAR/IMPAR	NEXO (ampliada con la apuesta doble)
Contexto y crisis ecológicas	NEXO
Barra del estado del planeta y colapso compartido	NEXO
Cartas de crisis que modifican la puntuación	NEXO
Capacidades conquistadas con efecto jugable real	HumanIA
Evolución visual progresiva de los personajes	HumanIA
Eventos especiales cada varias rondas	HumanIA
Perfiles de evolución y porcentaje final	HumanIA
Modo único en lugar de dos modos separados	Decisión nueva de la fusión
Triple marcador (Humano / IA / Planeta)	Decisión nueva de la fusión
 
4. Concepto central y frase de presentación
NEXO: La Convergencia es un juego de cartas por rondas para un jugador contra la máquina, basado en la Morra. Humano e IA se enfrentan mientras el planeta atraviesa una crisis ecológica. Cada ronda es una crisis concreta que hay que resolver, y la forma de resolverla determina tres cosas a la vez: cuánto evoluciona el jugador, cuánto evoluciona la IA y en qué estado queda el planeta.
«Humano e IA compiten por apropiarse de las capacidades del contrario mientras el planeta se apaga a su alrededor. Cada carta jugada decide si te impones a tu rival o si os salváis juntos. Nadie gana en un mundo muerto.»
Esa última frase es la que resume el proyecto en la defensa, y es la que ninguna de las dos propuestas originales podía decir.
Nomenclatura interna
Las dos fuerzas que tiran de la partida conservan los nombres que ya habíamos elegido, pero ahora conviven dentro de una sola partida en lugar de ser dos modos:
•	HumanIA — la vía de la convergencia. Se activa cuando ambos aciertan. Cura el planeta.
•	RivalIA — la vía de la evolución. Se activa cuando solo acierta uno. Reparte capacidades y puntos.
Mantener los dos nombres permite conservar el trabajo conceptual y visual ya hecho, y da al jugador dos palabras claras para entender qué acaba de pasar en cada ronda.
5. Historia y ambientación
Primeros años del siglo XXII. Las crisis ecológicas se han encadenado hasta amenazar la supervivencia del planeta y, con ella, la de la humanidad y la de la inteligencia artificial que la humanidad creó para salvarse.
Esa IA es capaz de analizar millones de datos por segundo, pero carece de creatividad, intuición, empatía y juicio moral. La humanidad conserva todo eso, pero no tiene la precisión ni la potencia de cálculo necesarias para problemas de esta escala. Ninguna de las dos, por separado, puede resolver la situación.
Se pone en marcha el protocolo NEXO: una serie de crisis simuladas en las que humano e IA deben responder simultáneamente. El protocolo tenía que servir para aprender a colaborar. Pero cada vez que uno de los dos acierta y el otro falla, el que acierta absorbe una capacidad del que ha fallado. Y esa recompensa es difícil de resistir.
Así, lo que nació como un ejercicio de cooperación se ha convertido en algo ambiguo: cada ronda es a la vez una oportunidad de salvar el mundo y una oportunidad de superar al otro. El planeta, mientras tanto, no espera.
Nota de diseño: esta historia justifica de forma natural las tres cosas que necesitamos que ocurran en la mecánica —la apuesta simultánea, la conquista de capacidades y la degradación del planeta— sin necesidad de escribir cinemáticas ni diálogos largos. Todo el contexto cabe en la pantalla de introducción.
 
6. Los dos bandos y sus capacidades
Cada bando empieza con cuatro capacidades propias que nunca pierde. Lo que está en juego durante la partida son las cuatro capacidades del contrario.
HUMANO (capacidades propias)	INTELIGENCIA ARTIFICIAL (capacidades propias)
Creatividad	Memoria
Empatía	Precisión y cálculo
Intuición	Análisis predictivo
Adaptación	Velocidad de proceso

La lista se ha reducido deliberadamente a cuatro por bando. Las propuestas originales manejaban hasta seis fortalezas humanas y seis de la IA, lo que obligaba a programar demasiados casos distintos y hacía imposible que el jugador las recordase todas. Con cuatro por bando tenemos ocho capacidades conquistables en total: suficientes para que cada partida sea diferente y pocas para que se puedan explicar en treinta segundos durante la defensa.
7. La Morra convertida en juego de cartas
Este es el apartado que no puede perderse de vista en ningún momento. Todo lo demás está construido encima de esto.
La mano de cartas
•	El jugador dispone de una mano de cinco cartas numeradas del 1 al 5. La IA tiene su propia mano idéntica.
•	Cada carta jugada se descarta y no vuelve a estar disponible hasta que se agota la mano completa.
•	Cuando se agotan las cinco cartas, la mano se reinicia y vuelven a estar todas disponibles.
Este detalle, que cuesta cuatro líneas de código con un array, transforma la Morra en un juego con memoria y estrategia: en la quinta ronda de cada ciclo, ambos saben exactamente qué carta le queda al otro. La partida tiene picos de tensión sin que hayamos añadido ninguna regla compleja.
La apuesta
Antes de revelar, cada uno declara si cree que la suma de las dos cartas será PAR o IMPAR. Esta es la aportación clave de la fusión sobre la Morra original: en NEXO el juego decidía aleatoriamente si hacía falta PAR o IMPAR; aquí lo decide cada participante, y esa diferencia es la que permite que existan la convergencia y la rivalidad como resultados distintos.
La resolución
1.	Se suman las dos cartas.
2.	Se comprueba si la suma es PAR o IMPAR.
3.	Se compara el resultado con la apuesta del jugador y con la apuesta de la IA.
4.	Según quién haya acertado, se aplica CONVERGENCIA, RIVALIDAD o FRACASO.
En código esto es una suma, un módulo y tres condicionales. Nada más. La profundidad no está en la dificultad del cálculo, está en lo que el resultado significa.
 
8. Estructura de una ronda
5.	Aparece la crisis ecológica de la ronda (incendios forestales, contaminación oceánica, sequía, pérdida de biodiversidad, desertificación, residuos electrónicos, calentamiento global o escasez energética).
6.	Si corresponde, se revela una carta de crisis que modificará la puntuación de esta ronda.
7.	El jugador declara su apuesta: PAR o IMPAR.
8.	El jugador elige una carta de su mano (1 a 5) y confirma.
9.	La IA elige su apuesta y su carta.
10.	Se revelan ambas cartas y se muestra la suma.
11.	Se resuelve: CONVERGENCIA, RIVALIDAD o FRACASO.
12.	Se aplican los efectos de las capacidades activas y de la carta de crisis.
13.	Se actualizan los tres marcadores y, si procede, la evolución visual.
14.	Cada cuatro rondas, antes de la siguiente, se dispara un evento especial.
El flujo es lineal y siempre el mismo. Eso significa una sola función principal de ronda y una sola pantalla de juego. Aquí es donde la fusión ahorra la mitad del trabajo respecto a NEXO original, que exigía dos flujos completos.
9. El triple marcador: el corazón de la fusión
En pantalla hay tres barras visibles en todo momento. Las tres se alimentan de la misma jugada, y esa es la razón por la que el juego funciona.
Marcador	Sube cuando…	Qué representa
EVOLUCIÓN HUMANA	Solo acierta el jugador	Cuánto se ha impuesto el humano y cuántas capacidades de la IA ha absorbido
EVOLUCIÓN IA	Solo acierta la IA	Cuánto se ha impuesto la IA y cuántas capacidades humanas ha absorbido
SALUD DEL PLANETA	Aciertan los dos (convergencia)	El estado del mundo. Baja con cada FRACASO. Si llega a cero, colapso

Puntuación concreta
•	CONVERGENCIA (aciertan los dos): la Salud del Planeta sube tantos puntos como la suma de las dos cartas. Nadie gana puntos de evolución.
•	RIVALIDAD (acierta uno): el que acierta suma la suma de las dos cartas a su barra de evolución y conquista una capacidad del rival. La Salud del Planeta no cambia.
•	FRACASO (no acierta ninguno): la Salud del Planeta baja 3 puntos.
La Salud del Planeta empieza en 30 sobre 60. Puede subir hasta 60 o bajar hasta 0. Esta cifra concreta habrá que ajustarla probando, pero el rango está pensado para que una partida de doce rondas pueda terminar en cualquiera de los finales según cómo se juegue.
Por qué esto obliga a pensar
Si el jugador juega siempre a imponerse, subirá su evolución pero el planeta se irá vaciando entre fracasos, y acabará perdiendo por colapso. Si juega siempre a converger, el planeta estará espléndido pero terminará la partida sin capacidades conquistadas y con menos evolución que la IA. El juego consiste en encontrar el punto intermedio, y ese punto cambia según cómo esté yendo la partida.
Esta es la respuesta a la crítica más seria que se le podía hacer a las dos propuestas originales: en ninguna de las dos el jugador tomaba una decisión difícil. Aquí la toma en cada ronda, y la mecánica sigue siendo exactamente la Morra.
 
10. Cartas de crisis (efectos sobre la ronda)
Se conservan de NEXO porque funcionaban, pero se reduce el número y se unifican para un solo modo. Aparecen de forma aleatoria en aproximadamente una de cada tres rondas, y se revelan antes de que el jugador apueste, para que pueda tenerlas en cuenta al decidir.
Carta	Efecto	Tipo
Energía Renovable	Duplica los puntos que se repartan esta ronda, sea a la evolución o al planeta	Positiva
Economía Circular	Añade 3 puntos extra al resultado de esta ronda	Positiva
Incendio Forestal	La Salud del Planeta baja 3 puntos adicionales si la ronda no termina en convergencia	Negativa
Sequía	Los puntos de esta ronda, en lugar de sumarse, se restan a la Salud del Planeta	Negativa
Punto de Inflexión	Esta ronda vale doble para el planeta pero nadie puede conquistar capacidades	Mixta

Las cuatro primeras vienen directamente de NEXO. La quinta es nueva y existe para crear rondas en las que converger es objetivamente la mejor jugada, lo que rompe la rutina y da al jugador un respiro estratégico.
Programación: un array de objetos con nombre, descripción, tipo y un identificador; un Math.random() para decidir si aparece y cuál; y un condicional en el cálculo de puntos.
11. Capacidades conquistadas: poderes que sí cambian la partida
Esta es la mejor idea que aportaba HumanIA y se conserva íntegra. Cuando alguien gana una ronda por RIVALIDAD, conquista una capacidad del rival que todavía no posea, en un orden fijo y establecido. No se elige: así evitamos programar una pantalla de selección y el jugador aprende el orden, lo que le permite planificar.
Capacidades que puede conquistar el jugador (de la IA)
Capacidad	Efecto jugable
Memoria	Muestra las tres últimas apuestas y cartas de la IA en un panel lateral
Precisión	Una vez por ciclo de mano, permite cambiar la carta elegida después de confirmar
Análisis predictivo	Antes de apostar, muestra una pista sobre si la IA tiende a PAR o a IMPAR
Velocidad	Permite jugar dos cartas en una ronda y quedarse con el resultado que prefiera

Capacidades que puede conquistar la IA (del humano)
Capacidad	Efecto jugable
Creatividad	La IA deja de elegir carta al azar y empieza a repetir patrones que le funcionaron
Intuición	La IA acierta la apuesta del jugador una vez cada cierto número de rondas
Empatía	La IA busca activamente la convergencia cuando el planeta está en peligro
Adaptación	Tras dos derrotas seguidas, la IA cambia su apuesta a la contraria de la anterior

Detalle importante: cuando la IA conquista Empatía se vuelve colaboradora, no más agresiva. Es decir, que la IA gane rondas no siempre perjudica al jugador. Esa ambigüedad es coherente con el mensaje del juego y hace que el final sea menos predecible.
Programación: cada capacidad es un booleano dentro del objeto del jugador o de la IA. El efecto es un if que se consulta en el momento adecuado del flujo de ronda. Ocho booleanos y ocho condicionales, sin herencias ni estructuras avanzadas.
 
12. Eventos especiales
Cada cuatro rondas se dispara un evento que altera temporalmente las reglas durante una sola ronda. Se toman de HumanIA y se reescriben para que encajen con la temática ecológica, que es lo que allí faltaba.
Evento	Efecto durante esa ronda
Tormenta solar	Ninguno de los dos puede usar las capacidades conquistadas
Cumbre de emergencia	Si la ronda termina en convergencia, el planeta recupera el doble
Sobrecarga de datos	La IA no puede usar Análisis ni Precisión, pero sus cartas valen +1
Chispa creativa	El jugador ve la carta de la IA antes de apostar, pero no su apuesta
Punto sin retorno	Si la ronda termina en fracaso, el planeta pierde 6 puntos en lugar de 3

Cinco eventos son suficientes. En una partida de doce rondas se verán tres, así que ni siquiera se repiten. Programación: array de objetos y un contador de rondas con un módulo.
13. Evolución visual: avatares y planeta
Aquí es donde la fusión gana más respecto a las dos propuestas por separado, porque ahora hay tres cosas que evolucionan visualmente al mismo tiempo y las tres cuentan la misma historia.
El avatar humano
Cambia según el número de capacidades de la IA que haya conquistado: 0 capacidades, aspecto plenamente humano; 1-2, aparecen detalles tecnológicos discretos; 3, elementos claramente artificiales; 4, forma híbrida completa.
El avatar de la IA
Recorre el camino inverso: de forma geométrica y fría a rasgos orgánicos y expresivos según conquista capacidades humanas.
El planeta
El fondo de la pantalla de juego cambia según la barra de Salud del Planeta, en cuatro estados: crítico, deteriorado, estable y recuperado. Es lo que NEXO ya proponía, pero ahora aplicado a un solo modo y por tanto la mitad de trabajo.
Todo esto se resuelve con imágenes en capas y un cambio de clase CSS o de atributo src según el estado. Doce imágenes en total (cuatro por avatar y cuatro de fondo) y tres funciones de actualización. Es el mayor impacto visual posible con la programación más sencilla posible.
Por qué esto importa en la defensa
Un tribunal que vea la partida durante dos minutos entenderá el proyecto sin que nadie se lo explique: verá a un humano volviéndose máquina, a una máquina volviéndose humana y a un planeta que mejora o empeora detrás de los dos. El concepto entra por los ojos antes que por las palabras, y eso es exactamente lo que se valora en una presentación corta.
 
14. Finales y perfiles de evolución
El final combina las dos ideas: el desenlace del planeta viene de NEXO y el perfil personalizado viene de HumanIA. Primero se comprueba el planeta, y solo después se mira quién ha evolucionado más.
Los cuatro desenlaces
Desenlace	Condición	Mensaje
COLAPSO	La Salud del Planeta llega a 0 en cualquier momento	Pierden los dos. La partida termina inmediatamente, sin importar los puntos de evolución
CONVERGENCIA TOTAL	El planeta termina por encima de 45 y la diferencia de evolución es de 5 puntos o menos	El mejor final: se ha salvado el mundo sin que ninguno dominase al otro
SUPREMACÍA HUMANA	El planeta sobrevive y el jugador tiene más evolución	Victoria del jugador, con matiz según cómo haya quedado el planeta
SUPREMACÍA IA	El planeta sobrevive y la IA tiene más evolución	Derrota del jugador, con el mismo matiz

El perfil de evolución
Además del desenlace, la pantalla final muestra un perfil calculado a partir de las capacidades conquistadas, tal y como proponía HumanIA. Algunos ejemplos:
•	EL ESTRATEGA — combina intuición humana con análisis artificial.
•	LA MENTE PERFECTA — domina memoria, cálculo y creatividad.
•	EL GUARDIÁN — pocas capacidades conquistadas pero planeta al máximo.
•	EL CONQUISTADOR — todas las capacidades conquistadas pero planeta en estado crítico.
•	NEXO — las cuatro capacidades conquistadas y el planeta por encima de 45. El final oculto y difícil.
Se muestra también el porcentaje de evolución (por ejemplo, 68% humano / 32% IA) y el estado final del planeta. Programación: una cadena de if/else que compara los booleanos de capacidades y las tres barras. Cinco o seis perfiles son más que suficientes.
El perfil EL CONQUISTADOR es deliberadamente un final malo con aspecto de final bueno: el jugador ha ganado todo y ha destruido el mundo. Que exista ese resultado es lo que convierte el mensaje del juego en algo que se juega y no en algo que se lee en un texto.
15. Pantallas del juego
15.	Inicio: título, presentación de humano e IA, botón Jugar.
16.	Introducción: la historia en pocas frases y explicación de las tres barras.
17.	Configuración: elección de avatar y número de rondas (8, 12, 16 o modo libre).
18.	Juego: la pantalla principal, donde ocurre todo. Avatares a los lados, tres barras arriba, crisis de la ronda en el centro, mano de cartas y botones PAR/IMPAR abajo.
19.	Resolución de ronda: no es una pantalla nueva, es una zona de la pantalla de juego que muestra las cartas reveladas, la suma y el resultado.
20.	Evento: tarjeta superpuesta cuando se dispara un evento especial.
21.	Final: desenlace, perfil, porcentajes, capacidades conquistadas y botón de volver a jugar.
Cinco pantallas reales más dos superposiciones. Las propuestas originales manejaban siete y nueve pantallas respectivamente; al unificar los modos hemos reducido el trabajo de interfaz sin perder ningún momento importante.
 
16. Qué programaremos realmente (nivel del curso)
Todo lo descrito en este documento se construye con los mismos elementos que ya aparecían en las dos propuestas originales. No se añade absolutamente nada nuevo respecto a lo trabajado en clase.
Elemento del curso	Uso en el juego
Variables y booleanos	Ronda actual, apuestas, capacidades conquistadas, evento activo
number y string	Puntuaciones de las tres barras, valores de las cartas, textos en pantalla
Arrays	Mano de cartas, crisis ecológicas, cartas de crisis, eventos, capacidades
Objetos	Datos del jugador, de la IA, de cada carta y de cada evento
Funciones	Resolver ronda, calcular puntos, aplicar capacidad, lanzar evento, actualizar pantalla
if / else	Comparación de apuestas, condiciones de victoria, efectos de capacidades
Operador módulo (%)	Comprobar si la suma es PAR o IMPAR y contar rondas para los eventos
Math.random()	Elección de la IA, aparición de cartas de crisis y crisis de cada ronda
Eventos click	Botones PAR/IMPAR, selección de carta, confirmar, reiniciar
DOM	Actualizar barras, textos, imágenes de avatares y fondo del planeta
localStorage	Guardar el mejor resultado y los perfiles ya conseguidos
HTML5 y CSS3	Estructura de pantallas, barras de progreso, transiciones de estado visual

No hay animaciones complejas, ni canvas, ni motores gráficos, ni peticiones a servidores, ni bases de datos, ni frameworks. La sensación de juego elaborado viene del diseño, no de la dificultad técnica. Ese es precisamente el argumento que conviene defender ante el profesor: hemos conseguido el máximo efecto con las herramientas del curso.
17. Programación Orientada a Objetos: cuatro clases
Se mantiene la estructura sencilla que proponía HumanIA, ajustada a la mecánica de cartas.
Clase	Qué guarda	Qué hace
Jugador	Nombre, mano de cartas, apuesta, puntos de evolución, capacidades	Elegir carta, apostar, conquistar capacidad, reiniciar mano
Carta	Valor numérico y si está disponible o descartada	Marcarse como usada
Evento	Nombre, descripción y efecto	Activarse y desactivarse
Partida	Ronda actual, salud del planeta, crisis y evento activos	Resolver la ronda, calcular resultado, comprobar el final, actualizar la pantalla

Sin herencia, sin interfaces, sin patrones de diseño. Cuatro clases que cualquiera de los dos puede explicar de memoria durante la defensa, que es justo el criterio que el profesor va a evaluar.
18. Desarrollo por fases
Fase	Contenido	Estado al terminarla
Fase 1 — Núcleo	Manos de cartas, apuesta PAR/IMPAR, suma, resolución en convergencia / rivalidad / fracaso y las tres barras	Ya es un juego completo y jugable
Fase 2 — Capacidades	Las ocho capacidades conquistables con sus efectos	El juego ya tiene profundidad estratégica
Fase 3 — Contexto	Crisis ecológicas por ronda y las cinco cartas de crisis	El juego ya tiene tema y narrativa
Fase 4 — Evolución visual	Cuatro estados por avatar y cuatro del planeta	El juego ya impresiona visualmente
Fase 5 — Cierre	Eventos especiales, desenlaces y perfiles finales	El juego está terminado
Fase 6 — Pulido	Sonidos, transiciones, localStorage, textos y ajuste de dificultad	El juego está presentable

La fase 1 es un juego entero por sí sola. Si por lo que fuese hubiera problemas de tiempo, se podría presentar con las fases 1 a 3 y seguiría siendo un proyecto defendible. Esa red de seguridad es la razón principal por la que esta fusión es menos arriesgada que NEXO en su formato original de dos modos.
 
19. Qué se ha descartado y por qué
Un documento de diseño honesto tiene que explicar también lo que se ha dejado fuera. Esto es útil además para la defensa: demuestra que las decisiones se han tomado, no que se han evitado.
Elemento descartado	Procedencia	Motivo
Los dos modos de juego separados	NEXO	Duplicaba el trabajo. La cooperación y la competición ahora conviven en la misma partida, que es más interesante
El reparto de energía entre capacidades	HumanIA	Sustituía la Morra por otra mecánica. La Morra es nuestro punto de partida y no se negocia
Las seis fortalezas por bando	NEXO	Demasiados casos que programar y demasiadas cosas que recordar. Reducidas a cuatro
Las cartas que solo suman o restan puntos	NEXO	Se conservan pero ahora conviven con capacidades que sí cambian el juego
La carta Fractura	NEXO	Su función de castigo la cumplen mejor los fracasos y las cartas de crisis
Que el juego decida al azar si hace falta PAR o IMPAR	NEXO	Quitaba al jugador la decisión más interesante. Ahora la apuesta la hace cada uno
20. Argumentario para la defensa
Ante la empresa (originalidad, creatividad, valor aportado)
•	No existe ningún juego comercial que adapte la Morra a cartas con temática ecológica y con capacidades conquistables. La combinación es propia.
•	La decisión de fondo del juego —imponerse o coincidir— es una decisión real que el jugador toma doce veces por partida, no una elección de menú.
•	El concepto se entiende en menos de un minuto viendo la pantalla: dos figuras que se van pareciendo la una a la otra mientras un planeta mejora o se apaga detrás.
•	El mensaje no está escrito en un texto, está en las reglas: se puede ganar todo y perder el mundo, y el juego tiene un final concreto para eso.
Ante el profesor (comprensión y defensa de la programación)
•	Toda la lógica cabe en operaciones que se han trabajado en clase: sumas, módulo, condicionales, arrays, objetos y DOM.
•	El corazón del juego son tres condicionales comparando dos apuestas. Se puede explicar en la pizarra en dos minutos.
•	Cuatro clases sin herencia, cada una con una responsabilidad clara.
•	El impacto visual se consigue cambiando imágenes según el estado, no con técnicas que no dominamos. Sabemos explicar cada línea.
La frase con la que conviene abrir
«Hemos partido de un juego de manos con más de dos mil años, la Morra, y le hemos añadido una sola regla nueva: que cada jugador apueste. Esa regla convierte un juego de azar en un juego sobre si merece la pena ganar solo.»
21. Nombre, lema y alcance recomendado
Nombre: NEXO — La Convergencia
Lema: «Compite. Converge. Decide qué quieres ser antes de que no quede mundo donde serlo.»

Alcance recomendado para la primera versión: una partida completa de doce rondas, las ocho capacidades, las cinco cartas de crisis, los cinco eventos, cuatro estados visuales por avatar, cuatro del planeta y los cuatro desenlaces con cinco perfiles. Todo lo demás —sonido, logros, más perfiles, modo libre— es ampliación.
Es preferible presentar una versión estable, cuidada y que sepamos explicar por completo, que una versión más grande a medio terminar. Ese criterio, que ya aparecía en la propuesta de HumanIA, sigue siendo válido y es el que ha guiado todas las decisiones de este documento.

Resumen en una línea: hemos conservado la Morra como mecánica, la ecología como propósito y la conquista de capacidades como profundidad, y lo hemos metido todo en una sola partida en lugar de en dos modos. El resultado es más original que HumanIA, más viable que NEXO y más fácil de defender que cualquiera de los dos.
