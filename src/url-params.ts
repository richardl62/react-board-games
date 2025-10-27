// Get values that can be set in the url.
// If not set, give default value.
import { MatchID, Player } from "./app-game-support";

export const keys = {
    credentials: "cred",
    matchID: "id",
    nPlayers: "np",
    pid: "pid",
};

function searchString() {
    // KLUDGE: window is undefined when run as a server, but is defined when run using
    // "npm start". This is a hack to allow the server to run while keeping the 
    // URL functionality for "npm start".
    // For background on this issue see
    // see https://dev.to/vvo/how-to-solve-window-is-not-defined-errors-in-react-and-next-js-5f97
    if(typeof window === "undefined") {
        console.warn("window is undefined - URL parameters are not available");
        return undefined;
    }
    return window.location.search;
}
const usp = new URLSearchParams(searchString());

const getAndDelete = (key: string) => {
    const val = usp.get(key);
    usp.delete(key);
    return val;
};

const matchID_ = getAndDelete(keys.matchID);
const matchID : MatchID | null = matchID_ ? {mid: matchID_} : null;

function getAndDeletePlayer() : Player | null {
    const pid = getAndDelete(keys.pid);
    const credentials = getAndDelete(keys.credentials);

    if(pid && credentials) {
        return {
            id: pid,
            credentials: credentials,
        };
    }

    if(pid || credentials) {
        console.warn("URL has one but not both of player id and credentials");
    }

    return null;
}

const player = getAndDeletePlayer();


if (usp.toString()) {
    console.warn("Unrecongised url parameters", usp.toString());
}

export const queryValues = {
    player,
    isOffline: player === null,
    matchID,
    offlineData: null,
};
