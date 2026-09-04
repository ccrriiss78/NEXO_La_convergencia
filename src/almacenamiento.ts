import { ResumenFinal } from "./tipos.js";

const STORAGE_KEY: string = "nexo.playerProfiles.v1";
const SCHEMA_VERSION: number = 1;
const LEGACY_V22_KEY: string = "nexo_jugadores_v22";
const LEGACY_BEST_SCORE_KEY: string = "nexo_mejor_marca_v20";
const LEGACY_UNLOCKS_KEY: string = "nexo_perfiles";
const LEGACY_IMPORT_KEY: string = "nexo.legacyProgressImported.v1";

export type MejorMarca = {
  playerId?: string;
  displayName?: string;
  nombre?: string;
  evolucion: number;
  planeta: number;
  perfil: string;
  desenlace?: string;
  achievedAt?: string;
};

type PlayerProfile = {
  id: string;
  displayName: string;
  unlockedProfiles: string[];
  bestScore: MejorMarca | null;
  createdAt: string;
  updatedAt: string;
};

type PlayerStore = {
  schemaVersion: number;
  activePlayerId: string | null;
  players: Record<string, PlayerProfile>;
};

type LegacyPlayer = {
  nombre?: string;
  perfiles?: string[];
  mejorMarca?: MejorMarca;
};

function nowIso(): string {
  return new Date().toISOString();
}

function cleanDisplayName(name: string): string {
  return String(name || "").trim().replace(/\s+/g, " ").slice(0, 20);
}

function comparableName(name: string): string {
  return cleanDisplayName(name).toLocaleLowerCase("es-ES");
}

function createPlayerId(): string {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return "player_" + globalThis.crypto.randomUUID();
  }
  return "player_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 10);
}

function emptyStore(): PlayerStore {
  return { schemaVersion: SCHEMA_VERSION, activePlayerId: null, players: {} };
}

