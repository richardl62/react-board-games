import { JSX } from "react";
import { useMatchState } from "../match-state/match-state";
import { sAssert } from "@shared/utils/assert";
import { ScoringOptionDiv, ScoringOptionsGrid } from "./styles";

const maxScoringOptions = 6;

export function ScoringOptions({selectedScoringOption, setSelectedScoringOption}: {
    selectedScoringOption: number | null;
    setSelectedScoringOption: (value: number | null) => void;
}) : JSX.Element {
    const {scoringOptions, ctx, playerID, moves} = useMatchState();
    const allowMoves = ctx.currentPlayer === playerID;

    sAssert(scoringOptions.length <= maxScoringOptions, 'Too many scoring options');

    const buttons = [];
    for (let buttonIndex = 0; buttonIndex < maxScoringOptions; buttonIndex++) {
        const scoringOption = scoringOptions[buttonIndex];

        const isSelected = selectedScoringOption === buttonIndex;
        const buttonText = scoringOption ? `${scoringOption?.join(", ")}`: "";

        const onClick = scoringOption && allowMoves ? () => {
            moves.recordScoringChoice(scoringOption);
            setSelectedScoringOption(buttonIndex);
        } : undefined;
         
        buttons.push(
            <ScoringOptionDiv
                key={buttonIndex}
                onClick={onClick}
                underline={isSelected}
            >
                {buttonText}
            </ScoringOptionDiv>
        )
    }    
    
    return <ScoringOptionsGrid> {buttons}</ScoringOptionsGrid>
}
