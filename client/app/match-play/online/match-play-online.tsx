import { AppGame, MatchID, Player } from "@/app-game-support";
import { JSX } from "react";
import { GameBoard } from "../game-board";
import { useOnlineMatchData } from "./use-online-match-data";
import { ConnectionStatus } from "./use-server-connection";

function ShowConnectionStatus({connectionStatus} : {connectionStatus: ConnectionStatus}) : JSX.Element {
    if ( typeof connectionStatus === "string" ) {
        return <div>Connection status: {connectionStatus}</div>;
    } else  {
        const {closeEvent: {code, reason}, reconnecting} = connectionStatus;
        return <div>`Connection close: code={code}, reason={reason}, reconnecting={reconnecting ? "true" : "false"}`</div>
    }
}

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const onlineMatchData = useOnlineMatchData(game, {matchID, player});

    const { connectionStatus, moves, events, serverMatchData, waitingForServer } = onlineMatchData;


    return <div>
        <ShowConnectionStatus connectionStatus={connectionStatus} />
        {waitingForServer && <div>Waiting for server response…</div>}


        { serverMatchData ?
            <GameBoard
                game={game}
                playerID={player.id}
                connectionStatus={connectionStatus}
                serverMatchData={serverMatchData}
                moves={moves}
                events={events}
            />
            :  <div>No match data available.</div>
        }
    </div>
}
