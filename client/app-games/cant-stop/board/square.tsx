import { JSX } from "react";
import styled from "styled-components";
import { squareBorder as border, playerColor, temporaryOwnerColor } from "./styles";



const SquareDiv = styled.div`
    display: flex;
    flex-direction: row;


    background-color: cornsilk;

    border-bottom: ${border};

    & > :not(:last-child) {
        border-right: ${border}; // Only the color is used.
        border-right-style: dashed;
        border-right-width: 1px;
    }
`;

const SubSquare = styled.div`
    height: 40px;
    width: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
`;


const Owned = styled.div<{ color: string }>`
    height: 100%;
    width: 100%;
    background-color: ${({ color }) => color};
`;

const ThisTurn = styled.div<{ color: string }>`
    height: 80%;
    width: 80%;

    background-color: ${({ color }) => color};
    border-radius: 999px; //Arbitry large value to make ends semi-circular.
`;


export function Square(_props: {colValue: number, height: number}  ) : JSX.Element {
    return <SquareDiv>
        <SubSquare> <ThisTurn color={playerColor(0)} /> </SubSquare>
        <SubSquare> </SubSquare >
        <SubSquare> <Owned color={playerColor(2)} /> </SubSquare>
        <SubSquare>
             <ThisTurn color={temporaryOwnerColor} /> 
        </SubSquare>
    </SquareDiv>;
}