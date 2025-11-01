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

    return<div>
        <div>Connection status: {readyStatus(readyState)}</div>
        <div> Error: {error}</div>
        <div>Game state: <pre>{JSON.stringify(match?.state, null, 2)}</pre></div>
    </div>

}
