import React from "react";
import styled from "styled-components";
import { scoreCardBackgroundColor, scoreCardBoarderColor } from "./style";

const ScoreElementDiv = styled.div<{recentlyChosen?: boolean}>`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
    text-decoration: ${props => props.recentlyChosen ? "underline" : "none" };
`;

export const ColumnHeader = styled.div<{activePlayer?: boolean}>`
    background-color: ${scoreCardBoarderColor};
    color: white; //Kludge - not defined in styles.ts
    padding: 1px;  // Kludge - copied from ScoreElement
    font-weight: bold;
    text-align: center;

    text-decoration: ${props => props.activePlayer ? "underline" : "none"};
`;

export function TotalLabel() : JSX.Element  {
    return <ScoreElementDiv>
        TOTAL
    </ScoreElementDiv>;
}

export const KnownScore = ScoreElementDiv;

interface OptionalScoreProps {
    score: number | undefined;
    action: () => void;
}
export function OptionalScore({score, action}: OptionalScoreProps) : JSX.Element {
    return <button onClick={action}>{score}</button>;
}