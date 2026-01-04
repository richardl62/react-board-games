import { JSX, useEffect, useState } from "react";
import { useMatchState } from "../match-state/match-state";
import { useDiceRotation } from "./rolling-dice";
import { Dice } from "@/utils/dice/dice";
import { ScoringOptions } from "./scoring-options";

export function TurnControl() : JSX.Element {
    const { G: {diceValues} } = useMatchState();
    
    const diceRotation = useDiceRotation();

    const makeDice = (index: number) => (
        <Dice key={"d" + index} face={diceValues[index]} rotation={diceRotation} color={"darkred"} />
    );

    // Crude for now.
    return <div>
        <div> {makeDice(0)} {makeDice(1)} </div>
        <GameButtons />
        <div> {makeDice(2)} {makeDice(3)} </div>
    </div>;
}

function GameButtons() : JSX.Element {
    const { 
        G: {rollCount},
        scoringOptions, 
        ctx, 
        playerID, 
        moves 
    } = useMatchState();
    
    const [ scoreRecorded, setScoreRecorded ] = useState(false);

    useEffect(() => {
        if (rollCount.thisTurn === 0) {
            setScoreRecorded(false);
        }
    }, [rollCount.thisTurn]);

    const movesDisabled = ctx.currentPlayer !== playerID;

    if (rollCount.thisTurn === 0) {
        return <button 
            onClick={() => moves.roll()} 
            disabled={movesDisabled}
        >
            Roll
        </button>;
    }

    if (scoringOptions.length === 0) {
        return <button 
            onClick={() => moves.bust()} 
            disabled={movesDisabled}>
            Bust
        </button>
    }

    const rollAndDontDisabled = movesDisabled || !scoreRecorded;
    
    return <div>
        <button 
            onClick={() => moves.roll()} 
            disabled={rollAndDontDisabled}
        >
            Roll
        </button>

        <ScoringOptions setScoreRecorded={setScoreRecorded} />

        <button 
            onClick={() => moves.stopRolling()}
            disabled={rollAndDontDisabled}
        >
            Don't
        </button>
    </div>
}