function saveStore(store: PlayerStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

function migrateV22Store(): PlayerStore {
  const text: string | null = localStorage.getItem(LEGACY_V22_KEY);
  if (text === null) {
    return emptyStore();
  }

  try {
    const legacy = JSON.parse(text) as {
      activo?: string;
      jugadores?: Record<string, LegacyPlayer>;
    };
    const migrated: PlayerStore = emptyStore();
    const oldToNewIds: Record<string, string> = {};
    const jugadores: Record<string, LegacyPlayer> = legacy.jugadores || {};

    for (const oldId of Object.keys(jugadores)) {
      const oldPlayer: LegacyPlayer = jugadores[oldId];
      const displayName: string = cleanDisplayName(oldPlayer.nombre || oldId);
      if (displayName === "") {
        continue;
      }

      const id: string = createPlayerId();
      const timestamp: string = nowIso();
      oldToNewIds[oldId] = id;
      migrated.players[id] = {
        id: id,
        displayName: displayName,
        unlockedProfiles: Array.isArray(oldPlayer.perfiles) ? oldPlayer.perfiles.slice() : [],
        bestScore: oldPlayer.mejorMarca || null,
        createdAt: timestamp,
        updatedAt: timestamp
      };
    }

    migrated.activePlayerId = legacy.activo !== undefined ? oldToNewIds[legacy.activo] || null : null;
    saveStore(migrated);
    return migrated;
  } catch (error) {
    return emptyStore();
  }
}

function readStore(): PlayerStore {
  const text: string | null = localStorage.getItem(STORAGE_KEY);
  if (text === null) {
    return migrateV22Store();
  }

  try {
    const store = JSON.parse(text) as PlayerStore;
    if (store && store.schemaVersion === SCHEMA_VERSION && store.players) {
      return store;
    }
  } catch (error) {
    // Si el guardado esta danado, arrancamos sin bloquear el juego.
  }

  return emptyStore();
}

function findPlayerByName(store: PlayerStore, name: string): PlayerProfile | null {
  const target: string = comparableName(name);
  const ids: string[] = Object.keys(store.players);
  for (let i = 0; i < ids.length; i++) {
    const player: PlayerProfile = store.players[ids[i]];
    if (comparableName(player.displayName) === target) {
      return player;
    }
  }
  return null;
}

function ensurePlayer(name: string): PlayerProfile | null {
  const displayName: string = cleanDisplayName(name);
  if (displayName === "") {
    return null;
  }

  const store: PlayerStore = readStore();
  let player: PlayerProfile | null = findPlayerByName(store, displayName);
  if (player === null) {
    const id: string = createPlayerId();
    const timestamp: string = nowIso();
    player = {
      id: id,
      displayName: displayName,
      unlockedProfiles: [],
      bestScore: null,
      createdAt: timestamp,
      updatedAt: timestamp
    };
    store.players[id] = player;
  }

  store.activePlayerId = player.id;
  player.updatedAt = nowIso();
  saveStore(store);
  return player;
}

export function seleccionarJugador(name: string): string {
  const player: PlayerProfile | null = ensurePlayer(name);
  return player === null ? "" : player.displayName;
}

export function leerJugadorActivo(): string {
  const store: PlayerStore = readStore();
  const player: PlayerProfile | null = store.activePlayerId ? store.players[store.activePlayerId] : null;
  return player ? player.displayName : "";
}

export function listarJugadores(): string[] {
  const store: PlayerStore = readStore();
  const names: string[] = [];
  const ids: string[] = Object.keys(store.players);
  for (let i = 0; i < ids.length; i++) {
    names.push(store.players[ids[i]].displayName);
  }
  return names.sort(function (a: string, b: string): number {
    return a.localeCompare(b, "es");
  });
}

export function leerMejorMarca(): MejorMarca | null {
  const store: PlayerStore = readStore();
  const player: PlayerProfile | null = store.activePlayerId ? store.players[store.activePlayerId] : null;
  return player ? player.bestScore : null;
}

export function guardarMejorMarca(name: string, summary: ResumenFinal): boolean {
  const selected: PlayerProfile | null = ensurePlayer(name);
  if (selected === null) {
    return false;
  }

  const store: PlayerStore = readStore();
  const player: PlayerProfile = store.players[selected.id];
  const score: MejorMarca = {
    playerId: player.id,
    displayName: player.displayName,
    nombre: player.displayName,
    evolucion: summary.evolucionJugador,
    planeta: summary.saludPlaneta,
    perfil: summary.perfil.nombre,
    desenlace: summary.desenlace,
    achievedAt: nowIso()
  };

  if (player.bestScore !== null) {
    const newValue: number = score.evolucion + score.planeta;
    const previousValue: number = player.bestScore.evolucion + player.bestScore.planeta;
    if (newValue <= previousValue) {
      return false;
    }
  }

  player.bestScore = score;
  player.updatedAt = nowIso();
  saveStore(store);
  return true;
}

export function leerPerfiles(): string[] {
  const store: PlayerStore = readStore();
  const player: PlayerProfile | null = store.activePlayerId ? store.players[store.activePlayerId] : null;
  return player ? player.unlockedProfiles.slice() : [];
}

export function guardarPerfil(profileName: string): void {
  const store: PlayerStore = readStore();
  const player: PlayerProfile | null = store.activePlayerId ? store.players[store.activePlayerId] : null;
  if (!player || player.unlockedProfiles.indexOf(profileName) !== -1) {
    return;
  }

  player.unlockedProfiles.push(profileName);
  player.updatedAt = nowIso();
  saveStore(store);
}

export function importarProgresoAnteriorSiExiste(name: string): boolean {
  if (localStorage.getItem(LEGACY_IMPORT_KEY) === "yes") {
    return false;
  }

  const selected: PlayerProfile | null = ensurePlayer(name);
  if (selected === null) {
    return false;
  }

  const store: PlayerStore = readStore();
  const player: PlayerProfile = store.players[selected.id];
  if (player.unlockedProfiles.length > 0 || player.bestScore !== null) {
    localStorage.setItem(LEGACY_IMPORT_KEY, "yes");
    return false;
  }

  try {
    const unlocks = JSON.parse(localStorage.getItem(LEGACY_UNLOCKS_KEY) || "[]") as string[];
    const bestScore = JSON.parse(localStorage.getItem(LEGACY_BEST_SCORE_KEY) || "null") as MejorMarca | null;

    if (Array.isArray(unlocks)) {
      player.unlockedProfiles = unlocks.slice();
    }
    player.bestScore = bestScore;
    player.updatedAt = nowIso();
    saveStore(store);
    localStorage.setItem(LEGACY_IMPORT_KEY, "yes");
    return player.unlockedProfiles.length > 0 || bestScore !== null;
  } catch (error) {
    localStorage.setItem(LEGACY_IMPORT_KEY, "yes");
    return false;
  }
}
