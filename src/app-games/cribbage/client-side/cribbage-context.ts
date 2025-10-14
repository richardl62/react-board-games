import { sAssert } from "../../../utils/assert";
import { CardSetID, PlayerID, ServerData } from "../server-side/server-data";
import { ClientMoves } from "../server-side/moves";
import { nonJoinedPlayerName } from "../../../app-game-support";
import { useStandardBoardContext } from "../../../app-game-support/standard-board";
import { WrappedGameProps } from "../../../app-game-support/wrapped-game-props";

export interface CribbageContext extends ServerData {
    moves: ClientMoves;
    numPlayers: number;

    me: PlayerID;
    pone: PlayerID;

    poneName: string;
}

export function useCribbageContext() : CribbageContext {
    const gameProps = useStandardBoardContext() as WrappedGameProps<ServerData, ClientMoves>;

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

