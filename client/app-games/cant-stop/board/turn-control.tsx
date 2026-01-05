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
    const state = useMatchState();
    const{ 
        G: { rollCount },
        scoringOptions, 
        ctx, 
        playerID, 
        moves, 
    } = state;
    
    const [ selectedScoringOption, setSelectedScoringOption ] = useState<number | null>(null);

    useEffect(() => {
        setSelectedScoringOption(null);
    }, [rollCount.total]);

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

    const rollAndDontDisabled = movesDisabled || selectedScoringOption === null;
    //const blockers = currentBlockingColumns(state, selectedScoringOption);

    return <div>
        <button 
            onClick={() => moves.roll()} 
            disabled={rollAndDontDisabled}
        >
            Roll
        </button>

        <ScoringOptions
            selectedScoringOption={selectedScoringOption}
            setSelectedScoringOption={setSelectedScoringOption} 
        />

        <button 
            onClick={() => moves.stopRolling()}
            disabled={rollAndDontDisabled}
        >
            Don't
        </button>

        {/* {blockers !== null && <div>
            Blocked on columns {blockers.join(", ")}
        </div>} */}
    </div>;
}

// function currentBlockingColumns(state: MatchState, selectedScoringOption: number | null): number[] | null {
//     const { G: { columnHeights }, isBlocked, playerID, scoringOptions } = state;
//     if (selectedScoringOption !== null) {
//         const blockers =  scoringOptions[selectedScoringOption].filter(col => {
//             const height = columnHeights[playerID][col].thisScoringChoice;
//             return height !== "full" && isBlocked({ playerID, column: col, height });
//         });

//         if(blockers.length > 0) {
//             return blockers;
//         }
//     }
//     return null;
// }