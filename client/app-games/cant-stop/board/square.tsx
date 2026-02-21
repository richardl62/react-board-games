import { JSX } from "react";
import styled from "styled-components";
import { squareBorder as border, playerColor, temporaryOwnerColor } from "./styles";

const subSquareWidth = "12px";

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
    width: ${subSquareWidth};
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
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
    border-radius: 999px; //Arbitrary large value to make ends semi-circular.
    position: relative;
`;

const CrossDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Noto Sans', sans-serif;
    font-size: ${subSquareWidth};
`;

function Cross() {
    return <CrossDiv>🚫</CrossDiv>;
}


// Dummy implementation to test SquareDiv etc.
export function Square(_props: {colValue: number, height: number}  ) : JSX.Element {
    return <SquareDiv>
        <SubSquare> 
            <ThisTurn color={playerColor(2)} /> 
            <Cross />
        </SubSquare>

        <SubSquare> 
            <Cross />
        </SubSquare >

        <SubSquare> 
            <Owned color={playerColor(1)} /> 
        </SubSquare>
        
        <SubSquare>
             <ThisTurn color={temporaryOwnerColor}>
                <Cross />
             </ThisTurn> 
        </SubSquare>
    </SquareDiv>;
}