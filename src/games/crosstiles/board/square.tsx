import React from "react";
import styled from "styled-components";
import { bonusLetters, Letter } from "../config";
import { squareBackgroundColor, squareSize, tileBackgroundColor, tileTextColor } from "./style";

const EmptySquare = styled.div`
    height: ${squareSize};
    width: ${squareSize};

    background-color: ${squareBackgroundColor};
`;


const TileDiv = styled.div<{bonus: boolean}>`
    height: ${squareSize};
    width: ${squareSize};
    font-size: calc(${squareSize}*0.8);

    color: ${tileTextColor};
    background-color: ${tileBackgroundColor};
    
    text-align: center;

    text-decoration: ${props => props.bonus? "underline" : "none"};
`;

interface SquareProps {
    letter: Letter | null;
}

export function Square(props: SquareProps) : JSX.Element {
    const {letter} = props;

    return <EmptySquare>
        {letter && 
            <TileDiv bonus={bonusLetters.includes(letter)}>
                {letter}
            </TileDiv>
        }
    </EmptySquare>;
}
