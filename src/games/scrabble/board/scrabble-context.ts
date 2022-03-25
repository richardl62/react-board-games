import React, { Dispatch } from "react";
import { sAssert } from "../../../utils/assert";
import { LocalGameState } from "../local-actions/local-game-state";
import { ActionType } from "../local-actions/local-game-state-reducer";
import { ScrabbleConfig } from "../config";
import { WrappedGameProps } from "../../../app-game-support";
import { MoveHistoryElement } from "../global-actions/move-hstory";
import { ClientMoves } from "../global-actions/bgio-moves";

export interface ScrabbleContext extends LocalGameState {
    readonly bgioProps: WrappedGameProps<unknown, ClientMoves>; // Bgio properties other than game state
    readonly config: ScrabbleConfig;
    readonly dispatch:  Dispatch<ActionType>;
    readonly isLegalWord: (word: string) => boolean;
    readonly moveHistory: MoveHistoryElement[];
    readonly serverError: string | null;
}

export const ReactScrabbleContext = React.createContext<ScrabbleContext|null>(null);

export function useScrabbleContext() : ScrabbleContext {
    const context = React.useContext(ReactScrabbleContext);
    sAssert(context);

    return context;
}

