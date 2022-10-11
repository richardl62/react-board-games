import React from "react";
import { sAssert } from "../../../utils/assert";
import { CardSetID, PlayerID, ServerData } from "../server-side/server-data";
import { ClientMoves } from "../server-side/moves";
import { CribbageGameProps } from "./cribbage-game-props";

interface CribbageContext extends ServerData {
    moves: ClientMoves;
    me: PlayerID;
    pone: PlayerID;
}

export const ReactCribbageContext = React.createContext<CribbageContext|null>(null);

export function makeCribbageContext(gameProps: CribbageGameProps) : CribbageContext {
    let me: PlayerID;
    let pone: PlayerID;

    sAssert(gameProps.playerID === "0" || gameProps.playerID === "1");
    
    if(gameProps.playerID === "0") {
        me = CardSetID.Player0;
        pone = CardSetID.Player1;
    } else {
        me = CardSetID.Player1;
        pone = CardSetID.Player0;
    }

    return {
        ...gameProps.G,
        moves: gameProps.moves,
        me,
        pone,
    };
}


export function useCribbageContext() : CribbageContext {
    const context = React.useContext(ReactCribbageContext);
    sAssert(context);

    return context;
}

