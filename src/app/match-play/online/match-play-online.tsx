import { JSX } from "react";
import { AppGame, MatchID, Player } from "@/app-game-support";
import { useOnlineMatch } from "./use-match-online";
import {ReadyState} from "react-use-websocket";
import { BoardProps, MatchDataElem } from "@shared/game-control/board-props";
import { PublicPlayerMetadata } from "@shared/lobby/types.js";
import { Ctx } from "@shared/game-control/ctx";
import { ServerMatchData } from "@shared/ws-match-response";
import { GameBoard } from "../game-board";

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


function convertPlayerData(md: PublicPlayerMetadata) : MatchDataElem {
    const {id, name, isConnected} = md;
    return {id, isConnected, name: name || undefined}
}

function makeContext(_player: Player, match: ServerMatchData) : Ctx {
    const playOrder = match.playerData.map(pd => pd.id.toString());
    const currentPlayer = match.currentPlayer.toString();
    const playOrderPos = playOrder.indexOf(currentPlayer);

    if ( playOrderPos < 0 ) {
        throw new Error("Cannnot compute playOrderPos");
    }

    return {
        numPlayers: match.playerData.length,
        playOrder,
        currentPlayer,
        playOrderPos,
        gameover: false, //KLUDGE
    }
}

export function MatchPlayOnline(props: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const { game, matchID, player } = props;
    const { readyState, match, error } = useOnlineMatch(game, {matchID, player});

    if (readyState !== ReadyState.OPEN) {
        // To do: Consider recording last good state to minimise impact of a
        // temporary lost of connection to the server.
        return <div>Connection status: {readyStatus(readyState)}</div>
    }

    if (error) {
        return <div> Server error: {error}</div>
    }

    if (!match) {
        // Should never happem
        return <div>Match data missing from server response!</div>
    }

    const boardProps: BoardProps = {
        playerID: player.id,
        credentials: player.credentials,
        matchID: matchID.mid,
        
        isConnected: true, // See earlier 'to do' comment.

        ctx: makeContext(player, match),

        // The need for the conversion shows soemthing isn't quite right.
        matchData: match.playerData.map(convertPlayerData),

        moves: match.moves,

        events: {
            endTurn: match.endTurn,
            endGame: () => { throw new Error("endGame not implemented") }   
        },

        G: match.state,
    }

    return <GameBoard game={game} bgioProps={boardProps} />
}
