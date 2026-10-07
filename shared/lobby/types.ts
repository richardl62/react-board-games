export interface PublicPlayerMetadata {
  id: string;
  name: string | null;
  isConnected: boolean;
  // Game-defined per-player state (e.g. vote, draw offer, hand of cards).
  // Set by moves via setPlayerData; absent for games that don't use it.
  gameData?: unknown;
  // Set if this player has proposed or accepted a rematch.
  wantsRematch?: true;
}

export interface JoinedMatch {
  playerID: string;
  playerCredentials: string;
}

export interface CreatedMatch {
  matchID: string;
}

export interface Match {
  gameName: string;
  matchID: string;
  players: PublicPlayerMetadata[];
}

export interface MatchList {
  matches: Match[];
}
