import React from "react";
import { sAssert } from "../../utils/assert";
import { GameState } from "./actions/game-state";

export const ReactCribbageContext = React.createContext<GameState|null>(null);

export function useCribbageContext() : GameState {
    const context = React.useContext(ReactCribbageContext);
    sAssert(context);

    return context;
}

