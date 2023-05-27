import React from "react";
import { useGameContext } from "../client-side/game-context";
import styled from "styled-components";

const OuterDiv = styled.div`
    font-family: Arial;
    font-size: 16px;
`;

const Label = styled.span`
    font-weight: bold;
`;

export function Scores() : JSX.Element {
    const {G: {scoreCarriedOver, diceScores, scoreToBeat, held}, getPlayerName} = useGameContext();

    let scoreToBeatText = "";
    if(scoreToBeat) {
        scoreToBeatText = `${scoreToBeat.value}`;
        if(scoreToBeat.value > 0) {
            scoreToBeatText += ` (set by ${getPlayerName(scoreToBeat.setBy)})`;
        }
    }


    let heldText = `${diceScores.held}`;
    if(diceScores.held > 0) {
        heldText += ` (${diceScores.heldCategories.join(", ")})`;
    }

    return <OuterDiv>
        {scoreToBeat && <div> 
            <Label>Score to beat: </Label>
            <span>{scoreToBeatText}</span>
        </div>}

        {diceScores.prevRollHeld > 0 && <div>
            <Label>Last roll: </Label>
            <span>{diceScores.prevRollHeld}</span>
        </div>}

        {held.includes(true) && <div>
            <Label>Held dice: </Label>
            <span>{heldText}</span>
        </div>}

        {scoreCarriedOver > 0 && <div>
            <Label>Carried over: </Label>
            <span>{scoreCarriedOver}</span>
        </div>}
    </OuterDiv>;
}