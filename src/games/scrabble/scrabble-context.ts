import React from "react";
import { sAssert } from "../../shared/assert";
import { ScrabbleContext } from "./board/game-props";

export const ReactScrabbleContext = React.createContext<ScrabbleContext|null>(null);

export function useScrabbleContext() : ScrabbleContext {
    const context = React.useContext(ReactScrabbleContext);
    sAssert(context);

    return context;
}

