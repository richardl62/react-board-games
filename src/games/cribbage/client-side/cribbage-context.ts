import React from "react";
import { sAssert } from "../../../utils/assert";
import { CardSetID, PlayerID, ServerData } from "../server-side/server-data";
import { ClientMoves } from "../server-side/moves";
import { CribbageGameProps } from "./cribbage-game-props";
import { nonJoinedPlayerName } from "../../../app-game-support";

export interface CribbageContext extends ServerData {
    moves: ClientMoves;
    numPlayers: number;

    me: PlayerID;
    pone: PlayerID;

    poneName: string;
}

export const ReactCribbageContext = React.createContext<CribbageContext|null>(null);

export function makeCribbageContext(gameProps: CribbageGameProps) : CribbageContext {
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


export function useCribbageContext() : CribbageContext {
    const context = React.useContext(ReactCribbageContext);
    sAssert(context);

    return context;
}

