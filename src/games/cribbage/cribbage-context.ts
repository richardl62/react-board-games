import React from "react";
import { sAssert } from "../../utils/assert";
import { ActionType } from "./client-side/use-cribbage-reducer";
import { GameState } from "./client-side/game-state";

interface Context extends GameState {
    dispatch: React.Dispatch<ActionType>;
}

export const ReactCribbageContext = React.createContext<Context|null>(null);

export function useCribbageContext() : Context {
    const context = React.useContext(ReactCribbageContext);
    sAssert(context);

    return context;
}

