import React from "react";
import { useBoilerplateContext } from "../client-side/boilerplate-context";

export function GameArea() : JSX.Element {
    const context = useBoilerplateContext();
    return <div>{context.dummyData}</div>;
}

