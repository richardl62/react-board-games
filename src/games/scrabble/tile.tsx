import styled from "styled-components";
import { Letter, letterScore } from "./letter-properties";
import { squareSize, tileBackgroundColor, tileHighlightColor, tileTextColor } from "./style"

interface StyledTileProps {
    markAsMovable: boolean
} 

function styleTitleBorderWidth(props: StyledTileProps) {
    return `calc(${squareSize} * ${props.markAsMovable ? 0.1: 0.0})`;
}

const Placeholder = styled.div`
    position:relative;
    width: 100%;
    height: 100%;
`;

const Background = styled.div<StyledTileProps>`
    position: absolute;
    z-index: 0;
    color: ${tileTextColor};
    background-color: ${tileBackgroundColor};
    border: ${styleTitleBorderWidth} ${tileHighlightColor} solid;
    width: 100%;
    height: 100%;
`;

const StyledLetter = styled.div`
    position: absolute;
    z-index: 0;
    color: ${tileTextColor};
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
    // True for titles that should marked as moveable.
    // (This is used for titles on the board that were played during the current
    // turn.)
    markAsMovable?: boolean;
}

export function Tile({letter, markAsMovable} : TileProps) {
    const score = letterScore(letter);
    return (
        <Placeholder>
            <Background markAsMovable={Boolean(markAsMovable)} />
            <StyledLetter>
                {letter}
                <Score>{score}</Score>
            </StyledLetter>
        </Placeholder>
    )
}


