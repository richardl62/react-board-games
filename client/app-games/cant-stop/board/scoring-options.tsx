import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { sAssert } from "@shared/utils/assert";
import { ScoringOptionButton, ScoringOptionsGrid } from "./styles2";

const maxScoringOptions = 6;

export function ScoringOptions() : JSX.Element {
    const {G: {scoringOptions, scoringChoice}, ctx, playerID, moves} = useMatchState();
    const allowMoves = ctx.currentPlayer === playerID;

    sAssert(scoringOptions.length <= maxScoringOptions, 'Too many scoring options');

    const buttons = [];
    for (let buttonIndex = 0; buttonIndex < maxScoringOptions; buttonIndex++) {
        const scoringOption = scoringOptions[buttonIndex];

        const isSelected = scoringChoice === buttonIndex;
        const buttonText = scoringOption ? `${scoringOption?.join(", ")}`: "";

        const onClick = scoringOption && allowMoves ? () => {
            moves.recordScoringChoice(scoringOption);
        } : undefined;
         
        buttons.push(
            <ScoringOptionButton
                key={buttonIndex}
                onClick={onClick}
                underline={isSelected}
            >
                {buttonText}
            </ScoringOptionButton>
        )
    }    
    
    return <ScoringOptionsGrid> {buttons}</ScoringOptionsGrid>
}
