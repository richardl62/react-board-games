import React from "react";
import { sAssert } from "../../../utils/assert";

export interface BoilerplateContext {
    dummyData: string;
}

export const ReactBoilerplateContext = React.createContext<BoilerplateContext|null>(null);

export function makeBoilerplateContext() : BoilerplateContext {
    return {
        dummyData: "boiler plate"
    };
}

export function useBoilerplateContext() : BoilerplateContext {
    const context = React.useContext(ReactBoilerplateContext);
    sAssert(context);

    return context;
}

