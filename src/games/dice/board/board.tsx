import React from "react";
import { useGameContext } from "../client-side/game-context";
import { Dice } from "../../../utils/dice";

function Board() : JSX.Element {
    const {G: {faces}, moves} = useGameContext();
 
    return <div>
        <Dice faces={faces} />
        <button onClick={() => moves.roll()}>Roll</button>
    </div>;
}

export default Board;

