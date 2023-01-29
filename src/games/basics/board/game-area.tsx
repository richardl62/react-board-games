import React from "react";
import { useBasicsContext } from "../client-side/basics-context";

export function GameArea() : JSX.Element {
    const context = useBasicsContext();
    const {count, moves, events} = context;
    return <div>
        <button onClick={()=>moves.add(1)}>+1</button>
        <button onClick={()=>moves.add(-1)}>-1</button>
        <button type="button" onClick={() => events.endTurn()}>End Turn</button>
        <div>{count}</div>
    </div>;
}

