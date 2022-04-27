import React from "react";
import { useDrag } from "react-dnd";
import styled from "styled-components";
import { bonusLetters, Letter } from "../config";
import { squareSize, tileTextColor, tileBackgroundColor } from "./style";

const TileDiv = styled.div<{bonus: boolean}>`
    height: ${squareSize};
    width: ${squareSize};
    font-size: calc(${squareSize}*0.8);

    color: ${tileTextColor};
    background-color: ${tileBackgroundColor};
    
    text-align: center;

    text-decoration: ${props => props.bonus? "underline" : "none"};
`;

interface TileProps {
    letter: Letter;
    dragRef?: ReturnType<typeof useDrag>[1];
}

export function Tile(props: TileProps) : JSX.Element {
    const { letter, dragRef } = props;

    return <TileDiv ref={dragRef} bonus={bonusLetters.includes(letter)}>
        {letter}
    </TileDiv>;
}