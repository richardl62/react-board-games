import React, { Dispatch } from "react";
import { sAssert } from "../../../utils/assert";
import { LocalGameState } from "../local-actions/local-game-state";
import { ActionType } from "../local-actions/local-game-state-reducer";
import { ScabbbleGameProps } from "./game-props";
import { ScrabbleConfig } from "../config";

export interface ScrabbleContext extends LocalGameState {
    readonly bgioProps: ScabbbleGameProps;
    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>;
    readonly isLegalWord: (word: string) => boolean;
}

export const ReactScrabbleContext = React.createContext<ScrabbleContext|null>(null);

export function useScrabbleContext() : ScrabbleContext {
    const context = React.useContext(ReactScrabbleContext);
    sAssert(context);

    return context;
}

