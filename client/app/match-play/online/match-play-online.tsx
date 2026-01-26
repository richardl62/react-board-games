import { AppGame, MatchID, Player } from "@/app-game-support";
import { JSX } from "react";
import { GameBoard } from "../game-board";
import { useOnlineMatchData } from "./use-online-match-data";


export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const onlineMatchData = useOnlineMatchData(game, {matchID, player});

    const { connectionStatus, moves, events, serverMatchData, errorInLastAction: errorInLastAction, waitingForServer } = onlineMatchData;


    return serverMatchData ?
        <GameBoard
            game={game}
            playerID={player.id}
            connectionStatus={connectionStatus}
            waitingForServer={waitingForServer}
            serverMatchData={serverMatchData}
            errorInLastAction={errorInLastAction}
            moves={moves}
            events={events}
        />
        : <div>No match data available.</div>

}
