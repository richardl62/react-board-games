import React from "react";
import { sAssert } from "../../../utils/assert";
import { ClientMoves } from "../server-side/moves";
import { ServerData } from "../server-side/server-data";
import { BasicsGameProps } from "./basics-game-props";

export interface BasicsContext extends ServerData {
    moves: ClientMoves;
    events: BasicsGameProps["events"];
}

export const ReactBasicsContext = React.createContext<BasicsContext|null>(null);

export function makeBasicsContext(gameProps: BasicsGameProps) : BasicsContext {
    return {
        ...gameProps.G,
        moves: gameProps.moves,
        events: gameProps.events,
    };
}

export function useBasicsContext() : BasicsContext {
    const context = React.useContext(ReactBasicsContext);
    sAssert(context);

    return context;
}

