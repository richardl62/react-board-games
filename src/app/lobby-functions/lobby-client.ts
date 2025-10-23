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

    listMatches(
        _options: {
            gameName: string;
        })
    : Promise<MatchList> {
        throw new Error("Not implemented");
    }
    
    getMatch(
        _options: {
            gameName: string; 
            matchID: string;
        }
    ): Promise<Match> {
        throw new Error("Not implemented");
    }

    createMatch(
        _options: {
            gameName: string;
            numPlayers: number;
            setupData: unknown;
        }
    ): Promise<CreatedMatch> {
        throw new Error("Not implemented");
    }
    
    joinMatch(
        _options: {
            gameName: string;
            matchID: string;
            playerName: string;
        }
    ): Promise<JoinedMatch> {
        throw new Error("Not implemented");
    }
    
    updatePlayer(
        _options: {
            gameName: string;
            matchID: string;
            playerID: string;
            credentials: string;
            newName: string;
        }
    ): Promise<void> {
        throw new Error("Not implemented");
    }
}
