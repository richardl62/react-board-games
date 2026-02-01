import { JSX } from "react";
import { StandardMatchPlay } from "./standard-match-play";
import { ConnectionStatus, useServerConnection } from "./use-server-connection";
import { useLastServerResponse } from "./use-last-server-response";
import { AppGame, Player, MatchID } from "@/app-game-support";

export function MatchPlayOnline({ game, player, matchID }: { 
    game: AppGame; 
    player: Player; 
    matchID: MatchID;
}): JSX.Element {
    const serverConnection = useServerConnection({matchID, player});
    const { serverResponse: currentServerResponse } = serverConnection;

    // To improve behaviour if there is a temporary loss of connection to the server
    // record the last non-null server response.
    const lastServerResponse = useLastServerResponse(matchID, currentServerResponse);

    if ( !lastServerResponse ) {
        return <ShowConnectionStatus connectionStatus={serverConnection.connectionStatus} />;
    }
    
    return <StandardMatchPlay
        game={game}
        player={player}
        serverConnection={{ ...serverConnection, serverResponse: lastServerResponse }}
    />;
}

// A simple component for use when there has not been a response from the server.
// (To Do: Try to think of a better name.)
function ShowConnectionStatus({ connectionStatus }: { connectionStatus: ConnectionStatus}): JSX.Element { 
    // If the status is 'connected' then assume we are waiting a response from the server
    // and to keep things simple, report this in the same way as when waiting to connect..
    if (connectionStatus === "connecting" || connectionStatus === "connected") {
        return <div>Connecting ...</div>;
    }

    const { reason, code } = connectionStatus.closeEvent;
    if ( reason ) {
        return <div>ERROR: Cannot join match ({reason})</div>;
    }

    return <div>ERROR: Cannot connect to server (code {code})</div>
}