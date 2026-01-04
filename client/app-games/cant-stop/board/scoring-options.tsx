import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { sAssert } from "@shared/utils/assert";

const maxScoringOptions = 6;

export function ScoringOptions({setScoreRecorded}: {
    setScoreRecorded: (value: boolean) => void
}) : JSX.Element {
    const {scoringOptions, ctx, playerID, moves} = useMatchState();
    const allowMoves = ctx.currentPlayer === playerID;

    sAssert(scoringOptions.length <= maxScoringOptions, 'Too many scoring options');

    const buttons: JSX.Element[] = [];
    for (let buttonIdx = 0; buttonIdx < maxScoringOptions; buttonIdx++) {
        const scoringOption = scoringOptions[buttonIdx];
        if (scoringOption) {       
            buttons.push(
                <button
                    key={buttonIdx}
                    onClick={() => {
                        moves.recordScoringChoice(scoringOption);
                        setScoreRecorded(true);
                    }}
                    disabled={!allowMoves}
                >
                    {scoringOption.join(", ")}
                </button>
            )
        };
    }
    
    return <div> {buttons}</div>
}   
