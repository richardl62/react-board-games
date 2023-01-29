import React from "react";
import { sAssert } from "../../../utils/assert";
import { ServerData } from "../server-side/server-data";
import { BoilerplateGameProps } from "./boilerplate-game-props";

export interface BoilerplateContext extends ServerData {
    extraData: string;
}

export const ReactBoilerplateContext = React.createContext<BoilerplateContext|null>(null);

export function makeBoilerplateContext(gameProps: BoilerplateGameProps) : BoilerplateContext {
    return {
        ...gameProps.G,
        extraData: "extra data"
    };
}

export function useBoilerplateContext() : BoilerplateContext {
    const context = React.useContext(ReactBoilerplateContext);
    sAssert(context);

    return context;
}

