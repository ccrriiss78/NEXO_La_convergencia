import { Carta } from "./Carta.js";
import { Apuesta, FichaCapacidad } from "./tipos.js";
import { CARTAS_POR_MANO } from "./datos.js";

/**
 * Un participante de la partida: sirve tanto para el humano como para la IA.
 *
 * Guarda todo lo que "es suyo": su mano de cartas, la apuesta que ha
 * declarado esta ronda, sus puntos de evolución, las capacidades que le ha
 * conquistado al rival y el historial de jugadas que ya ha hecho.
 *
 * No decide nada por sí mismo: quién elige la carta y la apuesta lo deciden
 * el jugador (con clicks) o el archivo ia.ts. Esta clase solo guarda el
 * estado y ofrece métodos para consultarlo y cambiarlo.
 */
export class Jugador {
  private nombre: string;
  private esIA: boolean;
  private avatar: string;

  private mano: Carta[];
  private apuesta: Apuesta | null;
  private evolucion: number;
  private capacidades: string[];

  // Historial de jugadas ya realizadas: lo usan la capacidad Memoria (para
  // enseñárselo al jugador) y Análisis predictivo (para calcular tendencias).
  private historialCartas: number[];
  private historialApuestas: Apuesta[];

  // Control de la capacidad Precisión: solo una vez por ciclo de mano.
  private precisionUsada: boolean;

  // Derrotas seguidas: lo necesita la capacidad Adaptación de la IA.
  private derrotasSeguidas: number;

  // Última jugada que le salió bien: lo necesita la capacidad Creatividad.
  private cartaGanadora: number;
  private apuestaGanadora: Apuesta | null;

  constructor(nombre: string, esIA: boolean, avatar: string) {
    this.nombre = nombre;
    this.esIA = esIA;
    this.avatar = avatar;

    this.mano = [];
    this.crearMano();

    this.apuesta = null;
    this.evolucion = 0;
    this.capacidades = [];

    this.historialCartas = [];
    this.historialApuestas = [];

    this.precisionUsada = false;
    this.derrotasSeguidas = 0;

    this.cartaGanadora = 0;
    this.apuestaGanadora = null;
  }

  /** Crea las cinco cartas numeradas del 1 al 5. */
  private crearMano(): void {
    for (let i = 1; i <= CARTAS_POR_MANO; i++) {
      this.mano.push(new Carta(i));
    }
  }

  // ---- Datos básicos ----------------------------------------------------

  public getNombre(): string {
    return this.nombre;
  }

  public setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  public getAvatar(): string {
    return this.avatar;
  }

  public setAvatar(avatar: string): void {
    this.avatar = avatar;
  }

  public getEsIA(): boolean {
    return this.esIA;
  }

  // ---- La mano de cartas ------------------------------------------------

  public getMano(): Carta[] {
    return this.mano;
  }

  /** Devuelve solo las cartas que todavía no se han jugado. */
  public getCartasDisponibles(): Carta[] {
    const disponibles: Carta[] = [];
    for (let i = 0; i < this.mano.length; i++) {
      if (this.mano[i].estaDisponible()) {
        disponibles.push(this.mano[i]);
      }
    }
    return disponibles;
  }

  /**
   * Juega la carta del valor indicado: la marca como usada y devuelve su
   * número. Si esa carta ya estaba descartada devuelve 0.
   */
  public jugarCarta(valor: number): number {
    for (let i = 0; i < this.mano.length; i++) {
      if (this.mano[i].getValor() === valor && this.mano[i].estaDisponible()) {
        this.mano[i].usar();
        return valor;
      }
    }
    return 0;
  }

  /** Devuelve una carta a la mano (lo necesita el poder Velocidad). */
  public devolverCarta(valor: number): void {
    for (let i = 0; i < this.mano.length; i++) {
      if (this.mano[i].getValor() === valor) {
        this.mano[i].reiniciar();
      }
    }
  }

  /**
   * Si ya no queda ninguna carta, vuelve a poner las cinco disponibles y
   * devuelve true para que la interfaz pueda avisar de que empieza un
   * ciclo nuevo. Aquí también se recupera el uso de Precisión.
   */
  public reiniciarManoSiHaceFalta(): boolean {
    if (this.getCartasDisponibles().length > 0) {
      return false;
    }
    for (let i = 0; i < this.mano.length; i++) {
      this.mano[i].reiniciar();
    }
    this.precisionUsada = false;
    return true;
  }

