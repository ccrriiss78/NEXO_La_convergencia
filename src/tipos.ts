/**
 * Tipos y constantes compartidos por todo el juego.
 *
 * Aquí no hay lógica: solo damos NOMBRE a los valores que se repiten en
 * todo el proyecto. Así, si en vez de escribir `string` escribimos
 * `Apuesta`, TypeScript nos avisa si alguna vez ponemos "par" en
 * minúscula o cualquier otro valor que no existe en el juego.
 */

/** Apuesta que declara cada participante antes de revelar las cartas. */
export type Apuesta = "PAR" | "IMPAR";

/** Los tres resultados posibles de una ronda. */
export type Resultado = "CONVERGENCIA" | "RIVALIDAD" | "FRACASO";

/** Quién se ha impuesto en una ronda de rivalidad. */
export type Bando = "HUMANO" | "IA" | "NADIE";

/** Los cinco desenlaces con los que puede terminar la partida. */
export type Desenlace =
  | "COLAPSO"
  | "CONVERGENCIA TOTAL"
  | "SUPREMACIA HUMANA"
  | "SUPREMACIA IA"
  | "EQUILIBRIO INESTABLE";

/**
 * Ficha de una carta de crisis (las que modifican la puntuación de la ronda).
 * Es un objeto normal y corriente: le damos forma para no equivocarnos
 * al escribir el array de datos.
 */
export type CartaCrisis = {
  id: string;
  nombre: string;
  efecto: string;
  tipo: "Positiva" | "Negativa" | "Mixta";
};

/** Ficha de un evento especial (se dispara cada cuatro rondas). */
export type FichaEvento = {
  id: string;
  nombre: string;
  descripcion: string;
};

/** Ficha de una capacidad conquistable. */
export type FichaCapacidad = {
  id: string;
  nombre: string;
  efecto: string;
};

/** Ficha de un perfil de evolución de la pantalla final. */
export type FichaPerfil = {
  id: string;
  nombre: string;
  descripcion: string;
};

/**
 * Todo lo que ha pasado en una ronda ya resuelta.
 *
 * La clase Partida devuelve un objeto de este tipo y la interfaz lo pinta
 * en pantalla. De esta forma la lógica del juego no toca el DOM y la
 * interfaz no calcula puntos: cada parte hace una sola cosa.
 */
export type ResumenRonda = {
  ronda: number;
  cartaJugador: number;
  cartaIA: number;
  suma: number;
  paridad: Apuesta;
  apuestaJugador: Apuesta;
  apuestaIA: Apuesta;
  resultado: Resultado;
  ganador: Bando;
  puntosPlaneta: number;
  puntosJugador: number;
  puntosIA: number;
  saludPlanetaAntes: number;
  saludPlanetaDespues: number;
  evolucionJugadorAntes: number;
  evolucionJugadorDespues: number;
  evolucionIAAntes: number;
  evolucionIADespues: number;
  capacidadConquistada: string;
  explicacion: string;
  // true si la IA usó Intuición para revisar su carta antes de revelar.
  intuicionIA: boolean;
};

/** Resultado final de la partida, con desenlace y perfil de evolución. */
export type ResumenFinal = {
  desenlace: Desenlace;
  mensaje: string;
  perfil: FichaPerfil;
  rondasJugadas: number;
  saludPlaneta: number;
  evolucionJugador: number;
  evolucionIA: number;
  porcentajeJugador: number;
  porcentajeIA: number;
};
