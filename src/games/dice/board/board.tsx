import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice-set";

function Board() : JSX.Element {
    const {G: {faces, rollCount}, moves} = useGameContext();
 
    return <div>
        <DiceSet faces={faces} rollIfChanged={
            rollCount === 0 ? undefined : rollCount
        }/>
        <button onClick={() => moves.roll()}>Roll</button>
    </div>;
}

export default Board;

