import { LobbyInterface } from "@lobby/interface";
import { CreatedMatch, JoinedMatch, Match, MatchList } from "@lobby/types";

// As LobbyInterface but functions return promises. (LobbyInterface is used in the server where
// promises are not needed.)
export type LobbyPromises = {
    [P in keyof LobbyInterface]: 
        (...args: Parameters<LobbyInterface[P]>) => Promise<ReturnType<LobbyInterface[P]>>;
};

export class LobbyClient implements LobbyPromises {
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
