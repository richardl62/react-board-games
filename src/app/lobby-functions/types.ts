interface PublicPlayerMetadata  {
    id: number;
    name?: string;
    isConnected?: boolean;
}

export interface MatchData {
    gameName: string;
    matchID: string;
    players: PublicPlayerMetadata[];
    
    setupData?: unknown;
    gameover?: unknown;
}