  // ---- La apuesta -------------------------------------------------------

  public apostar(apuesta: Apuesta): void {
    this.apuesta = apuesta;
  }

  public getApuesta(): Apuesta | null {
    return this.apuesta;
  }

  public limpiarApuesta(): void {
    this.apuesta = null;
  }

  // ---- Evolución y capacidades ------------------------------------------

  public getEvolucion(): number {
    return this.evolucion;
  }

  public sumarEvolucion(puntos: number): void {
    this.evolucion = this.evolucion + puntos;
  }

  public getCapacidades(): string[] {
    return this.capacidades;
  }

  /** Indica si ya posee una capacidad concreta. */
  public tiene(idCapacidad: string): boolean {
    for (let i = 0; i < this.capacidades.length; i++) {
      if (this.capacidades[i] === idCapacidad) {
        return true;
      }
    }
    return false;
  }

  /**
   * Conquista la SIGUIENTE capacidad de la lista que todavía no tenga.
   * El orden es fijo y siempre el mismo, así que el jugador puede
   * planificar. Devuelve la ficha conquistada, o null si ya las tenía todas.
   */
  public conquistarSiguiente(lista: FichaCapacidad[]): FichaCapacidad | null {
    for (let i = 0; i < lista.length; i++) {
      if (!this.tiene(lista[i].id)) {
        this.capacidades.push(lista[i].id);
        return lista[i];
      }
    }
    return null;
  }

  /**
   * Nivel visual del avatar (0 a 3) según cuántas capacidades ha
   * conquistado: 0 capacidades, 1-2, 3 y 4. Lo usa la interfaz para
   * cambiar la clase CSS de la imagen.
   */
  public getNivelVisual(): number {
    const total: number = this.capacidades.length;
    if (total === 0) {
      return 0;
    }
    if (total <= 2) {
      return 1;
    }
    if (total === 3) {
      return 2;
    }
    return 3;
  }

  // ---- Historial de jugadas ---------------------------------------------

  /** Apunta la carta y la apuesta de la ronda que se acaba de resolver. */
  public registrarJugada(carta: number, apuesta: Apuesta): void {
    this.historialCartas.push(carta);
    this.historialApuestas.push(apuesta);
  }

  public getHistorialCartas(): number[] {
    return this.historialCartas;
  }

  public getHistorialApuestas(): Apuesta[] {
    return this.historialApuestas;
  }

  /**
   * Tendencia de las apuestas hechas hasta ahora: devuelve "PAR" o "IMPAR"
   * según cuál haya repetido más. Es lo que muestra la capacidad Análisis
   * predictivo. Si no hay historial devuelve null.
   */
  public getTendencia(): Apuesta | null {
    if (this.historialApuestas.length === 0) {
      return null;
    }
    let pares: number = 0;
    for (let i = 0; i < this.historialApuestas.length; i++) {
      if (this.historialApuestas[i] === "PAR") {
        pares = pares + 1;
      }
    }
    const impares: number = this.historialApuestas.length - pares;
    if (pares >= impares) {
      return "PAR";
    }
    return "IMPAR";
  }

  // ---- Estado de las capacidades ----------------------------------------

  public puedeUsarPrecision(): boolean {
    return this.tiene("precision") && !this.precisionUsada;
  }

  public gastarPrecision(): void {
    this.precisionUsada = true;
  }

  public getDerrotasSeguidas(): number {
    return this.derrotasSeguidas;
  }

  public sumarDerrota(): void {
    this.derrotasSeguidas = this.derrotasSeguidas + 1;
  }

  public reiniciarDerrotas(): void {
    this.derrotasSeguidas = 0;
  }

  /** Guarda la jugada con la que ganó una ronda (capacidad Creatividad). */
  public guardarJugadaGanadora(carta: number, apuesta: Apuesta): void {
    this.cartaGanadora = carta;
    this.apuestaGanadora = apuesta;
  }

  public getCartaGanadora(): number {
    return this.cartaGanadora;
  }

  public getApuestaGanadora(): Apuesta | null {
    return this.apuestaGanadora;
  }
}
