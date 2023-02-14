import React from "react";
import { useGameContext } from "../client-side/game-context";


export function Message() : JSX.Element {
    const { G : { message } } = useGameContext();

    return <div>{message}</div>;
}
