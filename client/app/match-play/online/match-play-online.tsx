import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { MatchDataElem } from "@/app-game-support/board-props";
import { Ctx } from "@shared/game-control/ctx";
import { PublicPlayerMetadata } from "@shared/lobby/types.js";
import { JSX } from "react";
import { GameBoard } from "../game-board";
import { useOnlineMatchData } from "./use-online-match-data";
import { sAssert } from "@shared/utils/assert";

function convertPlayerData(md: PublicPlayerMetadata) : MatchDataElem {
    const {id, name, isConnected} = md;
    return {id, isConnected, name: name || undefined}
}

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const onlineMatchData = useOnlineMatchData(game, {matchID, player});

    const { moves, events, serverMatchData, connectionStatus } = onlineMatchData;

    sAssert(connectionStatus !== "offline", "MatchPlayOnline called with offline connection status");

    if (connectionStatus.serverRestarted) {
        return <div>Server has restarted - cannot continue</div>;
    }

    if (serverMatchData === null) {
        if (connectionStatus.error) {
            return <div>
                <div> Server reports fatal error. Cannot continue</div>                
                <div> (message: {connectionStatus.error})</div>                
            </div>;
        }
   
        return <div>Loading...</div>;
    }

    const boardProps: BoardProps = {
        playerID: player.id,

        connectionStatus,

        ctx: new Ctx(serverMatchData.ctxData),

        // The need for the conversion shows something isn't quite right.
        matchData: serverMatchData.playerData.map(convertPlayerData),

        moves,
        
        events,

        G: serverMatchData.state,
    }

    return <GameBoard game={game} bgioProps={boardProps} />
}


