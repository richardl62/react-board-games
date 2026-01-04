import { nonJoinedPlayerName } from "@/app-game-support";
import { useStandardBoardContext } from "@/app-game-support/standard-board";
import { WrappedMatchProps } from "@/app-game-support/wrapped-match-props";
import { ClientMoves } from "@game-control/games/cribbage/moves/moves";
import { CardSetID, PlayerID, ServerData } from "@game-control/games/cribbage/server-data";
import { sAssert } from "@utils/assert";

export interface CribbageState extends ServerData {
    moves: ClientMoves;
    numPlayers: number;

    me: PlayerID;
    pone: PlayerID;

    poneName: string;
}

export function useCribbageState() : CribbageState {
    const gameProps = useStandardBoardContext() as WrappedMatchProps<ServerData, ClientMoves>;

    let me: PlayerID;
    let pone: PlayerID;
    let poneID : "0" | "1";

    sAssert(gameProps.playerID === "0" || gameProps.playerID === "1");
    
    if(gameProps.playerID === "0") {
        me = CardSetID.Player0;
        pone = CardSetID.Player1;
        poneID = "1";
    } else {
        me = CardSetID.Player1;
        pone = CardSetID.Player0;
        
        poneID = "0";
    }

    const { playerData } = gameProps;
    const poneName = playerData[poneID]?.name || nonJoinedPlayerName;


    return {
        ...gameProps.G,
        moves: gameProps.moves,
        numPlayers: gameProps.ctx.numPlayers,
        me,
        pone,
        poneName,
    };
}

