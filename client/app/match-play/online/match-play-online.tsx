import { JSX } from "react";
import { AppGame, MatchID, Player } from "@/app-game-support";
import { useOnlineMatchData } from "./use-online-match-data";

import { BoardProps, MatchDataElem } from "@shared/game-control/board-props";
import { PublicPlayerMetadata } from "@shared/lobby/types.js";
import { Ctx } from "@shared/game-control/ctx";
import { GameBoard } from "../game-board";
import { ConnectionStatus } from "./connection-status";


function convertPlayerData(md: PublicPlayerMetadata) : MatchDataElem {
    const {id, name, isConnected} = md;
    return {id, isConnected, name: name || undefined}
}

export function MatchPlayOnline(props: {
    game: AppGame;
    matchID: MatchID;
    player: Player;
}): JSX.Element {
    const { game, matchID, player } = props;
    const matchData = useOnlineMatchData(game, {matchID, player});
    
    const { match } = matchData;

    const boardProps: BoardProps | null = match && {
        playerID: player.id,
        credentials: player.credentials,
        matchID: matchID.mid,
        
        isConnected: true, // See earlier 'to do' comment.

        ctx: new Ctx(match.ctxData),

        // The need for the conversion shows soemthing isn't quite right.
        matchData: match.playerData.map(convertPlayerData),

        moves: match.moves,

        events: match.events,

        G: match.state,
    }

    return <div>
        <ConnectionStatus matchData={matchData} />
        {boardProps && <GameBoard game={game} bgioProps={boardProps} />}
    </div>;
}


