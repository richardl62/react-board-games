import React from "react";
import { sAssert } from "../../../utils/assert";
import { ServerData } from "../server-side/server-data";
import { BasicsGameProps } from "./basics-game-props";

export interface BasicsContext extends ServerData {
    extraData: string;
}

export const ReactBasicsContext = React.createContext<BasicsContext|null>(null);

export function makeBasicsContext(gameProps: BasicsGameProps) : BasicsContext {
    return {
        ...gameProps.G,
        extraData: "extra data"
    };
}

export function useBasicsContext() : BasicsContext {
    const context = React.useContext(ReactBasicsContext);
    sAssert(context);

    return context;
}

