import React, { Dispatch } from "react";
import { sAssert } from "../../../shared/assert";
import { LocalGameState } from "../actions/local-game-state";
import { ActionType } from "../actions/local-game-state-reducer";
import { ScabbbleGameProps } from "./game-props";
import { ScrabbleConfig } from "../config";

export interface ScrabbleContext extends LocalGameState {
    readonly bgioProps: ScabbbleGameProps,
    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>
}

export const ReactScrabbleContext = React.createContext<ScrabbleContext|null>(null);

export function useScrabbleContext() : ScrabbleContext {
    const context = React.useContext(ReactScrabbleContext);
    sAssert(context);

    return context;
}

