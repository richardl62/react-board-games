import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { SampleScorePads } from "../../../utils/score-pad";
import { ShowScores } from "./show-scores";

function Board() : JSX.Element {
    const {G: {faces, rollCount, held}, moves} = useGameContext();

    return <div>
        <DiceSet 
            faces={faces} 
            rollIfChanged={rollCount === 0 ? undefined : rollCount}
            held={held}
            setHeld={(index, held) => moves.setHeld({index, held})}
        />
        <ShowScores faces={faces} held={held} />
        <button onClick={() => moves.roll()}>Roll</button>
        <SampleScorePads />
    </div>;
}

export default Board;

