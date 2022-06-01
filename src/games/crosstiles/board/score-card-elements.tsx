import React from "react";
import styled from "styled-components";
import { scoreCardBackgroundColor, scoreCardBoarderColor, scoreCardHeaderTextColor } from "./style";

const ScoreElementDiv = styled.div<{recentlyChosen?: boolean}>`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
    text-decoration: ${props => props.recentlyChosen ? "underline" : "none" };
    text-align: end;
`;

export const ColumnHeader = styled.div<{activePlayer?: boolean}>`
    background-color: ${scoreCardBoarderColor};
    color: ${scoreCardHeaderTextColor};
    padding: 1px;
    padding-right: 4px;
    font-weight: bold;
    text-align: center;

    text-decoration: ${props => props.activePlayer ? "underline" : "none"};
`;

export const KnownScore = ScoreElementDiv;

interface OptionalScoreProps {
    score: number | undefined;
    action: () => void;
}
export function OptionalScore({score, action}: OptionalScoreProps) : JSX.Element {
    return <button onClick={action}>{score}</button>;
}