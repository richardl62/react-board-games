import React from "react";
import { useBasicsContext } from "../client-side/basics-context";

export function GameArea() : JSX.Element {
    const context = useBasicsContext();
    return <div>{"Count " + context.count}</div>;
}

