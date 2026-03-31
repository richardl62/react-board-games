import { maxColumnHeight } from "@shared/game-control/games/cant-stop/config";
import { JSX } from "react";
import styled from "styled-components";
import { useMatchState } from "../match-state/match-state";
import { colors, playerColor  } from './styles';
import { squareBorder } from "./styles";
import { SubSquare } from "./sub-square";

const colBorderLeft = (val: number) => val <= 7 ? squareBorder : "none";
const colBorderRight = (val: number) => val >= 7 ? squareBorder : "none";

// KLUDGE? To help keep squares aligned, the bottom border comes from the
// SquareDiv or CompletedColumn rather than ColumnDiv.
const ColumnDiv = styled.div< {$colValue: number }>`
    position: relative;

    border-top: ${squareBorder};
    border-left: ${(props) => colBorderLeft(props.$colValue)};
    border-right: ${(props) => colBorderRight(props.$colValue)};
    border-bottom: ${squareBorder};

    & > :not(:last-child) {
        border-bottom: ${squareBorder};
    }
`;

const SquareDiv = styled.div`
    display: flex;
    flex-direction: row;

    background-color: ${colors.board.background};
`;

const CompletedColumn = styled.div<{ owner: string }>`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: ${({ owner }) => playerColor(owner)};
`;

// A column is either:
// - A vertical stack of squares, each of which contains one sub-square per player.
// - Or a solid color if the column is full.
export function Column({ colValue }: { colValue: number }) : JSX.Element {
    const { isFull, ctx } = useMatchState();
    
    // KLUDGE?: Squares are always rendered. The complete column indicator, if any, is then
    // rendered on top of them. This helps ensure the completed column indicator is the required size.
    const squares = [];
    for(let height = maxColumnHeight(colValue)-1; height >= 0; height--) {
        squares.push(
            <SquareDiv key={height}>
                {ctx.playOrder.map((playerID) =>
                    <SubSquare key={playerID} playerID={playerID} colValue={colValue} height={height} />)
                }
            </SquareDiv>
        );
    }

    const owner = isFull(colValue, "owned");

    return <ColumnDiv $colValue={colValue}> 
        {squares} 
        {owner && <CompletedColumn owner={owner} />}
    </ColumnDiv>;
}