import { columnValues, maxColumnHeight } from "@shared/game-control/games/cant-stop/config";
import { JSX } from "react";
import styled from "styled-components";

const border = "2px solid black";

const ColumnsDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const colBorderLeft = (val: number) => val <= 7 ? border : "none";
const colBorderRight = (val: number) => val >= 7 ? border : "none";

// KLUDGE? To help keep squares aligned, the bottom border comes from the
// square rather than the column.
const ColumnDiv = styled.div< {colValue: number }>`
    border-top: ${border};
    ${(props) => `border-left: ${colBorderLeft(props.colValue)};`}
    ${(props) => `border-right: ${colBorderRight(props.colValue)};`}
`;

const Square = styled.div< {height: number }>`      
    width: 40px;
    height: 40px;
    background-color: cornsilk;

    border-bottom: ${border};
`;

function Column({ colValue }: { colValue: number }) : JSX.Element {
    const squares = [];
    for(let height = maxColumnHeight(colValue)-1; height >= 0; height--) {
        squares.push(
            <Square key={height} height={height}> {height} </Square>
        );
    }

    return <ColumnDiv colValue={colValue}> {squares} </ColumnDiv>;
}

export function Columns() : JSX.Element {
   return <ColumnsDiv>
     {columnValues.map((colValue) =>
        <div key={colValue}>
            <div>{colValue}</div> 
            <Column colValue={colValue} />
            <div>{colValue}</div>
        </div>
    )}
   </ColumnsDiv>; 
}