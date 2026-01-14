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

    const { connectionStatus, moves, events, serverMatchData,  connectionError, reconnecting } = onlineMatchData;

    if (serverMatchData === null) {
        if (connectionError) {
            return <div> Error: {connectionError} {reconnecting ? "Attempting reconnecting…" : ""}</div>;
        } else {
            return <div>Loading...</div>;
        }
    }

    return <div>
        {reconnecting && <div>Reconnecting…</div>}
        <GameBoard
            game={game}
            playerID={player.id}
            connectionStatus={connectionStatus}
            serverMatchData={serverMatchData}
            moves={moves}
            events={events}
        />
    </div>
}
