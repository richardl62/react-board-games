import React from "react";
import styled from "styled-components";
import { ScoreCategory, displayName } from "../server-side/score-categories";
import { scoreCardBackgroundColor, scoreCardBoarderColor } from "./style";

const ScoreElementDiv = styled.div`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
`;

export const ColumnHeader = styled.div<{activePlayer?: boolean}>`
    background-color: ${scoreCardBoarderColor};
    color: white; //Kludge - not defined in styles.ts
    padding: 1px;  // Kludge - copied from ScoreElement
    font-weight: bold;
    text-align: center;

    text-decoration: ${props => props.activePlayer ? "underline" : "none"};
`;

interface CategoryLabelProps {
    category: ScoreCategory;
}
export function CategoryLabel({category}: CategoryLabelProps) : JSX.Element {
    return <ScoreElementDiv> {/* KLUDGE */}
        {displayName[category]}
    </ScoreElementDiv>;
}

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