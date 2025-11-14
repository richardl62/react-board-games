export interface PlayerMetadata {
    id: string;
    name: string | null;
    credentials: string;
    isConnected: boolean;
}

export type PublicPlayerMetadata = Omit<PlayerMetadata, 'credentials'>;

export interface JoinedMatch {
    playerID: string;
    playerCredentials: string;
}

export interface CreatedMatch {
    matchID: string;
}

export interface MatchData {
    gameName: string;
    players: {
        [id: number]: PlayerMetadata;
    };

}

export interface Match extends Omit<MatchData, 'players'> {
    matchID: string;
    players: PublicPlayerMetadata[];
}
;

export interface MatchList {
    matches: Match[];
}
