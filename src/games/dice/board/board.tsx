import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { SampleScorePads } from "../../../utils/score-pad";

function Board() : JSX.Element {
    const {G: {faces, rollCount, held}, moves} = useGameContext();
 
    return <div>
        <DiceSet 
            faces={faces} 
            rollIfChanged={rollCount === 0 ? undefined : rollCount}
            held={held}
            setHeld={(index, held) => moves.setHeld({index, held})}
        />
        <button onClick={() => moves.roll()}>Roll</button>
        <SampleScorePads />
    </div>;
}

export default Board;

