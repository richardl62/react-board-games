export interface PublicPlayerMetadata {
  id: string;
  name: string | null;
  isConnected: boolean;
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
