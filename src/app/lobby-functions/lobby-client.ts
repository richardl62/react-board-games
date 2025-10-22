// TO DO:
// 1) Merge these types with ./types.ts 
// 2) Implement lobby client methods using fetch API.
interface PlayerMetadata {
    id: number;
    name?: string; 
    credentials?: string;
    isConnected?: boolean;
};

type PublicPlayerMetadata = Omit<PlayerMetadata, 'credentials'>;

interface JoinedMatch {
    playerID: string;
    playerCredentials: string;
}

interface CreatedMatch {
    matchID: string;
}

export interface MatchData {
    gameName: string;
    players: {
        [id: number]: PlayerMetadata;
    };

}

interface Match extends Omit<MatchData, 'players'> {
    matchID: string;
    players: PublicPlayerMetadata[];
};

interface MatchList {
    matches: Match[];
}

export class LobbyClient {
    private server: string;
    constructor({ server }: {
        server: string;
    })
    {
        this.server = server;
        console.log(`LobbyClient using server: ${this.server}`);
    }

    listMatches(_gameName: string): Promise<MatchList> {
        throw new Error("Not implemented");
    }
    
    getMatch(_gameName: string, _matchID: string): Promise<Match> {
        throw new Error("Not implemented");
    }

    createMatch(_gameName: string, _body: {
        numPlayers: number;
        setupData: unknown;
    }): Promise<CreatedMatch> {
        throw new Error("Not implemented");
    }
    
    joinMatch(_gameName: string, _matchID: string, _body: {
        playerName: string;
    }): Promise<JoinedMatch> {
        throw new Error("Not implemented");
    }
    
    updatePlayer(_gameName: string, _matchID: string, _body: {
        playerID: string;
        credentials: string;
        newName: string;
    }): Promise<void> {
        throw new Error("Not implemented");
    }
}
