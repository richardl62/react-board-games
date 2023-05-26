import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { Scores } from "./scores";
import { RollBustStop } from "./roll-bust-stop";
import { ScorePads } from "./score-pads";

function Board() : JSX.Element {
    const {G: {faces, rollCount, held, turnOverRollCount }, moves} = useGameContext();
    const turnOver = turnOverRollCount === rollCount;
    
    return <div>
        <DiceSet 
            faces={faces} 
            rollIfChanged={rollCount === 0 ? undefined : rollCount}
            held={held}
            setHeld={(index, held) => turnOver || moves.setHeld({index, held})}
        />
        <Scores/>
        <RollBustStop/>
        <ScorePads />
    </div>;
}

export default Board;

