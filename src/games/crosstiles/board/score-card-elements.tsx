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

export const OptionalScore = styled.div`
    background-color: ${optionalScoreBackgroundColor};
    text-align: center;
    text-decoration: underline;
`;
