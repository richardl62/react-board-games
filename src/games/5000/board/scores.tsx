import React from "react";
import { useGameContext } from "../client-side/game-context";
import styled from "styled-components";
import { sAssert } from "../../../utils/assert";

const OuterDiv = styled.div`
    font-family: Arial;
    font-size: 16px;
`;

const Padding = styled.div<{height: string}>`
    height: ${props => props.height};
`;


const Label = styled.span<{leftPadding?: boolean}>`
    padding-left: ${props => props.leftPadding ? "1em" : "0px"};
    font-weight: bold;
`;

export function Scores() : JSX.Element {
    const {G: {scoreCarriedOver, diceScores, scoreToBeat}, getPlayerName} = useGameContext();

    const scoreToBeatText = () => {
        sAssert(scoreToBeat);
        if(scoreToBeat.value === 0) {
            return "0";
        }
        return `${scoreToBeat.value} (set by ${getPlayerName(scoreToBeat.setBy)})`;
    };

    const heldText = () => {
        if(diceScores.held === 0) {
            return "";
        }
        return `${diceScores.held} (${diceScores.heldCategories.join(", ")})`;
    };

    const scoreThisTurnText = () => {
        if(scoreCarriedOver === 0) {
            return `${diceScores.held}`;
        }
        const total = scoreCarriedOver + diceScores.held;
        return `${total} (includes ${scoreCarriedOver} carried over)`;
    };

    return <OuterDiv>
        <Padding height="8px"/>

        <Label>Held dice:</Label>
        <div>
            <Label leftPadding={true}>last roll: </Label>
            <span>{diceScores.prevRollHeld || ""}</span>
        </div>
        <div>
            <Label leftPadding={true}>this roll: </Label>
            <span>{heldText()}</span>
        </div>

        <Padding height="8px"/>
        {scoreToBeat && <div> 
            <Label>Score to beat: </Label>
            <span>{scoreToBeatText()}</span>
        </div>}
        
        <div>        
            <Label>Score this turn: </Label>
            <span>{scoreThisTurnText()}</span>
        </div>
        <Padding height="8px"/>
    </OuterDiv>;
}