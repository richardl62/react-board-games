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
    const {G: {scoreCarriedOver, diceScores, scoreToBeat}, getPlayerName} = useGameContext();

    let scoreToBeatText = "";
    if(scoreToBeat) {
        scoreToBeatText = `${scoreToBeat.value}`;
        if(scoreToBeat.value > 0) {
            scoreToBeatText += ` (set by ${getPlayerName(scoreToBeat.setBy)})`;
        }
    }

    let scoreLastRollText = `${diceScores.prevRollHeld}`;
    if (scoreCarriedOver > 0) {
        scoreLastRollText += ` + ${scoreCarriedOver} carried over`;
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
        <div>
            <Label>Last roll: </Label>
            <span>{scoreLastRollText}</span>
        </div>
        <div>
            Held: {heldText}
        </div>
    </OuterDiv>;
}