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

    const { connectionStatus, moves, events, serverMatchData,  connectionError, reconnecting, rejectionReason } = onlineMatchData;

    // if ( serverMatchData === null) {
    //     if (connectionError) {
    //         return <div>
    //             {rejectionReason && <div>Connection rejected: {rejectionReason}</div>}
    //             <div>Connection error: {connectionError}</div>

    //             {reconnecting && <div>Attempting reconnecting…</div>}

    //         </div>
    //     } else {
    //         return <div>Loading...</div>;
    //     }
    // }

    return <div>
        {reconnecting && <div>Attempting reconnecting…</div>}
        {rejectionReason && <div>Connection rejected: {rejectionReason}</div>}
        {connectionError && <div>Connection error: {connectionError}</div>}

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
