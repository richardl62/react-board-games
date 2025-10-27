import { LobbyInterface } from "@lobby/interface";
import { lobbyServer } from "@/url-tools";

// As LobbyInterface but functions return promises. (LobbyInterface is used in the server where
// promises are not needed.)
type LobbyPromises = {
    [P in keyof LobbyInterface]: 
        (...args: Parameters<LobbyInterface[P]>) => Promise<ReturnType<LobbyInterface[P]>>;
};

export const lobbyClient: LobbyPromises = {

    listMatches: (options) => {
        return callLobby("listMatches", options);
    },

    getMatch: (options) => {
        return callLobby("getMatch", options);
    },

    createMatch: (options) => {
        return callLobby("createMatch", options);
    },
    
    joinMatch : (options) => {
        return callLobby("joinMatch", options);
    },
    
    updatePlayer: (options) => {
        return callLobby("updatePlayer", options);
    },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function callLobby(func: string, arg: unknown) : Promise<any> {
    // Note: The name of the lobbyFunction ('createMatch' etc.) is passed to the
    // server as query parameter with name 'func'.
    const searchParams = new URLSearchParams();
    searchParams.append("func", func);
    searchParams.append("arg", JSON.stringify(arg));

    const fullUrl = `${lobbyServer()}/lobby?${searchParams.toString()}`;
    console.log("callLobby fetching from", fullUrl);

    const response = await fetch(fullUrl);
    // Check response status code for errors
    if (!response.ok) {
        const message = `${func} failed: fetch reported ${response.status}`;
        console.log(message);
        throw new Error(message);
    }

    const result = await response.json();
    console.log(`${func} suceeded`, result);
    return result;
}
