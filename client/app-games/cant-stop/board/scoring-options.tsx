import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { sAssert } from "@shared/utils/assert";

const maxScoringOptions = 6;

export function ScoringOptions({selectedScoringOption, setSelectedScoringOption}: {
    selectedScoringOption: number | null;
    setSelectedScoringOption: (value: number | null) => void;
}) : JSX.Element {
    const {scoringOptions, ctx, playerID, moves} = useMatchState();
    const allowMoves = ctx.currentPlayer === playerID;

    sAssert(scoringOptions.length <= maxScoringOptions, 'Too many scoring options');

    const buttons = [];
    for (let buttonIdx = 0; buttonIdx < maxScoringOptions; buttonIdx++) {
        const scoringOption = scoringOptions[buttonIdx];
        const isSelected = selectedScoringOption === buttonIdx;
        const buttonText = isSelected ? `► ${scoringOption?.join(", ")}` : scoringOption?.join(", ");
        if (scoringOption) {
            buttons.push(
                <button
                    key={buttonIdx} 
                    onClick={() => {
                        moves.recordScoringChoice(scoringOption);
                        setSelectedScoringOption(buttonIdx);
                    }}
                    disabled={!allowMoves}
                >
                    {buttonText}
                </button>
            )
        }
    }    
    
    return <div> {buttons}</div>
}
