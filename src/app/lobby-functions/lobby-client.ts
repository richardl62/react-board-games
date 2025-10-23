import { LobbyInterface } from "@lobby/interface";
import { CreatedMatch, JoinedMatch, Match, MatchList } from "@lobby/types";
import { callLobby } from "./call-lobby";

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
        options: {
            gameName: string;
        })
    : Promise<MatchList> {
        return callLobby("listMatches", options);
    }
    
    getMatch(
        options: {
            gameName: string; 
            matchID: string;
        }
    ): Promise<Match> {
        return callLobby("getMatch", options);
    }

    createMatch(
        options: {
            gameName: string;
            numPlayers: number;
            setupData: unknown;
        }
    ): Promise<CreatedMatch> {
        return callLobby("createMatch", options);
    }
    
    joinMatch(
        options: {
            gameName: string;
            matchID: string;
            playerName: string;
        }
    ): Promise<JoinedMatch> {
        return callLobby("listMatches", options);
    }
    
    updatePlayer(
        options: {
            gameName: string;
            matchID: string;
            playerID: string;
            credentials: string;
            newName: string;
        }
    ): Promise<void> {
        return callLobby("updatePlayer", options);
    }
}
