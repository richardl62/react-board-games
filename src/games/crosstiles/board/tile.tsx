import React from "react";
import styled from "styled-components";
import { bonusLetters, Letter } from "../config";
import { squareSize, tileBackgroundColor, tileTextColor } from "./style";


const TileDiv = styled.div<{underline: boolean}>`
    height: ${squareSize};
    width: ${squareSize};
    font-size: calc(${squareSize}*0.8);

    color: ${tileTextColor};
    background-color: ${tileBackgroundColor};
    
    font-size: calc(${squareSize} * 0.8);
    text-align: center;

    text-decoration: ${props => props.underline? "underline" : "none"};
`;

interface TileProps {
    letter?: Letter | null;
}
export function Tile(props: TileProps) : JSX.Element {
    const {letter} = props;

    const bonus = Boolean(letter && bonusLetters.includes(letter));

    return <TileDiv underline={bonus}>{letter}</TileDiv>;
}
