import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { MatchDataElem } from "@/app-game-support/board-props";
import { Ctx } from "@shared/game-control/ctx";
import { PublicPlayerMetadata } from "@shared/lobby/types.js";
import { JSX } from "react";
import { GameBoard } from "../game-board";
import { useOnlineMatchData } from "./use-online-match-data";


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

    const { connectionStatus, moves, events, serverMatchData,  connectionError } = onlineMatchData;

    if (serverMatchData === null) {
        if (connectionError) {
            return <div> Error: {connectionError} </div>;
        } else {
            return <div>Loading...</div>;
        }
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


