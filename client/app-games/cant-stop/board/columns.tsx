import { columnValues } from "@shared/game-control/games/cant-stop/config";
import { JSX } from "react";
import styled from "styled-components";
import { useMatchState } from "../match-state/match-state";
import { Column } from "./column";

const ColumnsDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: 1rem;
`;

const ColumnLabel = styled.div<{inPlay: boolean}>`
    text-align: center;
    color: ${(props) => props.inPlay ? "var(--playerColor)" : "inherit"};
`;

// Columns are centered vertically. 
// KLUDGE?: Rely on the centering to ensure that square boundaries align as required.
export function Columns(): JSX.Element {
    const { playerID, G: {columnHeights} } = useMatchState();

    const inPlay = (colValue: number) => {
        const heights = columnHeights[playerID][colValue];
        return heights.owned !== heights.thisScoringChoice;
    }

    return <ColumnsDiv>
        {columnValues.map((colValue) =>
            <div key={colValue}>
                <ColumnLabel inPlay={inPlay(colValue)}>{colValue}</ColumnLabel>
                <Column colValue={colValue} />
                <ColumnLabel inPlay={inPlay(colValue)}>{colValue}</ColumnLabel>
            </div>
        )}
    </ColumnsDiv>;
}