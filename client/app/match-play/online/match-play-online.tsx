import { JSX } from "react";
import { AppGame, BoardProps, MatchID, Player } from "@/app-game-support";
import { OnlineMatchData, useOnlineMatchData } from "./use-online-match-data";
import { PublicPlayerMetadata } from "@shared/lobby/types.js";
import { Ctx } from "@shared/game-control/ctx";
import { GameBoard } from "../game-board";
import { ConnectionStatus } from "./connection-status";
import { MatchDataElem } from "@/app-game-support/board-props";

function convertPlayerData(md: PublicPlayerMetadata) : MatchDataElem {
    const {id, name, isConnected} = md;
    return {id, isConnected, name: name || undefined}
}

function Board({game, player, onlineMatchData}: { 
    game: AppGame;
    player: Player;
    onlineMatchData : OnlineMatchData 
}): JSX.Element {

    const { moves, events, serverMatchData } = onlineMatchData;

    if (serverMatchData === null) {
        return <div>Loading...</div>;
    }

    const boardProps: BoardProps = {
        playerID: player.id,

        isOffline: false,
        isConnected: true, // See earlier 'to do' comment.

        ctx: new Ctx(serverMatchData.ctxData),

        // The need for the conversion shows something isn't quite right.
        matchData: serverMatchData.playerData.map(convertPlayerData),

        moves,
        
        events,

        G: serverMatchData.state,
    }

    return <GameBoard game={game} bgioProps={boardProps} />
}

export function MatchPlayOnline({ game, matchID, player }: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const onelineMatchData = useOnlineMatchData(game, {matchID, player});

    return <div>
        <ConnectionStatus onelineMatchData={onelineMatchData} />
        <Board 
            game={game}
            player={player} 
            onlineMatchData={onelineMatchData}  
        />
    </div>;
}


