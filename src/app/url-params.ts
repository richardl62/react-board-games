// Get values that can be set in the url.
// If not set, give default value.
import { AppGame, MatchID, Player } from "../app-game-support";
import { sAssert } from "../utils/assert";
import { OfflineOptions } from "./offline-options";

const keys = {
    credentials: "cred",
    debugPanel: "debug-panel",
    matchID: "id",
    nPlayers: "np",
    offline: "offline",
    persist: "persist",
    pid: "pid",
    server: "server",
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

function getAndDeleteFlag(key: string) : boolean {
    const falsey = [null, "0","false"];
    const truthy  = ["", "1","true"];

    const str = getAndDelete(key);

    if (falsey.includes(str)) {
        return false;
    }
  
    sAssert(str);
    if (truthy.includes(str)) {
        return true;
    }

    console.warn(`Bad value for URL boolean ${key}: ${str}`);
    return false; // Well, why not?

}

export const bgioDebugPanel = getAndDeleteFlag(keys.debugPanel);

const matchID_ = getAndDelete(keys.matchID);
export const matchID : MatchID | null = matchID_ ? {mid: matchID_} : null;

const server = getAndDelete(keys.server);

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

export const player = getAndDeletePlayer();

// NOTE: use isOffline rather than offlineData to check if a game is offline.
// (offlineData is set only when the "offline" URL parameter is set.)
export let offlineData : null | Omit<OfflineOptions,"setupData"> = null;
if(getAndDeleteFlag(keys.offline)){
    const numPlayers = getAndDelete(keys.nPlayers);
    if(numPlayers){
        offlineData = {
            numPlayers: parseInt(numPlayers),
            passAndPlay: true,
            debugPanel: bgioDebugPanel,
            
        };
    } else {
        console.warn("URL does not specify number of players (required for offline game)");
    }
}

export const isOffline = player === null;

if (usp.toString()) {
    console.warn("Unrecongised url parameters", usp.toString());
}

export function addPlayerToHref(newMatchID: MatchID, player: Player) : string {
    if(matchID && matchID.mid !== newMatchID.mid) {
        console.warn("MatchID supplied to addPlayerToHref is not consistent with URL parameter:",
            newMatchID, matchID
        );
    }

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(keys.matchID, newMatchID.mid);
    searchParams.set(keys.pid, player.id);
    searchParams.set(keys.credentials, player.credentials);
    url.search = searchParams.toString();

    return  url.href;
}

export function gamePath(game: AppGame): string {
    return "/" + game.name;
}
export function lobbyServer(): string { 
    const url = new URL(window.location.href);
    let result;
    if(server) {
        result = server;
    } else {
        if(url.hostname === "localhost" && url.port === "3000") {
            url.port = "8000"; // kludge
        }
        result = url.origin;
    }
  
    return result;
}

export function getOfflineMatchLink(nPlayers: number, debugPanel: boolean): string {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(keys.offline, "1");
    searchParams.set(keys.nPlayers, nPlayers.toString());
    if(debugPanel) {
        searchParams.set(keys.debugPanel, "1");
    }
    url.search = searchParams.toString();

    return url.href;
}

export function openOnlineMatchPage(matchID: MatchID): void {

    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(keys.matchID, matchID.mid);
    url.search = searchParams.toString();

    window.location.href = url.href;
}
