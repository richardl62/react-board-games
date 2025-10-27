// Get values that can be set in the url.
// If not set, give default value.
import { MatchID, Player } from "./app-game-support";

export const keys = {
    credentials: "cred",
    matchID: "id",
    pid: "pid",
} as const;

export function matchDataFromUrl() {

    function searchString() {
        // KLUDGE: window is undefined when run as a server, but is defined when run using
        // "npm start". This is a hack to allow the server to run while keeping the 
        // URL functionality for "npm start".
        // For background on this issue see
        // see https://dev.to/vvo/how-to-solve-window-is-not-defined-errors-in-react-and-next-js-5f97
        if (typeof window === "undefined") {
            console.warn("window is undefined - URL parameters are not available");
            return undefined;
        }
        return window.location.search;
    }

    const usp = new URLSearchParams(searchString());

    const allKeys : string[]= Object.values(keys);
    for (const key of usp.keys()) {
        if (!allKeys.includes(key)) {
            console.warn("Unknown URL parameter:", key);
        }
    }

    const matchID_ = usp.get(keys.matchID);
    const matchID: MatchID | null = matchID_ ? { mid: matchID_ } : null;

    const pid = usp.get(keys.pid);
    const credentials = usp.get(keys.credentials);

    let player : Player | null;
    if (pid && credentials) {
        player = {
            id: pid,
            credentials: credentials,
        };
    } else {
        if (pid || credentials) {
            console.warn("Only one of player id or credentials is set in URL - ignoring both");
        }
        player = null;
    }

    return {
        player,
        isOffline: player === null,
        matchID,
    };
}
