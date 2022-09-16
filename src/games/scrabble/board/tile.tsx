import React from "react";
import styled from "styled-components";
import { CoreTile, tileScore } from "../client-side";
import { squareSize, tileBackgroundColor, tileTextColor } from "./style";

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

interface TileProps {
    tile: CoreTile;
}

export function Tile({ tile }: TileProps): JSX.Element {
    const score = tileScore(tile);
    return (
        <StyledLetter>
            {tile.letter}
            <Score>{score}</Score>
        </StyledLetter>
    );
}