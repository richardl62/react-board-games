import { JSX } from "react";
import styled from "styled-components";
import { playerColor } from './styles';
import { useMatchState } from "../match-state/match-state";
import * as styles from "./styles"

const SubSquareDiv = styled.div`
    height: ${styles.subSquare.height};
    width: ${styles.subSquare.width};
    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;
    overflow: hidden;
`;

const Solid = styled.div<{ color: string }>`
    height: 100%;
    width: 100%;
    background-color: ${({ color }) => color};
`;

const Peg = styled.div<{ solid: boolean }>`
    height: 80%;
    width: 80%;
    border-radius: 999px;
    border: 3px solid var(--playerColor);

    background-color: ${({solid}) => solid ? "var(--playerColor)" : "transparent"};

    box-sizing: border-box;
`;

const BlockedDiv = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
`;

function Blocked() {
    return <BlockedDiv>
        <svg viewBox="0 0 100 100" width="100%" height="100%">
            <circle cx="50" cy="50" r="40" fill="white" stroke="black" strokeWidth="8" />
            <line x1="25" y1="25" x2="75" y2="75" stroke="black" strokeWidth="8" />
        </svg>
    </BlockedDiv>;
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
        indicator = <Peg solid={true}/>;
    } else if (isCovered(heights.thisScoringChoice, height)) {
        indicator = <Peg solid={false}/>;
    }

    return <SubSquareDiv>
        {indicator}
        {showAsBlocked && <Blocked />}
    </SubSquareDiv>
}
