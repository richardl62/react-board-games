import { JSX } from "react";
import { AppGame, MatchID, Player } from "@/app-game-support";
import { useOnlineMatch } from "./use-match-online";
import {ReadyState} from "react-use-websocket";

function readyStatus( state: ReadyState) {
    const status = {
        [ReadyState.CONNECTING]: "connecting",
        [ReadyState.OPEN]: "open",
        [ReadyState.CLOSING]: "closing",
        [ReadyState.CLOSED]: "closed",
        [ReadyState.UNINSTANTIATED]: "uninstantiated",
    }[state];

    return status || "unknown";
}

export function MatchPlayOnline(props: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const { readyState, match, error } = useOnlineMatch(props.game, {
        matchID: props.matchID,
        player: props.player,
    });

    if (readyState !== ReadyState.OPEN) {
        return <div>Connection status: {readyStatus(readyState)}</div>
    }

    if (error) {
        return <div> Server error: {error}</div>
    }

    if (!match) {
        // Should never happem
        return <div>Match data missing from server response!</div>
    }

    return <div>
        <div>Game state: <pre>{JSON.stringify(match.state, null, 2)}</pre></div>
    </div>

}
