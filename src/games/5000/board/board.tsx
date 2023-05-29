import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { Scores } from "./scores";
import { PlayerOptions } from "./player-options";
import { ScorePads } from "./score-pads";

function Board() : JSX.Element {
    const {G: {faces,  rollCount, held, turnOverRollCount }, diceSpin,moves} = useGameContext();
    const turnOver = turnOverRollCount === rollCount;
    
    return <div>
        <div>Dice Spin: {diceSpin}</div>
        <DiceSet 
            faces={faces} 
            rollIfChanged={rollCount === 0 ? undefined : rollCount}
            held={held}
            setHeld={(index, held) => turnOver || moves.setHeld({index, held})}
        />
        <PlayerOptions/>
        <Scores/>
        <ScorePads />
    </div>;
}

export default Board;

