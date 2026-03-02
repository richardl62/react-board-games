import { JSX } from "react";
import { TurnControl } from "./turn-control";
import { Columns } from "./columns";

function Board() : JSX.Element {
    return <div>
        <Columns/>
        <TurnControl/>
    </div>
}

export default Board;

