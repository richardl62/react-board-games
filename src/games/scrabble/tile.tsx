import styled from "styled-components";
import { Letter, letterScore } from "./game-properties";
import { squareSize, tileBackgroundColor, tileTextColor } from "./style";

const StyledTile = styled.div`
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
    letter: Letter;
}

export function Tile({letter} : TileProps) {
    const score = letterScore(letter);
    return <StyledTile>
        {letter}
        <Score>{score}</Score>
    </StyledTile>
}


