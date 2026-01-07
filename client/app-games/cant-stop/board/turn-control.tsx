import { JSX, useEffect, useState } from "react";
import { useMatchState } from "../match-state/match-state";
import { useDiceRotation } from "./dice-rotation";
import { Dice } from "@/utils/dice/dice";
import { ScoringOptions } from "./scoring-options";
import { BustButton, ButtonsDiv, DiceAndButtonsDiv, TwoDiceDiv, NoOptionRollButton, RollDontButton } from "./styles";

export function TurnControl() : JSX.Element {
    const { G: {diceValues} } = useMatchState();
    
    const diceRotation = useDiceRotation();

    const makeDice = (index: number) => (
        <Dice key={"d" + index} face={diceValues[index]} rotation={diceRotation} color={"darkred"} />
    );


    return <DiceAndButtonsDiv>
        <TwoDiceDiv> {makeDice(0)} {makeDice(1)} </TwoDiceDiv>

        <ButtonsDiv> <GameButtons /> </ButtonsDiv>

        <TwoDiceDiv> {makeDice(2)} {makeDice(3)} </TwoDiceDiv>
    </DiceAndButtonsDiv>;
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
        return <NoOptionRollButton 
            onClick={movesDisabled ? undefined : () => moves.roll()} 
        >
            Roll
        </NoOptionRollButton>;
    }

    if (scoringOptions.length === 0) {
        return <BustButton 
            onClick={movesDisabled ? undefined : () => moves.bust()} 
        >
            Bust
        </BustButton>;
    }

    const rollAndDontDisabled = movesDisabled || selectedScoringOption === null;
    //const blockers = currentBlockingColumns(state, selectedScoringOption);

    return <>
        <RollDontButton 
            onClick={() => moves.roll()} 
            disabled={rollAndDontDisabled}
        >
            Roll
        </RollDontButton>

        <ScoringOptions
            selectedScoringOption={selectedScoringOption}
            setSelectedScoringOption={setSelectedScoringOption} 
        />

        <RollDontButton 
            onClick={() => moves.stopRolling()}
            disabled={rollAndDontDisabled}
        >
            Don't
        </RollDontButton>
    </>;
}
