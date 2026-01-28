import { AppGame, MatchID, Player } from "@/app-game-support";
import { JSX, useEffect, useState } from "react";
import { GameBoard } from "../game-board";
import { useOnlineMatchActions } from "./use-online-match-actions";
import { useServerConnection } from "./use-server-connection";
import { WsServerResponse } from "@shared/ws-server-response";

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const serverConnection = useServerConnection({matchID, player});
    const {moves, events, waitingForServer} = useOnlineMatchActions(game, player, serverConnection);
    const { connectionStatus, serverResponse: currentServerResponse } = serverConnection;

    // To improve behaviour if there is a temporary loss of connection to the server
    // record the last non-null server response.
    const [ lastServerResponse, setLastServerResponse ] = useState<WsServerResponse | null>(null);
    useEffect(() => {
        if (currentServerResponse !== null) {
            setLastServerResponse(currentServerResponse);
        }
    }, [currentServerResponse]);

    // Reset the cached response if the match ID changes.
    useEffect(() => {
        setLastServerResponse(null);
    }, [matchID]);

    return lastServerResponse ?
        <GameBoard
            game={game}
            playerID={player.id}
            connectionStatus={connectionStatus}
            waitingForServer={waitingForServer}
            serverMatchData={lastServerResponse.matchData}
            errorInLastAction={lastServerResponse.errorInLastAction}
            moves={moves}
            events={events}
        />
        : <div>Loading ....</div>
}
