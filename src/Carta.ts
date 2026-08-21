/**
 * Una carta de la mano.
 *
 * Es la clase más pequeña del juego y solo guarda dos cosas: el número
 * que lleva impreso y si todavía está disponible o ya se ha descartado.
 *
 * La usamos en lugar de un simple array de números porque así cada carta
 * "sabe" si se ha jugado, y el resto del programa no tiene que ir
 * llevando la cuenta por su cuenta.
 */
export class Carta {
  private valor: number;
  private disponible: boolean;

  constructor(valor: number) {
    this.valor = valor;
    this.disponible = true;
  }

  public getValor(): number {
    return this.valor;
  }

  public estaDisponible(): boolean {
    return this.disponible;
  }

  /** Marca la carta como usada: se descarta hasta que se reinicie la mano. */
  public usar(): void {
    this.disponible = false;
  }

  /** Devuelve la carta a la mano cuando empieza un ciclo nuevo. */
  public reiniciar(): void {
    this.disponible = true;
  }
}
