import { JSX } from "react";
import styled from "styled-components";
import { playerColor, temporaryOwnerColor } from "./styles";
import { useMatchState } from "../match-state/match-state";

const subSquareWidth = "12px";

const SubSquareDiv = styled.div`
    height: 40px;
    width: ${subSquareWidth};
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
`;

const Solid = styled.div<{ color: string }>`
    height: 100%;
    width: 100%;
    background-color: ${({ color }) => color};
`;

const Peg = styled.div<{ color: string }>`
    height: 80%;
    width: 80%;

    background-color: ${({ color }) => color};
    border-radius: 999px; //Arbitrary large value to make ends semi-circular.
    position: relative;
`;

const BlockedDiv = styled.div`
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

function Blocked() {
    return <BlockedDiv>🚫</BlockedDiv>;
}

function isCovered(heightCovered: number | "full", currentHeight: number) {
    return heightCovered === "full" || currentHeight < heightCovered;
}

export function SubSquare({playerID, colValue, height }: {playerID: string, colValue: number, height: number}) : JSX.Element {
    const { ctx, isBlocked, G: { columnHeights } } = useMatchState();

    const heights = columnHeights[playerID][colValue];
    const showAsBlocked = isBlocked({ playerID, column: colValue, height }) && ctx.currentPlayer === playerID;

    let indicator = null;
    if (isCovered(heights.owned, height)) {
        indicator = <Solid color={playerColor(playerID)} />;
    } else if (isCovered(heights.thisTurn, height)) {
        indicator = <Peg color={playerColor(playerID)} />;
    } else if (isCovered(heights.thisScoringChoice, height)) {
        indicator = <Peg color={temporaryOwnerColor} />;
    }

    return <SubSquareDiv>
        {indicator}
        {showAsBlocked && <Blocked />}
    </SubSquareDiv>
}
