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

const Visiblity = styled.div<{visible: boolean}>`
    visibility: ${props => props.visible ? "visible" : "hidden"};
`;

const Label = styled.span<{leftPadding?: boolean}>`
    padding-left: ${props => props.leftPadding ? "1em" : "0px"};
    font-weight: bold;
    width: 500px; // Hard coding is a KLUDGE
`;

export function Scores() : JSX.Element {
    const {
        G: {scoreCarriedOver, heldDice, scoreToBeat, prevRollHeldScore}, 
        getPlayerName
    } = useGameContext();

    const scoreToBeatText = () => {
        sAssert(scoreToBeat);
        if(scoreToBeat.value === 0) {
            return "0";
        }
        return `${scoreToBeat.value} (set by ${getPlayerName(scoreToBeat.setBy)})`;
    };

    const heldText = () => {
        if(heldDice.score === 0) {
            return "";
        }
        return `${heldDice.score} (${heldDice.categories.join(", ")})`;
    };

    const scoreThisTurnText = () => {
        if(scoreCarriedOver === 0) {
            return `${heldDice.score}`;
        }
        const total = scoreCarriedOver + heldDice.score;
        return `${total} (includes ${scoreCarriedOver} carried over)`;
    };

    return <OuterDiv>
        <Padding height="8px"/>

        <Label>Score:</Label>
        <div>
            <Label leftPadding={true}>last roll: </Label>
            <span>{prevRollHeldScore || ""}</span>
        </div>
        <div>
            <Label leftPadding={true}>this roll: </Label>
            <span>{heldText()}</span>
        </div>

        <Visiblity visible={scoreCarriedOver > 0}>        
            <Label leftPadding={true}>total: </Label>
            <span>{scoreThisTurnText()}</span>
        </Visiblity>

        <Padding height="8px"/>
        {scoreToBeat && <div> 
            <Label>Score to beat: </Label>
            <span>{scoreToBeatText()}</span>
        </div>}

        <Padding height="8px"/>
    </OuterDiv>;
}