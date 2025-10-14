import styled from "styled-components";
import {optionalScoreBackgroundColor, scoreCardBackgroundColor, scoreCardBoarderColor, scoreCardHeaderTextColor } from "./style";

const ScoreElementDiv = styled.div<{recentlyChosen?: boolean}>`
    background-color: ${scoreCardBackgroundColor};
    padding: 1px;  
    text-decoration: ${props => props.recentlyChosen ? "underline" : "none" };
    text-align: end;
`;

export const ColumnHeader = styled.div<{activePlayer?: boolean}>`
    background-color: ${scoreCardBoarderColor};
    color: ${scoreCardHeaderTextColor};
    padding: 1px 6px;
    font-weight: bold;
    text-decoration: ${props => props.activePlayer ? "underline" : "none"};
`;

export const KnownScore = ScoreElementDiv;

function oSBackgroundColor(self: boolean) {
    return self ? optionalScoreBackgroundColor.self : 
        optionalScoreBackgroundColor.other;
}

export const OptionalScore = styled.div<{onClick?:()=>void}>`
    background-color: ${props => oSBackgroundColor(Boolean(props.onClick))};
    text-align: center;

    /* text-decoration: ${props => props.onClick ? "underline" : "none"}; */
`;
