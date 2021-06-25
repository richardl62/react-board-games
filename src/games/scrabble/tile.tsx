import styled from "styled-components";
import { squareSize } from "../../boards";

const StyledTile = styled.div`
    font-size: calc(${squareSize} * 0.8);
`;

interface TileProps {
    letter: string;
}

export function Tile({letter} : TileProps) {
    return <StyledTile>{letter}</StyledTile>
}


