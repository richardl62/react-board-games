import { JSX } from "react";
import { TurnControl } from "./turn-control";
import { Columns } from "./columns";
import { BoardText } from "./board-text/board-text";

function Board() : JSX.Element {
    
    // Very crude board for now.
    return <div>
        <BoardText/>
        <Columns/>
        <TurnControl/>
    </div>
}

export default Board;

