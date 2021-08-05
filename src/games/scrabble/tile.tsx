import React from "react";
import styled from "styled-components";
import { Letter, letterScore } from "./scrabble-game-properties";
import { moveableTileBorder, squareSize, tileBackgroundColor, tileTextColor } from "./style"

const StyledLetter = styled.div`
    display:relative;
    z-index: 0;
    color: ${tileTextColor};
    background-color: ${tileBackgroundColor};
    font-size: calc(${squareSize} * 0.8);
    text-align: center;
    width: 100%;
    height: 100%;
`;

const Score = styled.span`
    position: relative;
    font-size: 50%;
    top: 20%;
`;

const Marker = styled.div`
    position: absolute;
    z-index: 1;
    top: 0;
    border: ${moveableTileBorder};
    width: 100%;
    height: 100%;
`;

interface TileProps {
    letter: Letter;
    // True for titles that should marked as moveable.
    // (This is used for titles on the board that were played during the current
    // turn.)
    markAsMoveable?: boolean;
}

export function Tile({ letter, markAsMoveable }: TileProps) {
    const score = letterScore(letter);
    return (
        <StyledLetter>
            {letter}
            <Score>{score}</Score>
            {markAsMoveable ? <Marker /> : null}
        </StyledLetter>
    )
}


