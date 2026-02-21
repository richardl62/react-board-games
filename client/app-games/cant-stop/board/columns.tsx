import { columnValues, maxColumnHeight } from "@shared/game-control/games/cant-stop/config";
import { JSX } from "react";
import styled from "styled-components";
import { Square } from "./square";
import { squareBorder as border, playerColor } from "./styles";

const ColumnsDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;

    margin-left: 1rem;
`;

const colBorderLeft = (val: number) => val <= 7 ? border : "none";
const colBorderRight = (val: number) => val >= 7 ? border : "none";

// KLUDGE? To help keep squares aligned, the bottom border comes from the
// square or CompletedColumn rather than ColumnDiv.
const ColumnDiv = styled.div< {$colValue: number }>`
    border-top: ${border};
    ${(props) => `border-left: ${colBorderLeft(props.$colValue)};`}
    ${(props) => `border-right: ${colBorderRight(props.$colValue)};`}
    position: relative;
`;

const CompletedColumn = styled.div<{ color: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ color }) => color};
    border-bottom: ${border};
`;

const ColumnLabel = styled.div`
    text-align: center;
`

function Column({ colValue }: { colValue: number }) : JSX.Element {
    const squares = [];
    for(let height = maxColumnHeight(colValue)-1; height >= 0; height--) {
        squares.push(<Square key={height} colValue={colValue} height={height} />);
    }

    const full = false; //colValue === 6; // For temporary testing.

    return <ColumnDiv $colValue={colValue}> 
        {squares} 
        {full && <CompletedColumn color={playerColor("3")} />}
    </ColumnDiv>;
}

export function Columns() : JSX.Element {
   return <ColumnsDiv>
     {columnValues.map((colValue) =>
        <div key={colValue}>
            <ColumnLabel>{colValue}</ColumnLabel> 
            <Column colValue={colValue} />
            <ColumnLabel>{colValue}</ColumnLabel>
        </div>
    )}
   </ColumnsDiv>; 
}