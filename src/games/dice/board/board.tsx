import React from "react";
import { useGameContext } from "../client-side/game-context";
import { DiceSet } from "../../../utils/dice/dice-set";
import { SampleScorePads } from "../../../utils/score-pad";
import { Scores } from "./scores";
import { RollBustStop } from "./roll-bust-stop";

function Board() : JSX.Element {
    const {G: {faces, rollCount, held }, moves} = useGameContext();

    return <div>
        <DiceSet 
            faces={faces} 
            rollIfChanged={rollCount === 0 ? undefined : rollCount}
            held={held}
            setHeld={(index, held) => moves.setHeld({index, held})}
        />
        <Scores/>
        <RollBustStop/>
        <SampleScorePads />
    </div>;
}

export default Board;

