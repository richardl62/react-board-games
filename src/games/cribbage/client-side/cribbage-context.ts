import React from "react";
import { sAssert } from "../../../utils/assert";
import { ServerData } from "../server-side/server-data";
import { ClientMoves } from "../server-side/moves";

interface Context extends ServerData {
    moves: ClientMoves;
}

export const ReactCribbageContext = React.createContext<Context|null>(null);

export function useCribbageContext() : Context {
    const context = React.useContext(ReactCribbageContext);
    sAssert(context);

    return context;
}

