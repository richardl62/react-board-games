import { AppGame, MatchID, Player } from "@/app-game-support";
import { JSX, useEffect, useState } from "react";
import { GameBoardWrapper } from "../game-board-wrapper";
import { useOnlineMatchActions } from "./use-online-match-actions";
import { useServerConnection } from "./use-server-connection";
import { WsServerResponse } from "@shared/ws-server-response";

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const serverConnection = useServerConnection({matchID, player});
    const {moves, events, actionRequestStatus} = useOnlineMatchActions(game, player, serverConnection);
    const { connectionStatus, serverResponse: currentServerResponse } = serverConnection;

    // To improve behaviour if there is a temporary loss of connection to the server
    // record the last non-null server response.
    const [ lastServerResponse, setLastServerResponse ] = useState<WsServerResponse | null>(null);

    // Reset the cached response if the match ID changes. 
    useEffect(() => {
        setLastServerResponse(null);
    }, [matchID]);

    // Cache the last non-null server response.
    useEffect(() => {
        if (currentServerResponse !== null) {
            setLastServerResponse(currentServerResponse);
        }
    }, [currentServerResponse]);

    if ( lastServerResponse ) {
        return <GameBoardWrapper
            game={game}
            playerID={player.id}
            connectionStatus={connectionStatus}
            actionRequestStatus={actionRequestStatus}
            serverMatchData={lastServerResponse.matchData}
            errorInLastAction={lastServerResponse.errorInLastAction}
            moves={moves}
            events={events}
        />
    }

    // If the status is 'connected' then we must be waiting for the first server response.
    // To keep things simple, report this to the user in the same way as will connected.
    if (connectionStatus === "connecting" || connectionStatus === "connected") {
        return <div>Connecting ...</div>;
    }

    const { reason, code } = connectionStatus.closeEvent;
    if ( reason ) {
        return <div>ERROR: Cannot join match ({reason})</div>;
    }

    return <div>ERROR: Cannot connect to server (code {code})</div>;

}
