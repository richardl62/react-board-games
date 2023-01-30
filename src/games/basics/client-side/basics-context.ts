import React from "react";
import { sAssert } from "../../../utils/assert";
import { BasicsGameProps } from "./basics-game-props";

export interface BasicsContext extends BasicsGameProps {
    extraData: string;
}

export const ReactBasicsContext = React.createContext<BasicsContext|null>(null);

export function makeBasicsContext(gameProps: BasicsGameProps) : BasicsContext {
    return {
        ...gameProps,
        extraData: "dummy",
    };
}

export function useBasicsContext() : BasicsContext {
    const context = React.useContext(ReactBasicsContext);
    sAssert(context);

    return context;
}

