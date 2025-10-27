import { MatchID, Player, AppGame } from "./app-game-support";
import { matchID, keys, server } from "./url-params";


export function addPlayerToHref(newMatchID: MatchID, player: Player): string {
    if (matchID && matchID.mid !== newMatchID.mid) {
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

    return url.href;
}

export function gamePath(game: AppGame): string {
    return "/" + game.name;
}
export function lobbyServer(): string {
    const url = new URL(window.location.href);
    let result;
    if (server) {
        result = server;
    } else {
        if (url.hostname === "localhost") {
            url.port = "8000"; // kludge?
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
    if (debugPanel) {
        searchParams.set(keys.debugPanel, "1");
    }
    url.search = searchParams.toString();

    return url.href;
}

export function openOnlineMatchPage(matchID: MatchID): void {
    // Is this a proper way to do this?  For alternative see
    //https://chatgpt.com/c/68fe4f16-1768-8329-91b0-fcb230bb7adc
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);
    searchParams.set(keys.matchID, matchID.mid);
    url.search = searchParams.toString();

    window.location.href = url.href;
}
